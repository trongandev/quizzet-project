"use client";
import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";

const OnlineUsers = ({ onlineUsers }) => {
    return (
        <div className="flex-1 h-full">
            <h3>Các thành viên đang online: {onlineUsers?.length}</h3>
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 mt-2 max-h-[180px] md:max-h-[85vh] overflow-y-scroll">
                {onlineUsers &&
                    onlineUsers?.map((onl_user) => (
                        <Link
                            className={`flex flex-col items-center h-[90px]  ${
                                onl_user._id ? "group bg-linear-item-2 text-secondary " : "border border-purple-900 text-purple-900 cursor-default"
                            } rounded-md py-2`}
                            key={onl_user?.socketId}
                            href={`${onl_user?._id ? `/profile/${onl_user?._id}` : "#"} `}
                            passHref>
                            <div className="w-[50px] h-[50px] overflow-hidden relative rounded-full">
                                <Image
                                    src={onl_user?.profilePicture || "https://github.com/angutboiz/quiz/blob/master/public/meme.jpg?raw=true"}
                                    alt=""
                                    className={`w-full h-full object-cover absolute  border ${onl_user?._id ? "border-primary" : ""}  rounded-full`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <p className="text-sm group-hover:underline  mt-1 line-clamp-1 dark:text-white" title={onl_user?.displayName || "Guest"}>
                                {onl_user?.displayName || "Guest"}
                            </p>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

OnlineUsers.displayName = "OnlineUsers";
export default OnlineUsers;
