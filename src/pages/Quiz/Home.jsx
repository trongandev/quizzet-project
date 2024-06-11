import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { get } from "../../utils/request";

export default function Home() {
    const [quiz, setQuiz] = useState();

    useEffect(() => {
        const fetchQuiz = async () => {
            const response = await get("topic");
            setQuiz(response);
        };
        fetchQuiz();
    }, []);

    return (
        <div className=" ">
            <div className="">
                <div className="bg-white p-5">
                    <h1 className="text-2xl text-green-700 font-bold">Chào mừng bạn đến với QuizzEt</h1>
                    <p className="text-gray-500">
                        QuizzEt là trang web giúp bạn tạo ra các bài quiz online một cách dễ dàng và nhanh chóng. Bạn có thể tạo ra các câu hỏi, trả lời và chia sẻ với bạn bè.
                    </p>
                </div>
                <div className="bg-white p-5 mt-2 text-red-500 flex justify-between">
                    <p>Dưới đây là một số quiz từ cộng đồng của chúng tôi</p>
                    <a href="/post">
                        <button className="bg-green-500 text-white">Thêm bài mới</button>
                    </a>
                </div>
                <div className=""></div>
                <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {quiz?.map((item) => (
                        <NavLink to={`/quiz/${item.id}`} className="relative" key={item.id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                <img src={item.img} alt="" className="h-[150px] w-full object-cover" />
                                <div className="p-3">
                                    <h1 className="text-lg group-hover:text-red-500 h-[28px]">{item.title}</h1>
                                    <p className="text-gray-500 line-clamp-2 h-[48px] my-3">{item.content}</p>
                                    <div className="text-right">
                                        <button className="bg-green-500 text-white">Làm bài ngay</button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0">
                                <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{item.date_post}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
