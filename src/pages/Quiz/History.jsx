import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoIosTimer } from "react-icons/io";
import Cookies from "js-cookie";
import { get_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const fetchHistory = async () => {
    const req = await get_api("/history");
    return req.history;
};

export default function History() {
    const navigate = useNavigate();

    const token = Cookies.get("token");
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                navigate("/login");
            },
        });
    }

    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ["history"],
        queryFn: fetchHistory,
    });

    return (
        <>
            <div className="p-5 md:p-0">
                <p className="text-2xl font-bold text-green-500">Lịch sử làm bài</p>
                {historyData === undefined ? "Bạn chưa có lịch sử làm bài..." : ""}
                <div className="grid md:grid-cols-4 gap-5 my-5 relative grid-cols-1 ">
                    {historyData &&
                        historyData.map((item) => (
                            <div key={item.id} className="bg-white border-[1px] shadow-md">
                                <div className="p-3 ">
                                    <h1 className="text-lg mb-3 text-green-500 font-bold h-[56px] line-clamp-2">{item.title}</h1>
                                    <p>
                                        Số câu đúng:{" "}
                                        <label className="text-green-500 font-bold">
                                            {item.score}/{item.lenght}
                                        </label>{" "}
                                    </p>
                                    <p className="text-gray-500 flex gap-1 items-center">
                                        <IoIosTimer /> {handleCompareDate(item.date)}
                                    </p>
                                    <Link to={`/answer/${item._id}`} className="block text-right mt-3">
                                        <button className="bg-green-500 text-white ">Xem chi tiết</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
                {historyLoading && (
                    <div className="h-[400px] flex items-center justify-center w-full">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}
            </div>
        </>
    );
}
