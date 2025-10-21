"use client"
import React from "react"
import { SiQuizlet } from "react-icons/si"
import { FaPeopleGroup } from "react-icons/fa6"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, BotMessageSquare, House } from "lucide-react"
export default function FooterNavBar() {
    const pathname = usePathname()
    return (
        <div className="fixed bottom-0 bg-gray-100 dark:bg-slate-800/90 dark:text-white  text-black h-[48px] w-full block md:hidden z-10">
            <ul className="flex h-full">
                <li className="flex-1">
                    <Link href="/" className={`flex flex-col text-xs items-center h-full justify-center ${pathname == "/" ? "active" : ""}`}>
                        <House size={18} />
                        <p>Trang chủ</p>
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/flashcard" className={`flex flex-col text-xs items-center h-full justify-center ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                        <BookOpen size={18} />
                        <p>Flashcard</p>
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/ai-center" className={`flex flex-col text-xs items-center h-full justify-center ${pathname.startsWith("/ai-center") ? "active" : ""}`}>
                        <BotMessageSquare size={18} />
                        <p>AI Center</p>
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/quiz" className={`flex flex-col text-xs items-center h-full justify-center ${pathname.startsWith("/quiz") ? "active" : ""}`}>
                        <SiQuizlet size={18} />
                        <p>Quiz</p>
                    </Link>
                </li>

                <li className="flex-1">
                    <Link href="/congdong" className={`flex flex-col text-xs items-center h-full justify-center ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                        <FaPeopleGroup size={18} />
                        <p>Cộng đồng</p>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
