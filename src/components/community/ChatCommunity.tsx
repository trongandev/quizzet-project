"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";

import { Bell, EllipsisVertical, Hash, ImagePlus, Minus, Search, Send, Smile, Users, X } from "lucide-react";
import Image from "next/image";
import ChatCard from "@/components/community/ChatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IChatCommunityMessage } from "@/types/type";
import Link from "next/link";
import { toast } from "sonner";
import { Label } from "../ui/label";
import Loading from "../ui/loading";
import axios from "axios";

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

export default function ChatCommunity() {
    const userContext = useUser();
    const user = userContext ? userContext.user : null;
    const token = Cookies.get("token") || "";
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<IChatCommunityMessage[]>([]);
    const [skip, setSkip] = useState(0);
    const { socket, onlineUsers } = useSocket();
    const [isTyping, setIsTyping] = useState(false); // quản lí trạng thái đang gõ của người dùng
    const [loading, setLoading] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null); // tham chiếu đến input
    const [image, setImage] = useState("");
    const [imageReview, setImageReview] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<IChatCommunityMessage | null>(null); // quản lí trạng thái đang trả lời tin nhắn nào
    const fetchInitialMessages = useCallback(async () => {
        setLoading(true);
        const req = await GET_API_WITHOUT_COOKIE(`/chatcommu?skip=${skip}&limit=50`);
        if (req.ok) {
            const sortedMessages = req.messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            setMessages(sortedMessages);
            // setHasMore(req?.hasMore);
            // setSkip(50);
            setLoading(false);
        }
    }, [skip]);

    useEffect(() => {
        fetchInitialMessages();

        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        // ✅ Dùng setTimeout để đảm bảo DOM đã render
        const scrollToBottom = () => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end", // ✅ Scroll đến cuối element
                });
            }
        };

        // ✅ Timeout để đảm bảo DOM update xong
        const timeoutId = setTimeout(scrollToBottom, 100);

        return () => clearTimeout(timeoutId);
    }, [messages]);

    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage: { _id: string; [key: string]: any }) => {
                setMessages((prev: any) => [...prev, newMessage]); // Sử dụng setMessages thay vì setChatState
            },
            handleUnsend: (messageId: string) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
            },
            handleReact: (messageId: string, reactions: any) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, reactions: reactions } : msg)));
            },
        }),
        []
    );

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessageCommu", messageHandlers.updateMessages);
        socket.on("replyUnsendMessageCommu", messageHandlers.handleUnsend);
        socket.on("replyReactMessageCommu", messageHandlers.handleReact);

        return () => {
            socket.off("newMessageCommu", messageHandlers.updateMessages);
            socket.off("replyUnsendMessageCommu", messageHandlers.handleUnsend);
            socket.off("replyReactMessageCommu", messageHandlers.handleReact);
        };
    }, [socket, messageHandlers]);

    const handleSendMessage = useCallback(async () => {
        if (!inputRef.current?.value.trim()) {
            toast.error("Vui lòng nhập nội dung tin nhắn", { position: "top-center", duration: 3000 });
            return;
        }
        setLoading(true);
        try {
            let imageUrl = "";
            if (image) {
                toast.loading("Đang tải hình ảnh lên server", { duration: 2000, position: "top-center", id: "upload-image" });
                const formData = new FormData();

                formData.append("image", image);
                const uploadResponse = await axios.post(`${process.env.API_ENDPOINT}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                imageUrl = uploadResponse?.data?.url;
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
            setImage("");
            setImageReview(null);
            setReplyingTo(null);
            toast.success("Thành công", { duration: 2000, position: "top-center", id: "upload-image" });
        } catch (error: any) {
            toast.error("Lỗi khi gửi tin nhắn", { description: error.message, position: "top-center", duration: 10000 });
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    }, [image, user, token, replyingTo, socket]);

    const handleUnsend = async (messageId: string) => {
        try {
            setLoading(true);
            socket.emit("unsendMessageCommu", { messageId, userId: user?._id, token });
            // const req = await POST_API(`/chatcommu/unsend`, { messageId, userId: user?._id }, "POST", token);
            // const res = await req?.json();
            // if (res.ok) {
            //     setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
            // }
        } catch (error: any) {
            toast.error("Lỗi khi gỡ tin nhắn", { description: error.message, position: "top-center", duration: 10000 });
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReactIcon = async (messageId: string, emoji: any) => {
        try {
            if (!user) return;
            socket.emit("reactMessageCommu", { messageId, userId: user?._id, token, emoji });
            // const req = await POST_API(`/chatcommu/react`, { messageId, userId: user._id, emoji }, "POST", token);
            // if (req) {
            //     const res = await req.json();
            //     if (res.ok) {
            //         setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, reactions: res.reactions } : msg)));
            //     }
            // }
        } catch (error: any) {
            toast.error("Lỗi khi thả cảm xúc " + error.message);
            console.error("Error sending message:", error);
        }
    };

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

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setImage(file);
        setImageReview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-16 mx-3 md:mx-0">
                <div className="text-third dark:text-white flex flex-col md:flex-row px-0 min-h-[85vh] border-t-gray-300/50 dark:border-white/10 border  shadow-xl w-full rounded-xl overflow-hidden ">
                    <div className=" flex-1">
                        {/* {khung chat ben trái} */}
                        <div className="w-auto border-b border-t-gray-300/50 dark:border-b-white/10 flex items-center md:justify-between  h-16 md:px-5 px-3 bg-white dark:bg-slate-800/50 ">
                            {/* header */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 ">
                                    <Hash className="text-4xl font-bold dark:text-gray-400" />
                                    <h3>Quizzet Community</h3>
                                </div>
                                <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600 "></div>
                                <p className="dark:text-white/60 line-clamp-1 hidden md:block">Kênh thảo luận chung cho cộng đồng</p>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
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
                        <div className="flex flex-col ">
                            <div
                                className={`py-5 px-3 flex-1  bg-white/80 dark:bg-inherit ${
                                    replyingTo && imageReview
                                        ? "max-h-[calc(80vh-249px)] min-h-[calc(80vh-249px)]"
                                        : imageReview
                                        ? "max-h-[calc(80vh-200px)] min-h-[calc(80vh-200px)]"
                                        : replyingTo
                                        ? "max-h-[calc(80vh-150px)] min-h-[calc(80vh-150px)]"
                                        : "max-h-[calc(80vh-100px)] min-h-[calc(80vh-100px)]"
                                } overflow-y-auto  flex flex-col gap-2 overscroll-contain`}>
                                {messages &&
                                    messages.map((message, index) => (
                                        <ChatCard
                                            key={message._id || index}
                                            message={message}
                                            ref={lastMessageRef}
                                            isLastMessage={index === messages.length - 1}
                                            handleReactIcon={handleReactIcon}
                                            setReplyingTo={setReplyingTo}
                                            handleUnsend={handleUnsend}
                                            user={user}
                                        />
                                    ))}
                                {loading && (
                                    <div className="flex items-center justify-center col-span-4 h-[500px]">
                                        <Loading className="h-12 w-12" />{" "}
                                    </div>
                                )}
                            </div>
                            <div
                                className={`border-t border-t-gray-300/50 dark:border-t-white/10 bg-white dark:bg-slate-800/50 ${
                                    replyingTo && imageReview ? "h-[249px]" : imageReview ? "h-[200px]" : replyingTo ? "h-[150px]" : "h-[100px]"
                                }`}>
                                {replyingTo && (
                                    <div className="px-5  border-b border-t-gray-300/50 dark:border-b-white/10 ">
                                        <div className="h-12 flex items-center justify-between ">
                                            <p className="">
                                                Bạn đang trả lời <span className="font-bold"> {user?._id === replyingTo.userId._id ? "chính bản thân" : replyingTo.userId.displayName}</span>{" "}
                                            </p>
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/50 hover:bg-white/10 transition-all duration-300">
                                                <X size={16} onClick={() => setReplyingTo(null)} className="" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {imageReview && (
                                    <div className="px-5  border-b border-t-gray-300/50 dark:border-b-white/10 ">
                                        <div className="relative h-12 w-12 md:h-24 md:w-36 overflow-hidden">
                                            <Image src={imageReview} alt="Image preview" fill className="w-full h-full py-2  absolute object-cover rounded-md" />
                                            <div
                                                className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-red-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                                onClick={() => {
                                                    setImageReview(null);
                                                    setImage("");
                                                }}>
                                                <X size={16} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {user ? (
                                    <div className="p-5 ">
                                        <div className="px-3  border border-gray-300/50 shadow-sm dark:border-white/10 rounded-xl h-16 w-full flex items-center justify-between">
                                            {/* <DialogAddImage image={image} setImage={setImage}>
                                        </DialogAddImage> */}
                                            <div className="">
                                                <Label
                                                    htmlFor="image"
                                                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                                    <ImagePlus size={18} />
                                                </Label>
                                                <input id="image" type="file" className="hidden" onChange={(e) => handleImageChange(e)} />
                                            </div>
                                            <Input
                                                onChange={handleMessageChange}
                                                ref={inputRef}
                                                onPaste={handlePaste}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Nhắn tin tới # cộng đồng quizzet "
                                                className="flex-1 text-sm md:text-md border-none shadow-none ring-0 outline-none focus-visible:ring-0"></Input>
                                            <div className="flex items-center gap-3">
                                                <div className="hidden md:flex h-10 w-10 items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                                    <Smile size={18} />
                                                </div>
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={loading}
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500  text-white h-10 px-4 rounded-lg hover:scale-[1.02] transition-all duration-200">
                                                    {loading ? <Loading /> : <Send />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-16 flex items-center justify-center text-center">
                                        <p>Bạn cần phải đăng nhập để gia nhập chat cộng đồng</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[300px] p-4 bg-white dark:bg-slate-800/50 md:border-s  md:border-s-gray-300/50 dark:md:border-s-white/10 border-t md:border-t-gray-300/50 dark:border-t-white/10">
                        {/* Online Users List */}
                        <div className="flex items-center gap-2 text-md md:text-lg">
                            <Users className="text-gray-400" size={20} />{" "}
                            <span className="inline-flex items-end">
                                Thành viên <Minus /> {onlineUsers?.length || "0"}
                            </span>
                        </div>
                        <div className="space-y-3 mt-8 h-full">
                            {/* {onlineUsers && onlineUsers.map((user: any, index: number) => <OnlineUsers key={index} onlineUsers={user} />)} */}
                            {onlineUsers &&
                                onlineUsers.map((user: any, index: number) => {
                                    // if (user._id === userContext?.user?._id) return null; // Skip the current user
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
