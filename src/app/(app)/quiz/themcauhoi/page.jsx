import React from "react";
import "@/app/globals.css";
import Link from "next/link";

import { Button } from "antd";

export default function ThemCauHoi() {
    return (
        <div className="flex gap-3 md:gap-5 mb-2 md:px-3 px-3 md:justify-center flex-wrap">
            <Link href="/quiz/themcauhoi/gui" className="w-full">
                <Button className="h-80 w-full flex flex-col">
                    <p>Thêm bằng giao diện (Nên sử dụng )</p>
                    <p>Có tích hợp AI giúp tạo Quiz nhanh hơn</p>
                </Button>
            </Link>
            <Link href="/quiz/themcauhoi/text" className="w-full">
                <Button className="h-80 w-full flex flex-col">
                    <p>Thêm bằng chữ</p>
                    <p>Thực hiện sẽ nhanh hơn</p>
                </Button>
            </Link>
        </div>
    );
}
