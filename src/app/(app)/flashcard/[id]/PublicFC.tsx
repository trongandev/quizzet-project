import handleCompareDate from "@/lib/CompareDate";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";

export default function PublicFC({ item }: any) {
    return (
        <Link
            href={`/flashcard/${item?._id}`}
            className="relative group overflow-hidden w-full h-[181px] bg-gray-200/80  dark:bg-slate-800/50 border border-white/10 rounded-xl block shadow-sm p-3 hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <h1 className="font-bold line-clamp-1" title={item.title}>
                {item.title}
            </h1>
            <h1 className="flex items-center gap-1">
                <IoCopyOutline />
                {item?.flashcards?.length} từ
            </h1>
            <p className="text-sm line-clamp-2 italic  h-[40px]" title={item.desc}>
                {item.desc || "Không có mô tả"}
            </p>
            <div className="flex gap-2 items-center">
                <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                <Image src={`/flag/${item.language}.svg`} alt="" width={25} height={25} className="rounded-sm border border-gray-400"></Image>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-[40px] h-[40px] overflow-hidden relative">
                    <Image src={item?.userId?.profilePicture} alt="" className="rounded-full w-full h-full absolute object-cover" fill />
                </div>
                <div className="flex-1">
                    <p title={item.userId.displayName} className="line-clamp-1">
                        {item.userId.displayName}
                    </p>
                    <div className="flex gap-1 items-center text-xs text-gray-500 " title={new Date(item.created_at).toLocaleString()}>
                        {item.public ? <MdPublic /> : <RiGitRepositoryPrivateFill />}
                        <p className="line-clamp-1">{handleCompareDate(item?.created_at)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
