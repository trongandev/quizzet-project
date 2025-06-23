import handleCompareDate from "@/lib/CompareDate";
import { IChatCommunityMessage } from "@/types/type";
import { Heart, MessageCircle, Share } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MessageCardProps {
    message: IChatCommunityMessage; // Define a more specific type if possible
    isLast?: boolean;
    ref?: React.Ref<HTMLDivElement>;
}

export default function ChatCard({ message, isLast, ref }: MessageCardProps) {
    return (
        <div className="flex items-start gap-3 py-5 px-3 hover:bg-gray-200/10 rounded-xl group" ref={ref}>
            <div className="w-10 md:w-12 h-10 md:h-12 relative rounded-full overflow-hidden ">
                <Image src={message?.userId.profilePicture} alt="" fill className="absolute w-full h-full object-cover "></Image>
            </div>
            <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between h-7">
                    <div className="flex items-center gap-2">
                        <h3>{message?.userId?.displayName}</h3>
                        <p className="text-gray-400 text-xs">{handleCompareDate(message?.timestamp)}</p>
                    </div>
                    <div className="items-center gap-2 hidden group-hover:flex duration-500">
                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                            <Heart size={14} />
                        </div>
                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                            <MessageCircle size={14} />
                        </div>
                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                            <Share size={14} />
                        </div>
                    </div>
                </div>
                <div className="w-full bg-gray-500/50 px-3 py-2  md:py-3 md:px-5 rounded-md md:rounded-xl ">
                    <p className="break-words  whitespace-normal">{message?.message}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-500/50 px-2.5 py-0.5 rounded-xl text-gray-400 text-sm">🤩 2</div>
                </div>
            </div>
        </div>
    );
}
