import React from "react";
import "@/app/globals.css";
import Link from "next/link";

import { Button } from "antd";
import Image from "next/image";

export default function ThemCauHoi() {
    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-20">
                <div className="h-full md:h-[85vh] flex md:justify-center flex-col gap-5 px-3 md:px-5">
                    {/* <Link href="/quiz/themcauhoi/gui" className="w-full">
                <Button className="h-80 w-full flex flex-col dark:bg-slate-800/50 dark:text-white/70">
                    <p>Thêm bằng giao diện (Nên sử dụng )</p>
                    <p>Có tích hợp AI giúp tạo Quiz nhanh hơn</p>
                </Button>
            </Link>
            <Link href="/quiz/themcauhoi/text" className="w-full">
                <Button className="h-80 w-full flex flex-col dark:bg-slate-800/50 dark:text-white/70 ">
                    <p>Thêm bằng chữ</p>
                    <p>Thực hiện sẽ nhanh hơn</p>
                </Button>
            </Link> */}
                    <h1 className="text-3xl text-center font-semibold ">Tạo một bài Quiz mới</h1>
                    <div className="flex gap-5 flex-col md:flex-row  items-center">
                        <div className="flex-1 w-full h-80 text-center rounded-xl overflow-hidden dark:bg-slate-800/50  bg-white border-2 border-white/10 hover:border-primary transition-all duration-300 cursor-pointer hover:bg-secondary/70 group shadow-md">
                            <div className="relative w-full h-40 md:h-1/2 border-b-2 border-b-gray-300 dark:border-b-gray-500 ">
                                <Image
                                    src="https://cf.quizizz.com/CreateWithAIV2/Source%20abstractions-min.png"
                                    alt=""
                                    className="absolute w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300 "
                                    fill></Image>
                            </div>
                            <div className="flex-1 h-1/2 flex flex-col justify-center items-center gap-2 py-5 md:py-0">
                                <h3 className="text-lg md:text-xl font-bold inline-flex items-center gap-2 text-slate-800 dark:text-white">
                                    Tạo bằng AI <Image src="https://www.gstatic.com/lamda/images/gemini_sparkle_red_4ed1cbfcbc6c9e84c31b987da73fc4168aec8445.svg" alt="" width={30} height={30}></Image>
                                </h3>
                                <p className="text-md md:text:lg text-gray-600 dark:text-gray-400 ">Ra lệnh cho AI thực hiện</p>
                            </div>
                        </div>{" "}
                        <div className="flex-1 w-full  h-80 text-center rounded-xl overflow-hidden dark:bg-slate-800/50  bg-white border-2 border-white/10 hover:border-primary transition-all duration-300 cursor-pointer hover:bg-secondary/70 group shadow-md">
                            <div className="relative h-40 md:h-1/2 w-full border-b-2 border-b-gray-300 dark:border-b-gray-500 ">
                                <Image
                                    src="https://cf.quizizz.com/CreateWithAIV2/Source%20abstractions-1-min.png"
                                    alt=""
                                    className="absolute w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300 "
                                    fill></Image>
                            </div>
                            <div className="flex-1 h-1/2 flex flex-col justify-center items-center gap-2 py-5 md:py-0">
                                <h3 className="text-lg md:text-xl font-bold  text-slate-800 dark:text-white">Nhập tạo từ đầu</h3>
                                <p className="text-md md:text:lg text-gray-600 dark:text-gray-400 ">Nhập tay tất cả thông tin</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full  h-80 text-center rounded-xl overflow-hidden dark:bg-slate-800/50  bg-white border-2 border-white/10 hover:border-primary transition-all duration-300 cursor-pointer hover:bg-secondary/70 group shadow-md">
                            <div className="relative h-40 md:h-1/2 w-full border-b-2 border-b-gray-300 dark:border-b-gray-500 ">
                                <Image
                                    src="https://cf.quizizz.com/CreateWithAIV2/Source%20abstractions-2-min.png"
                                    alt=""
                                    className="absolute w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300 "
                                    fill></Image>
                            </div>
                            <div className="flex-1 h-1/2 flex flex-col justify-center items-center gap-2 py-5 md:py-0">
                                <h3 className="text-lg md:text-xl font-bold  text-slate-800 dark:text-white">Nhập từ file docx, xlxs</h3>
                                <p className="text-md md:text:lg text-gray-600 dark:text-gray-400 ">Từ đề cương, biểu mẫu google, bảng tính,...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
