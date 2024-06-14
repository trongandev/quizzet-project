import React, { useEffect, useState } from "react";
import { get, get_firebase, patch } from "../../utils/request";
import { Switch } from "antd";
import { getFirestore } from "firebase/firestore";

export default function TopicManager() {
    const [topic, setTopic] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const fetchTopic = await get_firebase(db, "quiz");
            console.log(fetchTopic);
            setTopic(fetchTopic);
        };
        fetchBook();
    }, []);

    console.log(topic);

    const handleChangeStatus = (id, status) => {
        const newTopic = topic.map((item) => {
            if (item.id === id) {
                item.status = !item.status;
            }
            return item;
        });
        setTopic(newTopic);

        patch(`questions/${id}`, { status: !status });
    };

    return (
        <div>
            <h1 className="text-lg text-green-500 font-bold">Quản lí tài khoản người dùng</h1>

            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right ">
                    <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hình ảnh
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên bài đăng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nội dung
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Ngày đăng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {topic &&
                            topic.map((item, index) => (
                                <tr className="bg-white border-b " key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <img src={item.img} className="w-[150px] h-[50px] object-cover" alt="" />
                                    </td>
                                    <td className="px-6 py-4">{item.title}</td>
                                    <td className="px-6 py-4 w-[150px]">{item.content}</td>

                                    <td className="px-6 py-4">{item.date_post}</td>
                                    <td className="px-6 py-4">
                                        {item.status ? (
                                            <div className="bg-green-200 text-green-500 rounded-full text-center px-1">Hiển thị</div>
                                        ) : (
                                            <div className="bg-red-200 text-red-500 rounded-full text-center px-1">Ẩn</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch checked={item.status} onClick={() => handleChangeStatus(item.id, item.status)} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
