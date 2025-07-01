import handleCompareDate from "@/lib/CompareDate";
import { IChatCommunityMessage, IUser } from "@/types/type";
import { Heart, MessageCircle, Trash } from "lucide-react";
import Image from "next/image";
import React, { forwardRef, useState } from "react";
import PopperEmoji from "./PopperEmoji";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
interface MessageCardProps {
    message: IChatCommunityMessage; // Define a more specific type if possible
    ref?: any;
    isLastMessage?: boolean;
    handleReactIcon: (messageId: string, emoji: string) => void;
    setReplyingTo: (reactingTo: IChatCommunityMessage) => void;
    handleUnsend: (messageId: string) => void;
    user: IUser | null;
}

const ChatCard = forwardRef<HTMLDivElement, MessageCardProps>(({ message, isLastMessage, handleReactIcon, setReplyingTo, handleUnsend, user }, ref) => {
    const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = useState(false);
    // ✅ Hiển thị actions khi hover HOẶC khi popover đang mở
    const shouldShowActions = isHovered || emojiPopoverOpen;

    return (
        <div
            className="flex items-start gap-3 py-5 px-3 hover:bg-gray-200/10 rounded-xl group"
            id={message?._id}
            ref={isLastMessage ? ref : null}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Link href={`/profile/${message.userId._id}`} className="block w-10 md:w-12 h-10 md:h-12 relative rounded-full overflow-hidden">
                <Image src={message?.userId.profilePicture} alt="" fill className="absolute w-full h-full object-cover" />
            </Link>
            <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between h-7">
                    <div className="flex items-center gap-2">
                        <Link href={`/profile/${message.userId._id}`} className="font-medium hover:underline">
                            {message?.userId?.displayName}
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{handleCompareDate(message?.timestamp)}</p>
                        {message?.isEdit && <span className="text-xs text-gray-400"> (Đã chỉnh sửa)</span>}
                        {message?.replyTo && (
                            <span className="text-xs text-gray-400 w-[70px]  md:max-w-[350px] truncate">
                                {/* href={`#${message.replyTo._id}`} */}
                                (Trả lời {message?.replyTo?.userId.displayName}:{" "}
                                <Link className="hover:underline hover:text-white/80" href="#">
                                    {message?.replyTo.message}
                                </Link>
                                )
                            </span>
                        )}
                    </div>
                    {/* ✅ Hiển thị actions khi hover hoặc popover mở */}
                    <div className={`items-center gap-2 transition-all duration-200 ${shouldShowActions ? "flex" : "hidden"}`}>
                        <PopperEmoji open={emojiPopoverOpen} setOpen={setEmojiPopoverOpen} handleReactIcon={handleReactIcon} messageId={message?._id}>
                            <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md  cursor-pointer text-gray-800 dark:text-gray-400 dark:text-white/60 hover:text-white transition-all duration-500 ">
                                <Heart size={14} className="" />
                            </div>
                        </PopperEmoji>
                        <div
                            className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-800 dark:text-gray-400 dark:text-white/60 hover:text-white"
                            onClick={() => setReplyingTo(message)}>
                            <MessageCircle size={14} />
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                {user?._id === message?.userId._id && (
                                    <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-800 dark:text-gray-400 dark:text-white/60 hover:text-white">
                                        <Trash size={14} />
                                    </div>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Bạn có chắc muốn xóa không</DialogTitle>
                                    <DialogDescription>Bạn sẽ không thể hoàn tác hành động này. Vui lòng xác nhận để tiếp tục.</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Hủy</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => {
                                            handleUnsend(message?._id);
                                            setOpen(false);
                                        }}
                                        className="text-white">
                                        Xóa
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="w-full bg-gray-300/50 dark:bg-gray-500/50 px-3 py-2 md:py-3 md:px-5 rounded-md md:rounded-xl">
                    {message?.unsend ? (
                        <p className="break-words whitespace-normal text-xs text-gray-400">Tin nhắn đã bị gỡ...</p>
                    ) : (
                        <p className="break-words whitespace-normal">{message?.message}</p>
                    )}
                </div>
                <Dialog>
                    <DialogTrigger>
                        {" "}
                        <div className="">{message?.image && <Image src={message?.image} alt="" width={200} height={200} className=" object-contain rounded-lg" />}</div>
                    </DialogTrigger>
                    <DialogContent className="w-[1000px] h-[600px]">
                        <div className="relative w-full h-full">
                            <Image src={message?.image} alt="" fill className="absolute object-contain rounded-lg" />
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-2">
                    {message?.reactions?.map((react, index) => (
                        <div className="flex rounded-full items-center px-3 py-1 bg-slate-300/50 dark:bg-slate-900/50 cursor-pointer " key={index}>
                            <Image src={react.emoji} alt="" width={15} height={15} className="" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

ChatCard.displayName = "ChatCard";

export default ChatCard;
