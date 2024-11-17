"use client";
import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { LoadingOutlined } from "@ant-design/icons";
import { GET_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchHistory = async () => {
            const req = await GET_API("/history/admin", token);
            if (req.ok) {
                setLoading(true);
                setHistory(req.history);
                messageApi.success("Lấy thành công lịch sử làm bài!");
            } else {
                messageApi.error(req.message);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            {contextHolder}
            <h1 className="text-lg text-green-500 font-bold">Lịch sử làm bài</h1>

            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right ">
                    <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên người làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên bài làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nội dung
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Ngày làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Số câu đúng
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading &&
                            history &&
                            history.map((item, index) => (
                                <tr className="bg-white border-b hover:bg-gray-100 hover:cursor-pointer" key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <Link href={`/profile/${item.uid._id}`}>
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                <Image
                                                    src={item.uid.profilePicture}
                                                    alt=""
                                                    className="object-cover h-full w-full absolute"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <p>{item.uid.displayName}</p>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 hover:text-red-500 hover:underline">
                                        <Link target="_blank" href={`/dapan/${item._id}`} rel="noreferrer">
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{item.content}</td>

                                    <td className="px-6 py-4">{handleCompareDate(item.date)}</td>
                                    <td className="px-6 py-4">
                                        <p>
                                            {item.score}/{item.lenght}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {!loading && (
                    <div className="w-full h-[500px] flex items-center justify-center">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                )}
            </div>
        </div>
    );
}
