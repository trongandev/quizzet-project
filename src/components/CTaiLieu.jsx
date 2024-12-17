"use client";
import handleCompareDate from "@/lib/CompareDate";
import { GET_API, GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEye, FaRegQuestionCircle } from "react-icons/fa";

export default function CTaiLieu({ toolData }) {
    const router = useRouter();
    const handleChangeRouterDeCuong = async (item) => {
        await GET_API_WITHOUT_COOKIE(`/admin/suboutline/view/${item._id}`);
        router.push(`/decuong/${item.slug}`);
    };

    return (
        <div className="">
            {!toolData && (
                <div className="h-[400px] flex items-center justify-center w-full">
                    <Spin className="text-primary" indicator={<LoadingOutlined spin />} size="large" />
                </div>
            )}
            <div className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-4">
                {toolData?.map((item, index) => (
                    <div className="bg-white rounded-xl h-[200px] flex flex-col md:flex-row overflow-hidden text-third shadow-sm " key={index}>
                        <div className="relative flex-1">
                            <Image src={item.image} alt={item.title} className="object-cover absolute" priority fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            <div className="absolute z-1 bottom-0 bg-linear-item w-full text-white text-[10px] p-2 font-bold ">
                                <p className="flex gap-1 items-center">
                                    <FaRegQuestionCircle />
                                    Số câu hỏi: {item.lenght}
                                </p>
                                <p className="flex gap-1 items-center">
                                    <FaRegEye />
                                    Lượt xem: 1
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-between flex-col h-full p-3">
                            <div className="">
                                <h1 className="font-bold h-[48px] line-clamp-2">{item.title}</h1>
                            </div>
                            <div className="">
                                <p className="text-[12px] text-center">{handleCompareDate(item.date)}</p>
                                <button onClick={() => handleChangeRouterDeCuong(item)} className="text-sm w-full">
                                    Xem ngay
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
