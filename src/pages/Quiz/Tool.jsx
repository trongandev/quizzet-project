import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Tool() {
    const [data, setdata] = useState([
        {
            id: 1,
            name: "kttt",
            title: "Kinh tế chính trị",
            image: "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321140905939.jpg",
            description: "Các đáp án, ôn tập về bộ môn Kinh tế chính trị",
            date: "11/06/2024",
        },
        {
            id: 2,
            name: "ptdtck",
            title: "Phân tích đầu tư chứng khoán",
            image: "https://pinetree.vn/wp-content/uploads/2021/06/ph%C3%A2n-t%C3%ADch-c%C6%A1-b%E1%BA%A3n-fundamental-analysis.png",
            description: "Các đáp án, ôn tập về bộ môn phân tích đầu tư chứng khoán",
            date: "17/06/2024",
        },
        {
            id: 3,
            name: "ktqt",
            title: "Kinh tế quản trị",
            image: "https://hevobooks.com/wp-content/uploads/2022/01/Bia-Gt-KT-va-quan-tri-KD-Duoc_bia_1-scaled.jpg",
            description: "Các đáp án, ôn tập về bộ môn kinh tế quản trị",
            date: "17/06/2024",
        },
    ]);

    return (
        <div className="">
            <div className="bg-white p-5 mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    <NavLink to={`/tool/${item.name}`} className="relative" key={index}>
                        <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                            <img src={item.image} alt="" className="h-[150px] w-full object-cover" />
                            <div className="p-3">
                                <h1 className="text-lg text-green-500 font-bold h-[56px]">{item.title}</h1>
                                <p className="text-gray-500 line-clamp-2 h-[48px] my-1">{item.description}</p>
                                <div className="text-right">
                                    <button className="bg-green-500 text-white">Xem ngay</button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0">
                            <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{item.date}</p>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
