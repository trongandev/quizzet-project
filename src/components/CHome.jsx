"use client";
import React from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineVerified } from "react-icons/md";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import handleCompareDate from "@/lib/CompareDate";
import "@/app/globals.css";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import CTaiLieu from "@/components/CTaiLieu";
export default function CHome({ quizData, toolData }) {
    return (
        <div className="px-2">
            <div className="">
                <div className="text-secondary text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className=" font-bold text-4xl">Chào mừng bạn đến với Quizzet</h1>
                    <div className="">
                        <p className="">Quizzet là một cộng đồng chia sẻ tài liệu cho sinh viên Đại học Công nghệ Đồng Nai</p>
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
                            <Image src="/item1.png" alt="" className="absolute w-full h-full" fill></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Quiz</h1>
                            <p className="">Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân </p>
                            <Link href="/themcauhoi">
                                <button>Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                    <div className="h-[500px] bg-linear-item-pink flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item2.png" alt="" className="absolute w-full h-full" fill></Image>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quizData?.map((item) => (
                        <div key={item._id} className=" rounded-xl  shadow-md h-[400px]">
                            <div className="overflow-hidden relative h-full rounded-[8px]">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    className="absolute h-full w-full object-cover hover:scale-110 duration-300  brightness-75"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                                <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                    <h1 className="text-lg font-bold">{item.title}</h1>
                                    <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                                    <div className="flex justify-end items-center gap-1 mb-[1px] text-[10px]">
                                        <FaRegEye />
                                        <p className="">Lượt làm: {item.noa}</p>
                                    </div>
                                    <div className="flex justify-between items-center gap-1">
                                        <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                                            <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                <Image
                                                    src={item.uid.profilePicture}
                                                    alt={item.uid.displayName}
                                                    className="absolute object-cover h-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    priority
                                                />
                                            </div>
                                            <div className="group">
                                                <div className="flex items-center gap-1">
                                                    <h2 className="text-sm line-clamp-1 overflow-hidden group-hover:underline">{item.uid.displayName}</h2>
                                                    {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                </div>
                                                <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                    <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                                </p>
                                            </div>
                                        </Link>

                                        <Link href={`/quiz/${item.slug}`} className="block">
                                            <button className="flex gap-1 items-center text-sm">
                                                Làm bài <IoArrowForwardCircleOutline />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
