"use client";
import React from "react";
import { MdDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { MdOutlineTopic } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { VscBeaker } from "react-icons/vsc";
import { BsClockHistory } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiNotification } from "react-icons/bi";
import { TbMessageReportFilled } from "react-icons/tb";
import { GiCardRandom } from "react-icons/gi";

export default function Nav() {
    const pathname = usePathname();
    return (
        <div>
            <h1 className="text-green-500 font-bold text-2xl text-center pt-3">Trang quản lí</h1>
            <hr className="my-3" />
            <ul className="text-gray-500">
                <li>
                    <Link href="/whatheo" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo" ? "active" : ""}`}>
                        <MdDashboard />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/users" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/users" ? "active" : ""}`}>
                        <HiUsers />
                        Users
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/topic" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/topic" ? "active" : ""}`}>
                        <MdOutlineTopic />
                        Topic
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/history" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/history" ? "active" : ""}`}>
                        <MdHistory />
                        History
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/tool" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/tool" ? "active" : ""}`}>
                        <FaTools />
                        Tool
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/report" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/report" ? "active" : ""}`}>
                        <TbMessageReportFilled />
                        Report
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/flashcard" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/flashcard" ? "active" : ""}`}>
                        <GiCardRandom />
                        Flashcard
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/user-use-tool" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/user-use-tool" ? "active" : ""}`}>
                        <VscBeaker />
                        Users Use Tool
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/history-tool" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/history-tool" ? "active" : ""}`}>
                        <BsClockHistory />
                        History Tool
                    </Link>
                </li>
                <li>
                    <Link href="/whatheo/notice" className={`p-3 flex items-center gap-2 ${pathname == "/whatheo/notice" ? "active" : ""}`}>
                        <BiNotification />
                        Thông báo trang chủ
                    </Link>
                </li>
            </ul>
        </div>
    );
}
