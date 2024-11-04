"use client";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineVerified } from "react-icons/md";
import { GET_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import handleCompareDate from "@/lib/CompareDate";

export default function ResultTopic({ params }) {
    const { slug } = params;
    const [topic, setTopic] = useState([]);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/quiz/subject/${slug}`, token);
            setTopic(req.quiz);
        };
        fetchAPI();
    }, [slug]);

    return (
        <div>
            <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topic && topic.length === 0 ? (
                    <div>
                        <h1>Chưa có bài trắc nghiệm nào về chủ đề này...</h1>
                        <Link href="/post">
                            <Button type="primary" className="mt-3">
                                Hãy là người đầu tiên bổ sung chủ đề này 😍❤
                            </Button>
                        </Link>
                    </div>
                ) : (
                    ""
                )}
                {topic &&
                    topic?.map((item) => (
                        <Link href={`/quiz/${item.slug}`} key={item._id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                <div className="h-[150px] w-full relative">
                                    <Image src={item.img} alt="" className="h-full w-full object-cover absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                            <Image
                                                src={item.uid.profilePicture}
                                                alt=""
                                                className="object-cover h-full absolute"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>

                                        <div className="">
                                            <div className="flex items-center gap-1">
                                                <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{item.uid.displayName}</h2>
                                                {topic?.uid?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                            </div>
                                            <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                    <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                    <div className="flex justify-between items-center">
                                        <p>Lượt làm: {item.noa}</p>
                                        <div className="text-right">
                                            <button className="bg-green-600 text-white">Làm bài ngay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
