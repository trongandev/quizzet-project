import handleCompareDate from "@/lib/CompareDate";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

export default function UserFC({ item }: any) {
    return (
        <Link
            href={`/flashcard/${item?._id}`}
            className="relative group overflow-hidden w-full  bg-white/80  dark:bg-slate-800/50 border border-white/10 rounded-md shadow-sm px-5 py-3 hover:shadow-md transition-all duration-300 flex flex-col gap-3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <div className="flex items-start justify-between mt-0">
                <div className="">
                    <h1 className="font-bold line-clamp-1 text-gray-900 dark:text-white/80 text-lg group-hover:text-blue-600 duration-300" title={item.title}>
                        {item.title}
                    </h1>

                    <p className="text-md line-clamp-1 text-gray-600 dark:text-white/60" title={item.desc}>
                        {item.desc || "Không có mô tả"}
                    </p>
                </div>
                <Image src={`/flag/${item.language}.svg`} alt="" width={25} height={25} className="rounded-sm brightness-90 group-hover:brightness-100 duration-300"></Image>
            </div>
            <div className="flex items-center justify-start md:justify-between flex-col md:flex-row">
                <Badge className="px-3 py-[0.4px] bg-blue-200/80 text-blue-700 font-medium text-xs">{item?.flashcards?.length} từ</Badge>
                <p className="line-clamp-1 text-xs text-gray-500">{handleCompareDate(item?.created_at)}</p>
            </div>
        </Link>
    );
}
