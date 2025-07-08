"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import { GET_API } from "@/lib/fetchAPI";
import CNotify from "./CNotify";
import CChat from "./CChat";
import { Bell, History, LogOut, Mailbox, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
export default function CHeader() {
    const [openNoti, setOpenNoti] = useState(false);
    const [notify, setNotify] = useState([]);
    const [unreadCountNotify, setUnreadCountNotify] = useState<number>(0);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const token = Cookies.get("token") || "";

    const { user, clearUser } = useUser() || { user: undefined, clearUser: () => {} };

    const handleLogout = async () => {
        const req = await GET_API("/auth/logout", token);
        clearUser();
    };

    // useEffect(() => {
    //     const fetchAPI = async () => {
    //         const req = await GET_API("/notify", token);
    //         if (req.ok) {
    //             setNotify(req?.data?.notifications);
    //             setUnreadCountNotify(req?.data?.unreadCount || 0);
    //         }
    //     };

    //     if (user) {
    //         fetchAPI();
    //     }
    // }, [user, token]);

    const handleRouterNotify = async (item: any) => {
        const req = await GET_API(`/notify/${item?._id}`, token);
        if (req.ok) {
            setUnreadCountNotify(req?.data?.unreadCount || 0);
            router.push(item?.link);
            setOpenNoti(false);
        }
    };

    return (
        <header className="bg-white text-primary dark:text-white dark:bg-gray-800 w-full flex items-center justify-center fixed z-10 border-b border-white/70 dark:border-white/10">
            <div className="flex items-center justify-between px-5 py-1 md:px-0 md:py-0 w-full md:w-[1000px] xl:w-[1200px]">
                <Link href="/">
                    <Image unoptimized src="/logo.png" alt="" width={120} height={30} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                </Link>
                <ul className="hidden md:flex items-center gap-5 ">
                    <li>
                        <Link href="/" className={`block  ${pathname == "/" ? "active" : ""}`}>
                            Trang chủ
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/flashcard" className={`block  ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                            Flashcard
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/quiz" className={`block ${pathname.startsWith("/quiz") ? "active" : ""}`}>
                            Quiz
                        </Link>
                    </li>
                    <li className="">
                        <Link href="/decuong" className={`block ${pathname.startsWith("/decuong") ? "active" : ""}`}>
                            Đề cương
                        </Link>
                    </li>

                    <li className="">
                        <Link href="/congdong" className={`block ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                            Cộng đồng
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {theme === "dark" ? (
                            <div
                                className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white"
                                onClick={() => setTheme("light")}>
                                <Sun size={18} className="" />
                            </div>
                        ) : (
                            <div
                                className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white"
                                onClick={() => setTheme("dark")}>
                                <Moon size={18} className="" />
                            </div>
                        )}
                    </div>
                    {!token ? (
                        <div className=" ">
                            <Link href="/login" className="relative">
                                <div className="-z-1 absolute inset-0 bg-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000  animate-pulse "></div>
                                <Button className="z-1 relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 font-bold group-hover:scale-105 transition-all duration-500 px-4 py-2 rounded-lg text-white">
                                    Đăng nhập
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <div className="flex gap-3 items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white">
                                            <Bell size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="w-full md:w-[400px] max-h-[600px] overflow-y-scroll">
                                            <CNotify notify={notify} handleRouter={handleRouterNotify} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {user && <CChat token={token} user={user} router={router} />}

                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                            <Image
                                                unoptimized
                                                src={user?.profilePicture || "/avatar.jpg"}
                                                alt=""
                                                className="object-cover h-full absolute"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                                            <User />
                                            Tài khoản
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push("/history")}>
                                            <History />
                                            Lịch sử
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mailbox />
                                            Góp ý
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout} className="dark:text-red-300 text-red-500 hover:text-red-600">
                                            <LogOut /> Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}
                </div>
                {/* 
                <Modal title="Hòm thư góp ý" open={isModalOpen} onOk={handleOk} loading={loading} onCancel={handleCancel} okText="Gửi góp ý" cancelText="Hủy">
                    <div className="">
                        <p className="text-gray-700 mb-2">Cảm ơn bạn đã viết góp ý, chúng tôi sẽ cố gắng sửa lỗi cũng như thực hiện sớm nhất những tính năng mới</p>
                        <TextArea placeholder="Nhập góp ý của bạn" autoSize={{ minRows: 5 }} onChange={(e) => setFeedback(e.target.value)} />
                        <p className="text-gray-500 mt-2">*Nếu bạn muốn phản hồi nhanh nhất hãy gửi qua</p>
                        <Link href="mailto:trongandev@gmail.com" className="text-gray-500 flex items-center gap-1">
                            <MdEmail size={20} /> trongandev@gmail.com
                        </Link>
                        <p className="text-gray-500 mt-2">Hoặc tham gia động cồng discord</p>
                        <Link href="https://discord.gg/mUqfzD3u" target="_blank" className="text-gray-500 flex items-center gap-1">
                            <BsDiscord size={20} /> Bấm vào để tham gia
                        </Link>
                    </div>
                </Modal> */}
            </div>
        </header>
    );
}
