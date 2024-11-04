"use client";
import "../globals.css";
import { UserProvider } from "../../context/userContext";
import CHeader from "../../components/CHeader";
import CFooter from "../../components/Footer";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTopic } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { FiFilePlus } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: any) {
    const pathname = usePathname();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        setToken(Cookies.get("token") || null);
    }, []);
    return (
        <html lang="en">
            <UserProvider>
                <body className="bg-gray-100">
                    <CHeader token={token || ""} />
                    <div className="flex items-center justify-center">
                        <div className="w-[800px] md:w-[1000px] xl:w-[1200px] py-5">{children}</div>
                        <div className="fixed bottom-0 bg-gray-100 text-black h-[48px] w-full block md:hidden">
                            <ul className="flex h-full">
                                <li className="flex-1">
                                    <Link href="/" className={`flex items-center h-full justify-center ${pathname == "/" ? "active" : ""}`}>
                                        <IoHomeOutline size={25} />
                                    </Link>
                                </li>
                                {token && (
                                    <>
                                        {" "}
                                        <li className="flex-1">
                                            <Link href="/chude" className={`flex items-center h-full justify-center ${pathname == "/chude" ? "active" : ""}`}>
                                                <MdOutlineTopic size={25} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/lichsu" className={`flex items-center h-full justify-center ${pathname == "/lichsu" ? "active" : ""}`}>
                                                <GoHistory size={25} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/tailieu" className={`flex items-center h-full justify-center ${pathname == "/tailieu" ? "active" : ""}`}>
                                                <FiFilePlus size={25} />
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <CFooter />
                </body>
            </UserProvider>
        </html>
    );
}
