import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { get_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";

export default function Tool() {
    const [data, setdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            const req = await get_api("/admin/suboutline");
            setdata(req);
            setIsLoading(false);
        };
        fetchTool();
    }, []);
    return (
        <div className="">
            {isLoading ? (
                <div className="h-[400px] flex items-center justify-center w-full">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
            ) : (
                <div className="bg-white px-2 py-5 mt-2 grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-4">
                    {data &&
                        data.map((item, index) => (
                            <NavLink to={`/decuong/${item.slug}`} className="relative" key={index}>
                                <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                    <img src={item.image} alt="" className="h-[150px] w-full object-cover" />
                                    <div className="p-3">
                                        <h1 className="text-[15px] text-green-500 font-bold h-[48px] line-clamp-2">{item.title}</h1>
                                        <p className="text-[13px] mb-2">
                                            Tổng câu hỏi: <label className="text-red-500 font-bold">{item.lenght}</label>{" "}
                                        </p>
                                        <button className="bg-green-600 text-white">Xem ngay</button>
                                    </div>
                                </div>
                                <div className="absolute top-0 left-0">
                                    <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{handleCompareDate(item.date)}</p>
                                </div>
                            </NavLink>
                        ))}
                </div>
            )}
        </div>
    );
}
