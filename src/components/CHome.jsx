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
export default function CHome({ quizData, toolData }) {
    return (
        <div className=" ">
            <div className="">
                <div className="text-secondary text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className=" font-bold text-4xl">Chào mừng bạn đến với Quizzet</h1>
                    <div className="">
                        <p className="">
                            <a href="/GIAO TRINH PLDK.zip" download>
                                Quizzet là
                            </a>
                            một cộng đồng chia sẻ tài liệu cho sinh viên Đại học Công nghệ Đồng Nai
                        </p>
                        <p>
                            Trang web này giúp bạn tạo ra các bài quiz online đồng thời cũng là nơi chia sẻ tài liệu các môn đại cương hoặc chuyên ngành một cách dễ dàng và nhanh chóng. Bạn có thể tạo
                            ra các câu hỏi, trả lời và chia sẻ với
                            <a href="/GIAO TRINH LSD.zip" download>
                                bạn bè.
                            </a>
                        </p>
                    </div>
                </div>
                <div className="mt-10 flex gap-5">
                    <div className="h-[500px] bg-linear-item-blue flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item1.png" alt="" className="absolute w-full h-full" fill></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-lg w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Quiz</h1>
                            <p className="">Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân </p>
                            <button>Tìm hiểu thêm</button>
                        </div>
                    </div>
                    <div className="h-[500px] bg-linear-item-pink flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item2.png" alt="" className="absolute w-full h-full" fill></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-lg w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Tài liệu</h1>
                            <p className="">Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.</p>
                            <button>Tìm hiểu thêm</button>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 mt-2 text-red-500 flex justify-between items-center flex-col md:flex-row gap-3 md:gap-0">
                    <p>Bạn có thể thêm bài quiz mới ở đây</p>
                    <Link href="/themcauhoi">
                        <button className="bg-green-500 text-white">Thêm bài mới</button>
                    </Link>
                </div>
                {!quizData && (
                    <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}

                <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quizData?.map((item) => (
                        <div key={item._id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden">
                                <Link href={`/quiz/${item.slug}`} className="block w-full h-[150px] overflow-hidden relative">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        className="absolute h-full w-full object-cover hover:scale-110 duration-300"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
                                    />
                                </Link>
                                <div className="p-3">
                                    <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2 mb-3 ">
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
                                                <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden group-hover:underline">{item.uid.displayName}</h2>
                                                {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                            </div>
                                            <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                            </p>
                                        </div>
                                    </Link>
                                    <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                    <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                    <div className="flex justify-between items-center">
                                        <p>Lượt làm: {item.noa}</p>
                                        <Link href={`/quiz/${item.slug}`} className="text-right">
                                            <button className="bg-green-600 text-white">Làm bài ngay</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-5 mt-2 text-red-500 ">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Một số tài liệu ôn các môn chuyên ngành</h1>
                    <p className="text-sm md:text-md text-gray-500">Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để gửi tài liệu cho mình nhá 😍😍</p>
                    <a href="mailto: thngan25k3@gmail.com">
                        <button className="bg-green-500 text-white mt-2">Yêu cầu tài liệu mới</button>
                    </a>
                </div>
                <div className="bg-white ">
                    <div className="">
                        {!toolData && (
                            <div className="h-[400px] flex items-center justify-center w-full">
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </div>
                        )}
                        <div className="bg-white px-2 py-5 mt-2 grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-4">
                            {toolData?.map((item, index) => (
                                <Link href={`/decuong/${item.slug}`} className="block relative" key={index}>
                                    <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                        <div className="h-[150px] w-full relative">
                                            <Image src={item.image} alt={item.title} className="object-cover absolute" priority fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                        </div>
                                        <div className="p-3">
                                            <h1 className="text-[15px] text-green-500 font-bold h-[48px] line-clamp-2">{item.title}</h1>
                                            <p className="text-[13px] mb-2">
                                                Tổng câu hỏi: <label className="text-red-500 font-bold">{item.lenght}</label>{" "}
                                            </p>
                                            <button className="bg-green-600 text-white">Xem ngay</button>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 left-0">
                                        <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{handleCompareDate(item.date)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
