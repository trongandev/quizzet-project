"use client";
import handleCompareDate from "@/lib/CompareDate";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineVerified } from "react-icons/md";
import { Button } from "../ui/button";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { IQuiz } from "@/types/type";
import { FaRegEye } from "react-icons/fa";

export default function QuizItem({ item }: { item: IQuiz }) {
    return (
        <div key={item._id} className="group hover:shadow-md hover:scale-105 transition-all duration-300  rounded-xl border border-white/10 shadow-md h-[400px]">
            <div className="overflow-hidden relative h-full rounded-[8px]">
                <Link className="block" href={`/quiz/detail/${item.slug}`}>
                    <Image
                        src={item.img}
                        alt={item.title}
                        className="absolute h-full w-full object-cover group-hover:scale-105 duration-300  brightness-90"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </Link>
                <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                    <h1 className="text-lg font-bold line-clamp-2 ">{item.title}</h1>
                    <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                    <div className="flex justify-end items-center gap-1 mb-[1px] text-[10px]">
                        <FaRegEye />
                        <p className="">Lượt làm: {item.noa}</p>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                        <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                            <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                <Image
                                    unoptimized
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
                                    <h2 className="text-sm line-clamp-1 overflow-hidden">{item.uid.displayName}</h2>
                                    {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                </div>
                                <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                    <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                </p>
                            </div>
                        </Link>

                        <Link href={`/quiz/${item.slug}`} className="">
                            <Button className="text-white">
                                Làm bài <IoArrowForwardCircleOutline />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
