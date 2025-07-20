"use client"
import React from "react"
import { SiQuizlet } from "react-icons/si"
import { FaPeopleGroup } from "react-icons/fa6"
import { AiFillHome } from "react-icons/ai"
import { FaFileAlt } from "react-icons/fa"
import { FaRegCreditCard } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"
export default function FooterNavBar() {
    const pathname = usePathname()
    return (
        <div className="fixed bottom-0 bg-gray-100 dark:bg-slate-800/90 dark:text-white  text-black h-[48px] w-full block md:hidden z-10">
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
                    <Link href="/decuong" className={`flex items-center h-full justify-center ${pathname.startsWith("/decuong") ? "active" : ""}`}>
                        <FaFileAlt size={22} />
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/congdong" className={`flex items-center h-full justify-center ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                        <FaPeopleGroup size={25} />
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/flashcard" className={`flex items-center h-full justify-center ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                        <FaRegCreditCard size={25} />
                    </Link>
                </li>
            </ul>
        </div>
    )
}
