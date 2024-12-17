import React from "react";
import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
export default function CFooter() {
    return (
        <footer className="">
            <div className="mt-5 bg-primary  text-white w-full">
                <div className="py-3 px-5 flex justify-between">
                    <Image alt="" width={150} height={150} src="/logo2.png"></Image>
                    <div className="flex flex-col">
                        <Link href="/">Trang chủ</Link>
                        <Link href="/tailieu">Tài liệu</Link>
                        <Link href="/chude">Chủ đề</Link>
                    </div>
                </div>
                <div className="flex gap-3 justify-center bg-secondary">
                    <p>
                        Bản quyền thuộc về <span className="rubik-wet-paint-regulars">Quizzet</span>{" "}
                    </p>
                    <p>&copy; 2024</p>
                </div>
            </div>
        </footer>
    );
}
