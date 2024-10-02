import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { Avatar, Tooltip } from "antd";
import { MdOutlineVerified } from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";
import Tool from "./Tool";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { get_api } from "../../services/fetchapi";
import { jwtDecode } from "jwt-decode";
import { setNewUser } from "../../reducers/userSlice";
import handleCompareDate from "../../utils/compareData";

export default function Home() {
    const [quiz, setQuiz] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    useEffect(() => {
        const fetchProfileAndQuiz = async () => {
            try {
                const decoded = token ? jwtDecode(token) : null;
                const userId = decoded?.user?.id;

                // Tạo các promise cho cả hai API
                const profilePromise = userId ? get_api("/profile/" + userId) : Promise.resolve(null);
                const quizPromise = get_api("/quiz");

                // Thực hiện song song các lệnh gọi API
                const [profileResponse, quizResponse] = await Promise.all([profilePromise, quizPromise]);

                // Cập nhật state và dispatch kết quả từ profile API
                if (profileResponse) {
                    dispatch(setNewUser(profileResponse.user));
                }

                // Cập nhật state với kết quả từ quiz API
                setQuiz(quizResponse.quiz);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                // Kết thúc loading
                setIsLoading(false);
            }
        };

        // Chỉ gọi fetch khi có token
        if (token !== undefined) {
            fetchProfileAndQuiz();
        }
    }, [dispatch, token]);
    return (
        <div className=" ">
            <div className="">
                <div className="bg-white p-5">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Chào mừng bạn đến với QuizzEt</h1>
                    <p className="text-sm md:text-md text-gray-500">
                        QuizzEt là trang web giúp bạn tạo ra các bài quiz online một cách dễ dàng và nhanh chóng. Bạn có thể tạo ra các câu hỏi, trả lời và chia sẻ với bạn bè.
                    </p>
                </div>
                <div className="bg-white p-5 mt-2 text-red-500 flex justify-between items-center flex-col md:flex-row gap-3 md:gap-0">
                    <p>Bạn có thể thêm bài quiz mới ở đây</p>
                    <Link to="/post">
                        <button className="bg-green-500 text-white">Thêm bài mới</button>
                    </Link>
                </div>
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                ) : (
                    <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quiz &&
                            quiz?.map((item) => (
                                <div key={item._id}>
                                    <div className=" shadow-md border-2 rounded-lg overflow-hidden">
                                        <Link to={`/quiz/${item.slug}`} className="block w-full h-[150px] overflow-hidden">
                                            <img src={item.img} alt="" className="h-full w-full object-cover hover:scale-110 duration-300" />
                                        </Link>
                                        <div className="p-3">
                                            <Link to={`/profile/${item.uid._id}`} className="flex items-center gap-2 mb-3 ">
                                                <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                    <img src={item.uid.profilePicture} alt="" className="object-cover h-full" />
                                                </div>
                                                <div className="group">
                                                    <div className="flex items-center gap-1">
                                                        <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden group-hover:underline">{item.uid.displayName}</h2>
                                                        {item.uid.verify ? (
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
                                            </Link>
                                            <h1 className="text-lg h-[28px] lg:h-[56px] font-bold text-gray-800">{item.title}</h1>
                                            <p className="text-gray-700 line-clamp-2 h-[23px] lg:h-[45px] my-3 text-[15px]">{item.content}</p>
                                            <div className="flex justify-between items-center">
                                                <p>Lượt làm: {item.noa}</p>
                                                <Link to={`/quiz/${item.slug}`} className="text-right">
                                                    <button className="bg-green-600 text-white">Làm bài ngay</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                <div className="bg-white p-5 mt-2 text-red-500 ">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Một số tài liệu ôn các môn chuyên ngành</h1>
                    <p className="text-sm md:text-md text-gray-500">Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để gửi tài liệu cho mình nhá 😍😍</p>
                    <a href="mailto: thngan25k3@gmail.com">
                        <button className="bg-green-500 text-white mt-2">Yêu cầu tài liệu mới</button>
                    </a>
                </div>
                <div className="bg-white ">
                    <Tool />
                </div>
            </div>
        </div>
    );
}
