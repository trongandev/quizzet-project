"use client";
import handleCompareDate from "@/lib/CompareDate";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { Badge, Popover, Spin } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaComment } from "react-icons/fa6";
import { RiMessengerLine } from "react-icons/ri";
import CShowMessage from "./CShowMessage";
import { FaArrowLeft } from "react-icons/fa";
import { useSocket } from "@/context/socketContext";

function useDebounce(value, duration = 300) {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, duration);
        return () => {
            clearTimeout(timer);
        };
    }, [value]);
    return debounceValue;
}

export default function CChat({ token, user, router }) {
    const [input, setInput] = useState("");

    const debouncedSearchTerm = useDebounce(input, 300);
    const [unreadCountChat, setUnreadCountChat] = useState(0);
    const [openChat, setOpenChat] = useState(false);
    const [chat, setChat] = useState([]);
    const [chatMessId, setChatMessId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(null);
    const [search, setSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const { socket, onlineUsers } = useSocket();

    const handleOpenChat = (newOpen) => {
        setOpenChat(newOpen);
    };

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API("/chat", token);
            if (req) {
                setChat(req?.chats);
                setUnreadCountChat(req?.unreadCount || 0);
            }
        };

        if (user) {
            fetchAPI();
        }
    }, [user, token, chatMessId]);

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const req = await GET_API(`/profile/findbyname/${input}`, token);
            if (req.ok) {
                setSearch(req?.users);
            } else {
                message.error(req.message);
            }
            setLoading(false);
        };

        if (debouncedSearchTerm && input !== "") {
            fetchAPI();
        }
    }, [debouncedSearchTerm]);

    // const handleRouterChat = async (item) => {
    //     const req = await GET_API(`/notify/${item?._id}`, token);
    //     if (req.ok) {
    //         setUnreadCountNotify(req?.unreadCount || 0);
    //         router.push(item?.link);
    //         setOpenNoti(false);
    //     }
    // };

    useEffect(() => {
        if (input === "") {
            setSearch([]); // Gán lại danh sách chat mặc định
        }
    }, [input, chat]);

    const handleCreateAndCheckRoomChat = async (id_another_user, index) => {
        setLoadingChat(index);
        const req = await POST_API(
            "/chat/create-chat",
            {
                participants: [user._id, id_another_user],
            },
            "POST",
            token
        );
        const res = await req.json();

        if (req.ok) {
            setChatMessId(res?.chatId);
            setOpenChat(false);
        }
        setLoadingChat(null);
    };

    const handleDeleteChat = () => {
        setChatMessId(null);
    };

    const checkOnline = (userId) => {
        return onlineUsers?.find((item) => item?._id === userId);
    };
    return (
        <>
            <Popover
                content={
                    <div className="w-full md:w-[400px] max-h-[600px] overflow-y-scroll">
                        <div className="min-h-[600px]">
                            <div className="flex gap-2 items-center h-9  mb-3">
                                {isSearch && (
                                    <div
                                        className="h-full flex items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
                                        onClick={() => {
                                            setIsSearch(false);
                                            setInput("");
                                        }}>
                                        <FaArrowLeft />
                                    </div>
                                )}

                                <div className="flex flex-1 items-center h-full bg-white rounded-lg border border-gray-200" onClick={() => setIsSearch(true)}>
                                    <div className="flex items-center justify-center w-9 h-full">
                                        <BiSearch size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tìm mọi người..."
                                        className="h-full p-0 border-none bg-transparent hover:border-none focus-visible:border-none"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}></input>
                                </div>
                            </div>
                            {!isSearch &&
                                chat?.map((item, index) => {
                                    const otherParticipant = item?.participants.find((p) => p?.userId?._id !== user?._id);
                                    return (
                                        <div
                                            onClick={() => handleCreateAndCheckRoomChat(otherParticipant?.userId?._id, index)}
                                            key={index}
                                            className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer rounded-lg h-[80px]">
                                            <div className="w-[56px] h-[56px] relative">
                                                <Image
                                                    src={otherParticipant?.userId?.profilePicture || "/avatar.jpg"}
                                                    alt=""
                                                    className="object-cover h-full absolute overflow-hidden rounded-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                {checkOnline(otherParticipant?.userId?._id) && <div className="absolute z-1 right-1 bottom-0 w-3 h-3 rounded-full bg-[#3fbb46]" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-700 line-clamp-2">
                                                    <label htmlFor="" className="font-bold">
                                                        {otherParticipant?.userId?.displayName}
                                                    </label>
                                                    {item?.content}
                                                </p>
                                                {item?.last_message ? (
                                                    <div className="text-gray-500 text-[12px] ">
                                                        <p className="line-clamp-1"> {item?.last_message} </p>
                                                        <p className="font-medium">{item?.last_message_date && handleCompareDate(item?.last_message_date)}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-[12px]">Chưa có tin nhắn!</p>
                                                )}
                                            </div>
                                            {loadingChat === index && <Spin indicator={<LoadingOutlined spin />} size="default" />}

                                            {!loadingChat === index && item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                    );
                                })}
                            {isSearch &&
                                search?.map((item, index) => (
                                    <div
                                        onClick={() => handleCreateAndCheckRoomChat(item?._id, index)}
                                        key={index}
                                        className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer rounded-lg h-[80px]">
                                        <div className="w-[56px] h-[56px] relative">
                                            <Image
                                                src={item?.profilePicture || "/avatar.jpg"}
                                                alt=""
                                                className="object-cover h-full absolute overflow-hidden rounded-full"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            {checkOnline(user?._id === item?._id ? item?._id : item?._id) && <div className="absolute z-1 right-1 bottom-0 w-3 h-3 rounded-full bg-[#3fbb46]" />}
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-gray-700 line-clamp-2">
                                                <label htmlFor="" className="font-bold">
                                                    {item?.displayName}
                                                </label>{" "}
                                                {item?.content}
                                            </p>
                                            <p className="text-gray-500 text-[12px]">Tham gia {item?.created_at && handleCompareDate(item?.created_at)}</p>
                                        </div>
                                        {loadingChat === index && <Spin indicator={<LoadingOutlined spin />} size="default" />}
                                    </div>
                                ))}

                            {!isSearch && !loading && chat?.length === 0 && <div className="text-center text-gray-500">Bạn chưa có tin nhắn nào...</div>}
                            {loading && (
                                <div className="flex items-center justify-center w-full">
                                    <Spin indicator={<LoadingOutlined spin />} size="default" />
                                </div>
                            )}
                        </div>
                    </div>
                }
                trigger="click"
                open={openChat}
                onOpenChange={handleOpenChat}
                title="Chat">
                <Badge count={unreadCountChat} offset={[-5, 5]} size="small" className="text-primary hover:text-secondary cursor-pointer">
                    <RiMessengerLine size={26} />
                </Badge>
            </Popover>
            <CShowMessage chatMessId={chatMessId} handleDeleteChat={handleDeleteChat} token={token} socket={socket} checkOnline={checkOnline} />
        </>
    );
}
