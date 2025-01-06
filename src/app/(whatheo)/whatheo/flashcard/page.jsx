"use client";
import React, { useEffect, useState } from "react";
import { Switch, message, Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { IoLockClosedSharp } from "react-icons/io5";
import { RiGlobalLine } from "react-icons/ri";

export default function Flashcard() {
    const [flashcard, setFlashcard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSwitch, setLoadingSwitch] = useState(false);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            const req = await GET_API("/list-flashcards/admin", token);
            setFlashcard(req);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleUpdateProfile = async (id, value) => {
        setLoadingSwitch(true);
        const req = await POST_API(`/profile`, { id, ...value }, "PATCH", token);
        const data = req.json();
        if (req.ok) {
            setLoadingSwitch(false);
            const newUser = user.map((item) => {
                if (item._id === id) return { ...item, ...value };
                return item;
            });
            setUser(newUser);
            messageApi.success(data.message);
        } else {
            messageApi.error(data.message);
        }
    };

    return (
        <div className="">
            {contextHolder}
            <div className="">
                <h1 className="text-lg text-green-500 font-bold">Quản lí flashcard</h1>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left rtl:text-right ">
                        <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Người tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tiêu đề
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngôn ngữ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mô tả
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Chế độ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số lượng thẻ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {flashcard.length != 0 &&
                                flashcard?.map((item, index) => (
                                    <tr className="bg-white border-b " key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">
                                            <Link href={`/profile/${item?.userId?._id}`}>
                                                <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={item?.userId?.profilePicture}
                                                        alt=""
                                                        className="object-cover h-full absolute"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                                <p>{item?.userId?.displayName}</p>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/flashcard/${item?._id}`}>{item?.title}</Link>
                                        </td>
                                        <td className="px-6 py-4">{item?.language}</td>
                                        <td className="px-6 py-4">{item?.desc}</td>
                                        <td className="px-6 py-4">
                                            {item.public ? (
                                                <div className="bg-green-200 text-green-500 rounded-md text-center w-[35px] h-[25px] flex items-center justify-center">
                                                    <RiGlobalLine />
                                                </div>
                                            ) : (
                                                <div className="bg-red-200 text-red-500 rounded-md text-center w-[35px] h-[25px] flex items-center justify-center">
                                                    <IoLockClosedSharp />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">{item?.flashcards?.length}</td>
                                        <td className="px-6 py-4">{item?.created_at && handleCompareDate(item?.created_at)}</td>
                                    </tr>
                                ))}
                            {flashcard.length === 0 && <p className="text-primary">Không có tài liệu nào...</p>}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="w-full h-[500px] flex items-center justify-center">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
