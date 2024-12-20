"use client";
import React from "react";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import "@/app/globals.css";
import CTaiLieu from "@/components/CTaiLieu";
import CQuizMobile from "./CQuizMobile";
import CQuiz from "./CQuiz";
export default function CHome({ quizData, toolData }) {
    return (
        <div className="px-2">
            <div className="">
                <div className="text-secondary text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className=" font-bold text-4xl">Chào mừng bạn đến với Quizzet</h1>
                    <div className="">
                        <p className="">
                            Quizzet là một cộng đồng chia sẻ tài liệu cho sinh viên Đại học Công nghệ Đồng Nai
                            <a href="/BAOCAOTHUE.zip" download>
                                thuế
                            </a>
                        </p>
                        <p>
                            Trang web này giúp bạn tạo ra các bài quiz online đồng thời cũng là nơi chia sẻ tài liệu các môn đại cương hoặc chuyên ngành một cách dễ dàng và nhanh chóng. Bạn có thể tạo
                            ra các câu hỏi, trả lời và chia sẻ với
                            <a href="/GIAO TRINH.zip" download>
                                bạn bè.
                            </a>
                        </p>
                    </div>
                </div>
                <div className="mt-10 flex flex-wrap gap-5 text-third">
                    <div className="h-[500px] bg-linear-item-blue flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image unoptimized src="/item1.png" alt="" className="absolute w-full h-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Quiz</h1>
                            <p className="">Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân </p>
                            <Link href="/quiz">
                                <button>Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                    <div className="h-[500px] bg-linear-item-pink flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image unoptimized src="/item2.png" alt="" className="absolute w-full h-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Tài liệu</h1>
                            <p className="">Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.</p>
                            <Link href="/tailieu">
                                <button>Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {!quizData && (
                    <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}
                <div className="mt-10 mb-5 text-third">
                    <h1 className="text-3xl font-bold">Quiz</h1>
                    <p>Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                    <div className="block md:hidden">
                        <CQuizMobile quizData={quizData} />
                    </div>
                    <div className="hidden md:block">
                        <CQuiz quizData={quizData} />
                    </div>
                </div>

                <div className="mt-10 mb-5 text-third">
                    <h1 className="text-3xl font-bold">Tài liệu</h1>
                    <p>Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.</p>
                    <p>
                        Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để{" "}
                        <a className="underline text-primary" href="mailto: thngan25k3@gmail.com">
                            gửi tài liệu
                        </a>{" "}
                        cho mình nhá
                    </p>
                </div>
                <div className="">
                    <CTaiLieu toolData={toolData} />
                </div>
            </div>
        </div>
    );
}
