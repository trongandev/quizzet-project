"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { GET_API, GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import { message, Spin } from "antd";

import axios from "axios";

import MessageList from "./MessageList";
import ChatArea from "./ChatArea";

import OnlineUsers from "./OnlineUsers";
import { Bell, EllipsisVertical, Hash, Heart, ImagePlus, MessageCircle, Minus, Paperclip, Search, Send, Share, Smile, Users } from "lucide-react";
import Image from "next/image";
import ChatCard from "@/components/community/ChatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IChatCommunityMessage } from "@/types/type";
import Link from "next/link";
import { toast } from "sonner";

const debounce = (func: any, wait: any) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export default function CongDong() {
    const userContext = useUser();
    const user = userContext ? userContext.user : null;
    const token = Cookies.get("token") || "";
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<IChatCommunityMessage[]>([]);
    const [skip, setSkip] = useState(0);
    const { socket, onlineUsers } = useSocket();
    const [isTyping, setIsTyping] = useState(false); // quản lí trạng thái đang gõ của người dùng
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null); // tham chiếu đến input
    const [image, setImage] = useState(null);
    const [imageReview, setImageReview] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState(null); // quản lí trạng thái đang trả lời tin nhắn nào
    const [newMessage, setNewMessage] = useState(""); // tạo tin nhắn mới
    const fetchInitialMessages = useCallback(async () => {
        const req = await GET_API_WITHOUT_COOKIE(`/chatcommu?skip=${skip}&limit=50`);
        if (req.ok) {
            const sortedMessages = req.messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            setMessages(sortedMessages);
            // setHasMore(req?.hasMore);
            // setSkip(50);
        }
    }, [skip]);

    useEffect(() => {
        fetchInitialMessages();

        return () => {
            // Cleanup if needed
        };
    }, []);

    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage: { _id: string; [key: string]: any }) => {
                setMessages((prev: any) => [...prev, newMessage]); // Sử dụng setMessages thay vì setChatState
            },
            handleUnsend: (messageId: string) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
            },
        }),
        []
    );

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessageCommu", messageHandlers.updateMessages);
        socket.on("replyUnsendMessageCommu", messageHandlers.handleUnsend);

        return () => {
            socket.off("newMessageCommu", messageHandlers.updateMessages);
            socket.off("replyUnsendMessageCommu", messageHandlers.handleUnsend);
        };
    }, [socket, messageHandlers]);

    const handleSendMessage = useCallback(async () => {
        if (!inputRef.current?.value.trim() && !image) return;
        // Gửi typing nếu chưa từng gửi
        // if (!isTyping) {
        //   socket.emit("typing", { roomId: "community", userId: user?._id });
        //   setIsTyping(true);
        // }

        //   clearTimeout(typingTimeout);
        // typingTimeout = setTimeout(() => {
        //     socket.emit("stopTyping", { roomId: "community", userId });
        //     typing = false;
        // }, 3000); // 3s không gõ thì gửi stopTyping
        //     setLoading(true);
        try {
            let imageUrl = "";
            if (image) {
                const formData = new FormData();
                formData.append("image", image);
                const response = await axios.post(process.env.API_ENDPOINT + "/upload", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                imageUrl = response.data.originalUrl;
            }

            const messageData = {
                userId: user?._id,
                message: inputRef.current?.value || "",
                image: imageUrl,
                token,
                replyTo: replyingTo,
            };
            socket.emit("sendMessageCommu", messageData);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            setImage(null);
        } catch (error: any) {
            toast.error("Lỗi khi gửi tin nhắn: " + error.message);
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    }, [image, user, token, replyingTo, socket]);

    const handlePaste = (event: any) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.includes("image")) {
                const blob = items[i].getAsFile();
                const url = URL.createObjectURL(blob);
                setImage(blob);
                setImageReview(url);
                break;
            }
        }
    };

    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.value = e.target.value;
        }
    }, []);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && inputRef.current) {
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-16">
                <div className="text-third dark:text-white flex flex-row px-3 md:px-0 min-h-[85vh] dark:border-white/10 border  shadow-xl w-full rounded-xl overflow-hidden">
                    <div className=" flex-1">
                        {/* {khung chat ben trái} */}
                        <div className="border-b border-b-white/10 flex items-center justify-between  h-16 px-5 bg-white dark:bg-slate-800/50 ">
                            {/* header */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <Hash className="text-4xl font-bold dark:text-gray-400" />
                                    <h3>Quizzet Community</h3>
                                </div>
                                <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600 "></div>
                                <p className="dark:text-white/60">Kênh thảo luận chung cho cộng đồng</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <Bell size={18} />
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <Search size={18} />
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <EllipsisVertical size={18} />
                                </div>
                            </div>
                        </div>
                        {/* nội dung chính */}
                        <div className="flex flex-col">
                            <div className="py-5 px-3 flex-1 max-h-[calc(80vh-100px)] min-h-[calc(80vh-100px)] overflow-y-auto  flex flex-col gap-2">
                                {messages &&
                                    messages.map((message, index) => (
                                        <ChatCard key={index} message={message} isLast={index === messages.length - 1} ref={index === messages.length - 1 ? lastMessageRef : null} />
                                    ))}

                                {/* <ChatCard />
                                <ChatCard />
                                <ChatCard /> */}
                            </div>
                            <div className="p-5 border-t border-t-white/10 bg-white dark:bg-slate-800/50 h-[100px]">
                                <div className="px-3 border border-white/10 rounded-xl h-full w-full flex items-center justify-between">
                                    <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                        <Paperclip size={18} />
                                    </div>
                                    <Input
                                        value={newMessage}
                                        onChange={handleMessageChange}
                                        ref={inputRef}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhắn tin tới # cộng đồng quizzet "
                                        className="flex-1 text-xl border-none ring-0 outline-none focus-visible:ring-0"></Input>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                            <ImagePlus size={18} />
                                        </div>
                                        <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                            <Smile size={18} />
                                        </div>
                                        <Button
                                            onClick={handleSendMessage}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500  text-white h-10 px-4 rounded-lg hover:scale-[1.02] transition-all duration-200">
                                            <Send></Send>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[300px] p-4 bg-white dark:bg-slate-800/50 border-s border-s-white/10 ">
                        {/* Online Users List */}
                        <div className="flex items-center gap-2 text-lg">
                            <Users className="text-gray-400" size={20} />{" "}
                            <span className="inline-flex items-end">
                                Thành viên <Minus /> {onlineUsers.lenght || "0"}
                            </span>
                        </div>
                        <div className="space-y-3 mt-8 h-full">
                            {/* {onlineUsers && onlineUsers.map((user: any, index: number) => <OnlineUsers key={index} onlineUsers={user} />)} */}
                            {onlineUsers &&
                                onlineUsers.map((user: any, index: number) => {
                                    if (user._id === userContext?.user?._id) return null; // Skip the current user
                                    return (
                                        <Link
                                            href={`/profile/${user?._id}` || ""}
                                            className="flex items-center justify-between group hover:bg-white/20 p-3 rounded-lg transition-all duration-300 cursor-pointer"
                                            key={index}>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12">
                                                    <Image src={user?.profilePicture || "/avatar.jpg"} alt="" fill className="absolute object-cover rounded-full"></Image>
                                                    <div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0"></div>
                                                </div>
                                                <div className="">
                                                    <h1 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-all duration-300">
                                                        {" "}
                                                        {user?.displayName || "Khách vãng lai"}
                                                    </h1>
                                                    <p className="text-gray-500 dark:text-gray-400 ">Đang online...</p>
                                                </div>
                                            </div>
                                            <div className="text-white/60 hidden group-hover:block transition-all duration-300">
                                                <EllipsisVertical size={18} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            <div className="">{onlineUsers && !onlineUsers.length && <div className="text-center text-gray-400">Không có thành viên nào đang online...</div>}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
