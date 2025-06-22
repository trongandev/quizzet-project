"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function NganHang() {
    const [input, setInput] = useState<number>(10);
    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5">
                <div className="text-third">
                    <div>
                        <h1 className="text-primary text-2xl font-bold">Ngân hàng đề cương của chúng tôi</h1>
                        <p>Bạn có thể làm bài thi với số lượng câu hỏi tùy chỉnh (10, 20, 30 câu...).</p>
                        <p>Trong thời gian tùy chỉnh tùy theo nhu cầu</p>
                        <p>Câu hỏi được lấy ngẫu nhiên từ ngân hàng câu hỏi của bộ môn tương ứng và được sắp xếp ngẫu nhiên (shuffle).</p>
                        <div className="text-secondary">
                            <p>Hiện đang phát triển, sớm sẽ có thôi Hãy chờ nhé</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="border shadow-lg rounded-lg p-5 w-[350px]">
                            <Image src="https://img.lazcdn.com/g/p/c0a84c17a36cc7ea41f25a9134889254.jpg_720x720q80.jpg" alt="" className="rounded-lg" width={350} height={300} />
                            <div className="my-2">
                                <h1>Lịch sử đảng</h1>
                                <p>Gồm 999 câu hỏi</p>
                                <p>Nhập số lượng câu hỏi bạn muốn làm</p>
                                <input type="number" value={input} onChange={(e) => setInput(Number(e.target.value))} />
                            </div>
                            <Link href={`/quiz/nganhang/lsd?limit=${input}`} className="block">
                                <Button>Thi thử</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
