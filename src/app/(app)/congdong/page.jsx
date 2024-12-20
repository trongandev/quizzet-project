"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { GET_API, POST_API, POST_API_FILE } from "@/lib/fetchAPI";
import Image from "next/image";
import { Image as Images } from "antd";

import Link from "next/link";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { Popover } from "antd";
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

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token);
            if (req) {
                setMessages(req.messages);
                setHasMore(req.hasMore);
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

    const loadMoreMessages = () => {
        setSkip((prevSkip) => prevSkip + 50);
    };

    // // Debounce function
    // const debounce = (func, wait) => {
    //     let timeout;
    //     return function executedFunction(...args) {
    //         const later = () => {
    //             clearTimeout(timeout);
    //             func(...args);
    //         };
    //         clearTimeout(timeout);
    //         timeout = setTimeout(later, wait);
    //     };
    // };

    // // Xử lý typing status
    // const handleTyping = useCallback(
    //     debounce((isTyping) => {
    //         if (socket) {
    //             if (isTyping) {
    //                 socket.emit("startTyping", { roomId, userId, username });
    //             } else {
    //                 socket.emit("stopTyping", { roomId, userId });
    //             }
    //         }
    //     }, 300),
    //     [socket, roomId, userId, username]
    // );

    // const handleInputChange = (e) => {
    //     setMessage(e.target.value);
    //     handleTyping(e.target.value.length > 0);
    // };

    const handleSendMessage = async () => {
        let imageUrl = "";

        if (image) {
            const formData = new FormData();
            formData.append("image", image);
            try {
                const req = await POST_API_FILE("/upload", formData, token);
                const res = await req.json();
                imageUrl = res.imageUrl;
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        if (newMessage.trim() && token !== undefined) {
            const messageData = { userId: user, message: newMessage, image: imageUrl, token };
            socket.emit("sendMessageCommu", messageData);
            setNewMessage("");
            setImage(null);
            setImageReview(null);
        }
    };
    // const handleBlur = () => {
    //     handleTyping(false);
    // };
    const reactIcons = [
        "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png",
        "https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png",
        "https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png",
        "https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png",
        "https://static.xx.fbcdn.net/images/emoji.php/v9/t47/1/32/1f621.png",
        "https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png",
    ];
    const [openReact, setOpenReact] = useState(false);

    const hideReact = () => {
        setOpen(false);
    };

    const handleOpenChangeReact = (newOpen) => {
        setOpenReact(newOpen);
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            const req = await POST_API("/chatcommu/react", { messageId, userId, emoji }, "POST", token);
            await req.json();
            const updatedMessages = messages.map((msg) => (msg._id === messageId ? { ...msg, reactions: [...msg.reactions, { userId, emoji }] } : msg));
            setMessages(updatedMessages);
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
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
                <div className="h-[400px]  overflow-y-scroll flex gap-1 flex-col pr-3">
                    {messages &&
                        messages?.map((msg, index) => (
                            <div className="" key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                                {hasMore && <button onClick={loadMoreMessages}>Load more</button>}
                                {user?._id === msg?.userId._id ? (
                                    <div className="flex gap-1 items-center justify-end ">
                                        <div className="">
                                            <p className="bg-linear-item-2 rounded-full px-3 py-1 mb-[2px]">{msg?.message}</p>
                                            {msg?.image && <Images src={process.env.API_IMAGE + msg?.image || "/meme.jpg"} alt="" width={200} height="auto" className=" object-cover  rounded-2xl" />}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 items-center group">
                                        <Link href={`/profile/${msg?.userId._id}`} className="w-[100px] flex justify-center flex-col items-center">
                                            <div className="w-[40px] h-[40px] relative ">
                                                <Image
                                                    src={msg?.userId.profilePicture || "/meme.jpg"}
                                                    alt=""
                                                    className="w-full h-full object-cover absolute border-2 border-primary rounded-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <p className="text-primary font-bold">{msg?.userId.displayName}</p>
                                        </Link>
                                        <div className="">
                                            <p className="bg-linear-item-2 px-3 py-1 w-full rounded-full mb-[2px]">{msg?.message}</p>
                                            {msg?.image && <Images src={process.env.API_IMAGE + msg?.image || "/meme.jpg"} alt="" width={200} height={70} className=" object-cover  rounded-2xl" />}
                                        </div>
                                        <div className="hidden group-hover:block">
                                            <Popover
                                                content={
                                                    <div className="flex gap-4 items-center">
                                                        {reactIcons.map((icon, index) => (
                                                            <Image src={icon} alt="" width={25} height={25} className="cursor-pointer" key={index} />
                                                        ))}
                                                    </div>
                                                }
                                                trigger="click"
                                                open={openReact}
                                                onOpenChange={handleOpenChangeReact}>
                                                <MdOutlineInsertEmoticon size={22} className="cursor-pointer hover:text-primary" />
                                            </Popover>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
                <div className="mt-5">
                    {user === null ? (
                        <div className="text-center">
                            <p>Bạn cần đăng nhập để có thể chat cùng với cộng đồng</p>
                        </div>
                    ) : (
                        <div className="">
                            <div className="flex gap-2">
                                <input
                                    type="text"
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
                                <button type="submit" disabled={token === undefined} onClick={handleSendMessage}>
                                    <IoSend />
                                </button>
                            </div>
                            {imageReview && (
                                <div className="relative w-[100px] h-[100px] mt-3">
                                    <Image src={imageReview} alt="" className="w-full h-full rounded-lg absolute object-cover" fill></Image>
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
                <h3>Các thành viên đang online: {onlineUsers.length}</h3>
                <div className="grid grid-cols-3 gap-3 mt-2">
                    {onlineUsers?.map((onl_user) => (
                        <Link
                            className={`flex flex-col items-center  ${
                                onl_user._id ? "group bg-linear-item-2 text-secondary " : "border border-purple-900 text-purple-900 cursor-default"
                            } rounded-md py-2`}
                            key={onl_user.socketId}
                            href={`${onl_user._id ? `/profile/${onl_user._id}` : "#"} `}
                            passHref>
                            <div className="w-[50px] h-[50px] overflow-hidden relative rounded-full">
                                <Image
                                    src={onl_user?.profilePicture || "/meme.jpg"}
                                    alt=""
                                    className={`w-full h-full object-cover absolute  border ${onl_user._id ? "border-primary" : ""}  rounded-full`}
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
