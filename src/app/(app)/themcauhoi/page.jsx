import React from "react";
import "@/app/globals.css";
import Link from "next/link";

import { Button } from "antd";

export default function ThemCauHoi() {
    return (
        <div className="flex gap-2 md:gap-3 mb-2 md:px-3 px-0 justify-between md:justify-start">
            <Link href="/themcauhoi/gui">
                <Button>Thêm bằng giao diện (Recommend )</Button>
            </Link>
            <Link href="/themcauhoi/text">
                <Button>Thêm bằng chữ</Button>
            </Link>
        </div>
    );
}
