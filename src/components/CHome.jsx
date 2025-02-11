"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import "@/app/globals.css";
import CTaiLieu from "@/components/CTaiLieu";
import CQuizMobile from "./CQuizMobile";
import CQuiz from "./CQuiz";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
export default function CHome({ quizData, toolData, publicFlashcards }) {
    const [notice, setNotice] = useState([]);
    useEffect(() => {
        const fetchNotice = async () => {
            const req = await GET_API_WITHOUT_COOKIE("/notice/public");
            setNotice(req?.notice);
        };
        fetchNotice();
    }, []);
    return (
        <div className="px-2">
            <div className="">
                <div className="text-secondary text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className=" font-bold text-4xl">Chào mừng bạn đến với Quizzet</h1>
                    <div className="">
                        <p className="">Quizzet là một cộng đồng chia sẻ tài liệu cho sinh viên Đại học Công nghệ Đồng Nai</p>
                        <p>Trang web này giúp bạn tạo ra các bài quiz online đồng thời cũng là nơi chia sẻ tài liệu các môn đại cương hoặc chuyên ngành một cách dễ dàng và nhanh chóng.</p>
                    </div>
                </div>
                <div className="my-2 flex gap-5 items-center justify-center">
                    {notice &&
                        notice.map((item) => (
                            <Link href={item?.link || "#"} className="bg-third px-3 py-1 rounded-md text-white" key={item?._id}>
                                <p>{item?.title}</p>
                            </Link>
                        ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-5 text-third">
                    <div className="h-[500px] bg-linear-item-purple flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item3.png" alt="" className="absolute w-full h-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Flashcard</h1>
                            <p className="">Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.</p>
                            <Link href="/flashcard">
                                <button className="btn btn-primary">Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                    <div className="h-[500px] bg-linear-item-blue flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item1.png" alt="" className="absolute w-full h-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Quiz</h1>
                            <p className="">Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân </p>
                            <Link href="/quiz">
                                <button className="btn btn-primary">Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                    <div className="h-[500px] bg-linear-item-pink flex-1 rounded-3xl flex items-center justify-center flex-col">
                        <div className="w-[250px] h-[280px] overflow-hidden relative">
                            <Image src="/item2.png" alt="" className="absolute w-full h-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                        </div>
                        <div className="bg-white text-center p-4 rounded-xl w-[350px] space-y-2">
                            <h1 className="text-2xl font-bold">Tài liệu</h1>
                            <p className="">Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.</p>
                            <Link href="/tailieu">
                                <button className="btn btn-primary">Tìm hiểu thêm</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-10 mb-5 text-third">
                    <h1 className="text-3xl font-bold">Flashcard</h1>
                    <p>Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[300px] overflow-y-scroll">
                        {/* {publicFlashcards.length > 0 &&
                            publicFlashcards.map((item) => (
                                <Link
                                    href={`/flashcard/${item?._id}`}
                                    className="w-full h-[181px] bg-gray-100 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300"
                                    key={item._id}>
                                    <h1 className="font-bold line-clamp-1" title={item?.title}>
                                        {item?.title}
                                    </h1>
                                    <h1 className="flex items-center gap-1">
                                        <IoCopyOutline />
                                        {item?.flashcards.length} từ
                                    </h1>
                                    <p className="text-sm line-clamp-2 italic  h-[40px]" title={item?.desc}>
                                        {item?.desc || "Không có mô tả"}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                                        <Image src={`/flag/${item?.language}.svg`} alt="" width={25} height={25} className="rounded-sm border border-gray-400"></Image>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-[40px] h-[40px] overflow-hidden relative">
                                            <Image src={item?.userId?.profilePicture} alt="" className="rounded-full w-full h-full absolute object-cover" fill />
                                        </div>
                                        <div className="">
                                            <p title={item?.userId?.displayName} className="line-clamp-1">
                                                {item?.userId?.displayName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))} */}
                    </div>
                </div>
                {/* {!quizData && (
                    <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )} */}
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
