"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoIosTimer } from "react-icons/io";
import Cookies from "js-cookie";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GET_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";

export default function History() {
    const [historyData, setHistoryData] = useState();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");

    const fetchHistory = async () => {
        const req = await GET_API("/history", token);
        setHistoryData(req.history);
        setLoading(true);
    };

    useEffect(() => {
        fetchHistory();
    }, []);
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                router.push("/login");
            },
        });
    }

    return (
        <>
            <div className=" md:p-0 text-third md:h-screen px-2 md:px-0">
                <p className="text-2xl font-bold text-primary">Lịch sử làm bài</p>
                {historyData === undefined ? "Bạn chưa có lịch sử làm bài..." : ""}
                <div className="grid md:grid-cols-4 gap-5 my-5 relative grid-cols-2 ">
                    {historyData &&
                        historyData.map((item) => (
                            <div key={item.id} className="bg-white border-[1px] shadow-md rounded-xl">
                                <div className="p-3 ">
                                    <h1 className="text-lg mb-3 text-primary font-bold h-[56px] line-clamp-2">{item.title}</h1>
                                    <p>
                                        Số câu đúng:{" "}
                                        <label className="text-primary font-bold">
                                            {item.score}/{item.lenght}
                                        </label>{" "}
                                    </p>
                                    <p className="text-gray-500 flex gap-1 items-center">
                                        <IoIosTimer /> {handleCompareDate(item.date)}
                                    </p>
                                    <Link href={`/dapan/${item._id}`} className="block text-right mt-3">
                                        <button className="">Xem chi tiết</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
                {!loading && (
                    <div className="h-[400px] flex items-center justify-center w-full">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}
            </div>
        </>
    );
}
