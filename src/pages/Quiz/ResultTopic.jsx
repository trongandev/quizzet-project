import { Avatar, Button, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineVerified } from "react-icons/md";
import { Link, NavLink, useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { get_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";

export default function ResultTopic() {
    const [topic, setTopic] = useState([]);

    const params = useParams();

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await get_api(`/quiz/subject/${params.id}`);
            setTopic(req.quiz);
        };
        fetchAPI();
    }, []);

    console.log(topic);

    return (
        <div>
            <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topic && topic.length === 0 ? (
                    <div>
                        <h1>Chưa có bài trắc nghiệm nào về chủ đề này...</h1>
                        <Link to="/post">
                            <Button type="primary" className="mt-3">
                                Hãy là người đầu tiên bổ sung chủ đề này 😍❤
                            </Button>
                        </Link>
                    </div>
                ) : (
                    ""
                )}
                {topic &&
                    topic?.map((item) => (
                        <NavLink to={`/quiz/${item.slug}`} key={item._id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                <img src={item.img} alt="" className="h-[150px] w-full object-cover" />
                                <div className="p-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                            <img src={item.uid.profilePicture} alt="" className="object-cover h-full" />
                                        </div>

                                        <div className="">
                                            <div className="flex items-center gap-1">
                                                <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{item.uid.displayName}</h2>
                                                {topic?.uid?.verify ? (
                                                    <Tooltip title="Tài khoản đã được xác thực">
                                                        <MdOutlineVerified color="#3b82f6" />
                                                    </Tooltip>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                    <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                    <div className="flex justify-between items-center">
                                        <p>Lượt làm: {item.noa}</p>
                                        <div className="text-right">
                                            <button className="bg-green-600 text-white">Làm bài ngay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))}
            </div>
        </div>
    );
}
