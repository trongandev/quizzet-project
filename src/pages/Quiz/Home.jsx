import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchBook, get } from "../../utils/request";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function Home() {
    const [quiz, setQuiz] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const querySnapshot = await getDocs(collection(db, "quiz"));
            querySnapshot.forEach((doc) => {
                setQuiz((prev) => [
                    ...prev,
                    {
                        id: doc.id,
                        data: doc.data(),
                    },
                ]);
            });
        };
        fetchBook();
    }, []);

    console.log(quiz);
    return (
        <div className=" ">
            <div className="">
                <div className="bg-white p-5">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Chào mừng bạn đến với QuizzEt</h1>
                    <p className="text-sm md:text-md text-gray-500">
                        QuizzEt là trang web giúp bạn tạo ra các bài quiz online một cách dễ dàng và nhanh chóng. Bạn có thể tạo ra các câu hỏi, trả lời và chia sẻ với bạn bè.
                    </p>
                </div>
                <div className="bg-white p-5 mt-2 text-red-500 flex justify-between flex-col md:flex-row gap-3 md:gap-0">
                    <p>Dưới đây là một số quiz từ cộng đồng của chúng tôi</p>
                    <a href="/post">
                        <button className="bg-green-500 text-white">Thêm bài mới</button>
                    </a>
                </div>
                <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {quiz?.map((item) => (
                        <NavLink to={`/quiz/${item.id}`} className="relative" key={item.id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                <img src={item.data.img} alt="" className="h-[150px] w-full object-cover" />
                                <div className="p-3">
                                    <h1 className="text-lg group-hover:text-red-500 h-[28px]">{item.data.title}</h1>
                                    <p className="text-gray-500 line-clamp-2 h-[48px] my-3">{item.data.content}</p>
                                    <div className="text-right">
                                        <button className="bg-green-500 text-white">Làm bài ngay</button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0">
                                <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{item.data.date_post}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
                <div className=""></div>
            </div>
        </div>
    );
}
