"use client";
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function CDeCuong({ DeCuongData }: { DeCuongData: any }) {
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl ">
                    Bộ đề môn: <label className="text-green-500 font-bold ">{DeCuongData?.title}</label>{" "}
                </h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold ">{DeCuongData?.lenght}</label> câu hỏi
                </p>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {DeCuongData &&
                    DeCuongData?.quest?.data_so.map((item: any, index: number) => (
                        <div className=" bg-white  p-5" key={index}>
                            <h1 className=" font-bold text-lg">
                                Câu {index + 1}: {item.question.replace("Câu ", "")}
                            </h1>

                            <p className="text-green-500">{item.answer}</p>
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
