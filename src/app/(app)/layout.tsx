"use client";
import "../globals.css";
import { UserProvider } from "../../context/userContext";
import { SocketProvider } from "../../context/socketContext";
import CHeader from "../../components/CHeader";
import CFooter from "../../components/Footer";
import Link from "next/link";
import { IoFolderOpenSharp, IoHomeOutline } from "react-icons/io5";
import { MdOutlineTopic } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { FiFilePlus } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { SiQuizlet } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { GiCardPick } from "react-icons/gi";

export default function RootLayout({ children }: any) {
    const pathname = usePathname();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        setToken(Cookies.get("token") || null);
    }, []);
    return (
        <html lang="en">
            <head>
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-L681038P5E"></Script>
            </head>
            <UserProvider>
                <SocketProvider>
                    <body className="bg-linear">
                        <CHeader token={token || ""} />
                        <div className="flex items-center justify-center">
                            <div className="w-[800px] md:w-[1000px] xl:w-[1200px] py-5 pt-20">{children}</div>
                            <div className="fixed bottom-0 bg-gray-100 text-black h-[48px] w-full block md:hidden z-10">
                                <ul className="flex h-full">
                                    <li className="flex-1">
                                        <Link href="/" className={`flex items-center h-full justify-center ${pathname == "/" ? "active" : ""}`}>
                                            <AiFillHome size={25} />
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/quiz" className={`flex items-center h-full justify-center ${pathname.startsWith("/quiz") ? "active" : ""}`}>
                                            <SiQuizlet size={21} />
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/tailieu" className={`flex items-center h-full justify-center ${pathname.startsWith("/tailieu") ? "active" : ""}`}>
                                            <FaFileAlt size={22} />
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/decuong" className={`flex items-center h-full justify-center ${pathname.startsWith("/decuong") ? "active" : ""}`}>
                                            <IoFolderOpenSharp size={25} />
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/congdong" className={`flex items-center h-full justify-center ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                                            <FaPeopleGroup size={25} />
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/flashcard" className={`flex items-center h-full justify-center ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                                            <GiCardPick size={25} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <CFooter />
                        <Analytics />
                        <GoogleAnalytics gaId="G-L681038P5E" />
                    </body>
                </SocketProvider>
            </UserProvider>
        </html>
    );
}
