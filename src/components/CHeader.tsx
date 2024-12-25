"use client";
import React, { useState } from "react";
import { Popover, Alert, Space, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMessengerLine } from "react-icons/ri";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "../context/userContext";
import { MdOutlineHistory } from "react-icons/md";

export default function CHeader({ token }: { token: string }) {
    const [open, setOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const pathname = usePathname();

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleOpenNoti = (newOpen: boolean) => {
        setOpenNoti(newOpen);
    };

    const { user, clearUser } = useUser();

    const handleLogout = () => {
        Cookies.remove("token");
        clearUser();
        window.location.reload();
    };

    return (
        <header className="bg-white text-primary w-full flex items-center justify-center fixed z-20 shadow-lg">
            <div className="flex items-center justify-between px-5 py-1 md:px-0 md:py-0 w-[800px] md:w-[1000px] xl:w-[1200px]">
                <Link href="/">
                    <Image unoptimized src="/logo.png" alt="" width={120} height={30} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                </Link>
                <ul className="hidden md:flex items-center gap-5">
                    <li>
                        <Link href="/" className={`block  ${pathname == "/" ? "active" : ""}`}>
                            Trang chủ
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/quiz" className={`block ${pathname.startsWith("/quiz") ? "active" : ""}`}>
                            Quiz
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/tailieu" className={`block ${pathname.startsWith("/tailieu") ? "active" : ""}`}>
                            Tài liệu
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/flashcard" className={`block  ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                            Flashcard
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/decuong" className={`block  ${pathname == "/decuong" ? "active" : ""}`}>
                            Đề cương
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/congdong" className={`block ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                            Cộng đồng
                        </Link>
                    </li>
                </ul>

                {!token ? (
                    <div className="">
                        <Link href="/login">
                            <button className="btn btn-primary">Đăng nhập</button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-3 items-center">
                            <Popover
                                content={
                                    <Space
                                        direction="vertical"
                                        style={{
                                            width: "100%",
                                        }}>
                                        <Alert message="Tạo tài khoản thành công" type="success" showIcon />
                                    </Space>
                                }
                                trigger="click"
                                open={openNoti}
                                onOpenChange={handleOpenNoti}
                                title="Thông báo">
                                <Badge count={1} offset={[-5, 5]} size="small" className="text-primary">
                                    <IoMdNotificationsOutline size={30} />
                                </Badge>
                            </Popover>
                            <Badge count={1} offset={[-5, 5]} size="small" className="text-primary">
                                <Link href={`/chat`}>
                                    <RiMessengerLine size={26} />
                                </Link>
                            </Badge>
                            <Popover
                                content={
                                    <>
                                        <Link href={`/profile`} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <UserOutlined />
                                            <p>Quản lí tài khoản</p>
                                        </Link>
                                        {token && (
                                            <Link href={`/lichsu`} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                                <MdOutlineHistory />
                                                <p>Lịch sử làm bài</p>
                                            </Link>
                                        )}

                                        <div onClick={handleLogout} className="flex gap-2 items-center p-2 hover:bg-gray-100 hover:text-red-500 cursor-pointer">
                                            <FiLogOut />
                                            Đăng xuất
                                        </div>
                                    </>
                                }
                                title={user?.email}
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>
                                {user?.profilePicture ? (
                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                        <Image
                                            unoptimized
                                            src={user?.profilePicture}
                                            alt=""
                                            className="object-cover h-full absolute"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="w-[40px] h-[40px] md:w-[35px] md:h-[35px]" icon={<UserOutlined />} />
                                )}
                            </Popover>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
