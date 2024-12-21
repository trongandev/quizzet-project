"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { GET_API } from "@/lib/fetchAPI";
import Image from "next/image";
import { Image as Images, Spin, Tooltip } from "antd";

import Link from "next/link";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineInsertEmoticon, MdOutlineReply } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { Popover } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaRegImage } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
export default function CongDong() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { socket, onlineUsers } = useSocket();
    const { user } = useUser();
    const userId = user?._id;
    const token = Cookies.get("token");
    const lastMessageRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageReview, setImageReview] = useState(null);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [emoji, setEmoji] = useState([]);
    const [emojiData, setEmojiData] = useState([]);
    const [searchEmoji, setSearchEmoji] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token);
            if (req) {
                setMessages(req.messages);
                setHasMore(req.hasMore);
                setSkip((prevSkip) => prevSkip + 50);
            }

            const reqEmoji = await fetch("https://emoji-api.com/emojis?access_key=bf409e3ed3d59cc01d12b7f1a9512896fe36f4f1");
            const dataEmoji = await reqEmoji.json();

            setEmoji(dataEmoji);
            setEmojiData(dataEmoji);
        };
        fetchAPI();
    }, []);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessageCommu", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit("userDisconnect", userId);
            socket.off();
        };
    }, [socket, userId, token]);

    const loadMoreMessages = async () => {
        setLoading(true);
        setSkip((prevSkip) => prevSkip + 50);
        try {
            const newMessages = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token); // Gọi API để tải tin nhắn
            setMessages((prevMessages) => [...newMessages.messages, ...prevMessages]);
            setHasMore(newMessages.length > 0);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Giữ vị trí cuộn khi tải thêm tin nhắn
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        setLoading(true);
        let imageUrl = "";

        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            const response = await axios.post(process.env.API_ENDPOINT + "/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Định dạng bắt buộc
                },
            });
            imageUrl = response.data.data;
        }

        if (newMessage.trim() || image) {
            const messageData = { userId: user, message: newMessage, image: imageUrl, token, replyTo: replyingTo };
            socket.emit("sendMessageCommu", messageData);
            setNewMessage("");
            setImage(null);
            setImageReview(null);
            setReplyingTo(null);
        }
        setLoading(false);
    };

    const handlePaste = (event) => {
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImageReview(file ? URL.createObjectURL(file) : null);
    };

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleSearchEmoji = (e) => {
        setSearchEmoji(e.target.value);
        const filteredData = emoji.filter((item) => item.unicodeName.includes(e.target.value));
        setEmojiData(filteredData);
    };
    return (
        <div className="text-third flex gap-5 flex-wrap px-3 md:px-0">
            <div className="my-5 w-full md:w-[700px] p-3 md:p-5  border border-primary  rounded-md">
                <div className="h-[400px] overflow-y-scroll flex flex-col pr-3 scroll-smooth" ref={scrollContainerRef}>
                    {loading && (
                        <div className="h-[300px] flex items-center justify-center">
                            <Spin indicator={<LoadingOutlined spin />} size="default" />
                        </div>
                    )}
                    {!loading && hasMore && (
                        <button onClick={loadMoreMessages} className="mb-5">
                            Load More Messages
                        </button>
                    )}
                    {messages &&
                        messages?.map((msg, index) => {
                            const isSameUser = index > 0 && messages[index - 1].userId._id === msg?.userId._id;
                            const isCurrentUser = msg?.userId._id === user?._id;
                            const isLastMessage = index === messages?.length - 1;

                            return (
                                <div key={index} ref={isLastMessage ? lastMessageRef : null}>
                                    {/* Hiển thị tên người dùng trên đầu nhóm */}
                                    {!isSameUser && !isCurrentUser && <p className="ml-[45px] text-gray-500 text-sm mb-1 pl-1">{msg?.userId.displayName}</p>}

                                    {/* Tin nhắn */}
                                    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"} mb-[4px] group min-h-[40px] items-center`}>
                                        {/* Avatar của người khác */}
                                        {!isCurrentUser && !isSameUser && (
                                            <div className="w-[40px] h-[40px] relative mr-[-40px]">
                                                <Image
                                                    src={msg?.userId.profilePicture || "/meme.jpg"}
                                                    alt=""
                                                    unoptimized
                                                    className="w-full h-full object-cover absolute border-2 border-primary rounded-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        )}

                                        {/* Nội dung tin nhắn */}
                                        <div className={`max-w-[70%] ml-[45px]`}>
                                            {msg?.replyTo && (
                                                <div className="text-[12px]">
                                                    {isCurrentUser ? (
                                                        <p className="flex items-center gap-1">
                                                            <MdOutlineReply />
                                                            Bạn đã trả lời: {msg?.replyTo.userId.displayName}
                                                        </p>
                                                    ) : (
                                                        <p className="flex items-center gap-1">
                                                            <MdOutlineReply />
                                                            {msg?.userId.displayName} đã trả lời bạn
                                                        </p>
                                                    )}
                                                    <Link href={`#${msg?.replyTo._id}`} className={`block ${isCurrentUser ? "w-full text-end" : ""}`}>
                                                        <p className={` inline-block bg-gray-400 rounded-full px-3 py-2 mb-[-10px]`}>{msg?.replyTo.message}</p>
                                                    </Link>
                                                </div>
                                            )}
                                            <div className={` ${isCurrentUser ? "w-full text-end" : ""} `} id={msg?._id}>
                                                <p className={` ${isCurrentUser ? " bg-primary text-white" : "bg-gray-200 "} rounded-full px-3 py-2 inline-block`}>{msg?.message}</p>
                                            </div>
                                            {msg?.image && <Images src={msg?.image || "/meme.jpg"} alt="" width={200} height="auto" className="object-cover rounded-lg mt-2" />}
                                        </div>
                                        {!isCurrentUser && (
                                            <Tooltip placement="top" title="Trả lời">
                                                <label
                                                    htmlFor="message"
                                                    className="hidden group-hover:block h-full text-white ml-3 cursor-pointer bg-gray-400 p-2 rounded-full"
                                                    onClick={() => setReplyingTo(msg)}>
                                                    <MdOutlineReply />
                                                </label>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="mt-5">
                    {user === null ? (
                        <div className="text-center">
                            <p>Bạn cần đăng nhập để có thể chat cùng với cộng đồng</p>
                        </div>
                    ) : (
                        <div className="">
                            {replyingTo && (
                                <label htmlFor="message" className="block replying-to relative bg-linear-item-blue px-3 py-1 rounded-lg mb-2 text-secondary ">
                                    <div className="absolute top-2 right-3 cursor-pointer hover:text-red-500" onClick={() => setReplyingTo(null)}>
                                        <IoMdClose />
                                    </div>
                                    <h1 className="text-secondary font-bold">Bạn đang trả lời: {replyingTo?.userId.displayName}</h1>
                                    <p>{replyingTo?.message}</p>
                                </label>
                            )}
                            <div className="flex gap-2">
                                <label htmlFor="image" className=" bg-primary px-3  rounded-xl flex items-center justify-center text-white">
                                    <FaRegImage />{" "}
                                </label>
                                <input id="image" type="file" className="hidden" onChange={(e) => handleImageChange(e)} />
                                <input
                                    type="text"
                                    id="message"
                                    className="rounded-full"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn bạn muốn gửi... ctrl + v để dán ảnh"
                                    onPaste={handlePaste}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                />

                                <Popover
                                    content={
                                        <div>
                                            <div className="">
                                                <input placeholder="Tìm icon mà bạn thích" value={searchEmoji} onChange={(e) => handleSearchEmoji(e)}></input>
                                            </div>
                                            <div className="grid grid-cols-5 gap-1 w-[300px]  mt-2">
                                                {emojiData &&
                                                    emojiData.length > 0 && ( // Check if emoji exists and has elements
                                                        <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                            {emojiData.map((item, index) => (
                                                                <div className="flex items-center justify-center hover:bg-gray-200 cursor-pointer" key={index}>
                                                                    <h1 className="text-xl" onClick={() => setNewMessage(newMessage + item.character)}>
                                                                        {item.character}
                                                                    </h1>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                            </div>
                                            {emojiData && emojiData.length == 0 && <p className="h-[300px] flex items-center justify-center">Không tìm thấy Emojii này...</p>}
                                        </div>
                                    }
                                    title="Chọn icon"
                                    trigger="click"
                                    open={open}
                                    onOpenChange={handleOpenChange}>
                                    <button>
                                        <MdOutlineInsertEmoticon size={20} />
                                    </button>
                                </Popover>
                                <button type="submit" disabled={loading} onClick={handleSendMessage}>
                                    {loading ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : <IoSend />}
                                </button>
                            </div>
                            {imageReview && (
                                <div className="relative w-[100px] h-[100px] mt-3">
                                    <Image src={imageReview} unoptimized alt="" className="w-full h-full rounded-lg absolute object-cover" fill></Image>
                                    <GrFormClose
                                        className="absolute z-1 top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xl cursor-pointer hover:opacity-80"
                                        onClick={() => {
                                            setImage(null);
                                            setImageReview(null);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <h3>Các thành viên đang online: {onlineUsers?.length}</h3>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
                    {onlineUsers?.map((onl_user) => (
                        <Link
                            className={`flex flex-col items-center  ${
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
                            <p className="text-sm group-hover:underline  mt-1">{onl_user?.displayName || "Guest"}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
