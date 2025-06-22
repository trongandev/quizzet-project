"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

export default function OnlineUsers(onlineUsers: any) {
    return (
        <Link href={`/profile/${onlineUsers?._id}` || ""} className="flex items-center justify-between group hover:bg-white/20 p-3 rounded-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                    <Image src={onlineUsers?.profilePicture || "/avatar.jpg"} alt="" fill className="absolute object-cover rounded-full"></Image>
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0"></div>
                </div>
                <div className="">
                    <h1 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-all duration-300"> {onlineUsers?.displayName || "Khách vãng lai"}</h1>
                    <p className="text-gray-500 dark:text-gray-400 ">Đang online...</p>
                </div>
            </div>
            <div className="text-white/60 hidden group-hover:block transition-all duration-300">
                <EllipsisVertical size={18} />
            </div>
        </Link>
    );
}
