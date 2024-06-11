import React from "react";
import { NavLink } from "react-router-dom";

export default function Tool() {
    return (
        <div className="">
            <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <NavLink to={`/tool/kttt`} className="relative">
                    <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                        <img src="https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321140905939.jpg" alt="" className="h-[150px] w-full object-cover" />
                        <div className="p-3">
                            <h1 className="text-lg text-green-500 font-bold h-[28px]">Kinh tế chính trị</h1>
                            <p className="text-gray-500 line-clamp-2 h-[48px] my-3">Các đáp án, ôn tập về bộ môn Kinh tế chính trị</p>
                            <div className="text-right">
                                <button className="bg-green-500 text-white">Xem ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0">
                        <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">11/06/2024</p>
                    </div>
                </NavLink>
            </div>
        </div>
    );
}
