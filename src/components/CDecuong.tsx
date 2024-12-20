"use client";
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GiCardPick } from "react-icons/gi";
import Link from "next/link";

export default function CDeCuong({ DeCuongData }: { DeCuongData: any }) {
    return (
        <div className="text-third px-2 md:px-0">
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="text-2xl ">
                        Bộ đề môn: <label className="text-primary font-bold ">{DeCuongData?.title}</label>{" "}
                    </h1>
                    <p>
                        Tổng: <label className="text-secondary font-bold ">{DeCuongData?.lenght} câu hỏi</label>
                    </p>
                </div>
                <Link href="/flashcard">
                    <button className="flex gap-2 items-center">
                        <GiCardPick size={20} />
                        Luyện tập bằng Flashcard
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {DeCuongData &&
                    DeCuongData?.quest?.data_so.map((item: any, index: number) => (
                        <div className=" bg-linear-item-2 rounded-xl  p-5" key={index}>
                            <h1 className=" font-bold text-lg">
                                Câu {index + 1}: {item.question.replace("Câu ", "")}
                            </h1>

                            <p className="text-secondary">{item.answer}</p>
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
