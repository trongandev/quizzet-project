"use client";
import React, { useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GiCardPick } from "react-icons/gi";
import Link from "next/link";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";

export default function CTaiLieuDetail({ DeCuongData }) {
    useEffect(() => {
        const handleChangeRouterDeCuong = async () => {
            await GET_API_WITHOUT_COOKIE(`/admin/suboutline/view/${DeCuongData?._id}`);
        };
        handleChangeRouterDeCuong();
    }, []);
    return (
        <div className="text-third px-2 md:px-0 dark:text-white">
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="text-2xl ">
                        Bộ đề môn: <label className="text-primary font-bold ">{DeCuongData?.title}</label>
                    </h1>
                    <p>
                        Tổng: <label className="text-secondary dark:text-gray-300 font-bold ">{DeCuongData?.lenght} câu hỏi</label>
                    </p>
                </div>
                <Link href={`/tailieu/flashcard/${DeCuongData?._id}`} className="flex gap-2 items-center btn btn-primary !rounded-md">
                    <GiCardPick size={20} />
                    Luyện tập bằng Flashcard
                </Link>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {DeCuongData &&
                    DeCuongData?.quest?.data_so.map((item, index) => (
                        <div className=" bg-linear-item-2 rounded-xl border border-white/20  p-5" key={index}>
                            <h1 className=" font-bold text-lg dark:text-white/80">
                                Câu {index + 1}: {item.question.replace("Câu ", "")}
                            </h1>

                            <p className="text-secondary  dark:text-white/70">{item.answer}</p>
                        </div>
                    ))}
            </div>
            {!DeCuongData && (
                <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
            )}
        </div>
    );
}
