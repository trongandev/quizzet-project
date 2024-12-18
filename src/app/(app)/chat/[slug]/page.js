"use client";
import { Button, Input, Popover, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import { MdArrowBackIos, MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";
import { GET_API } from "@/lib/fetchAPI";
import Image from "next/image";
import handleCompareDate from "@/lib/CompareDate";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/socketContext";
import { getEmoji } from "@/lib/cacheData";
export default function ChatRoom({ params }) {
    const { slug } = params;
    const [data, setData] = useState({});
    const [dataEmoji, setDataEmoji] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchEmoji, setSearchEmoji] = useState(false);
    const { user } = useUser();
    const lastMessageRef = useRef(null);
    const token = Cookies.get("token");

    const { socket } = useSocket();
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/chat/${slug}`, token);
            setData(req);
            setLoading(true);
            // const emojiData = await getEmoji();
            // console.log(emojiData);
            // setDataEmoji(emojiData);
        };
        fetchAPI();
    }, [slug]);

    const [input, setInput] = useState("");

    useEffect(() => {
        if (!socket) return;
        socket.emit("joinRoom", slug);

        socket.on("message", (data) => {
            setData((prevData) => ({
                ...prevData,
                messages: [...prevData.messages, data.newMessage],
            }));
        });

        return () => {
            socket.emit("leaveRoom", slug);
            socket.off();
        };
    }, [slug]);
    const addMessageToChatRoom = async (message) => {
        socket.emit("sendMessage", { chatRoomId: slug, message, userId: user.id, token });
    };

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [data.messages]);

    const handleSendMess = (e) => {
        e.preventDefault();
        if (input === "") return;
        addMessageToChatRoom(input);
        setInput("");
    };

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleSearchEmoji = (e) => {
        setSearchEmoji(e.target.value);
        const filteredData = emojiData.filter((item) => item.unicodeName.includes(e.target.value));
        setDataEmoji(filteredData);
    };
    const router = useRouter();
    const handleReturn = () => {
        router.push("/chat");
    };

    return (
        <div className=" w-full px-2 ">
            <div className=" border-b-[1px] flex justify-between items-center h-[10%]">
                <div className="flex items-center gap-1">
                    <div className="cursor-pointer " onClick={handleReturn}>
                        <MdArrowBackIos />
                    </div>
                    <div className="flex gap-2 items-center p-2">
                        <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] relative">
                            {data?.participants && (
                                <Image
                                    src={
                                        user?._id === data.participants[1]?._id
                                            ? data.participants[0]?.profilePicture || "/default-avatar.png"
                                            : data.participants[1]?.profilePicture || "/default-avatar.png"
                                    }
                                    className="w-full h-full rounded-full object-cover absolute"
                                    alt="User Avatar"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                            <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                        </div>
                        <div>
                            <h1 className="font-bold">
                                {data?.participants && data.participants.length >= 2
                                    ? user?._id === data.participants[1]?._id
                                        ? data.participants[0]?.displayName || "Đang tải..."
                                        : data.participants[1]?.displayName || "Đang tải..."
                                    : "Đang tải..."}
                            </h1>
                            <p className="text-gray-500 text-sm">Đang hoạt động</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 text-2xl px-3 text-orange-700">
                    <IoIosCall className="hover:text-gray-600 cursor-pointer" />
                    <IoVideocam className="hover:text-gray-600 cursor-pointer" />
                    <IoIosInformationCircle className="hover:text-gray-600 cursor-pointer" />
                </div>
            </div>
            <div className="relative h-[90%]  ">
                <div className="p-3 h-[530px] overflow-y-scroll ">
                    <div className="h-full">
                        {data.messages?.map((item, index) => (
                            <div className="" key={index} ref={index === data.messages.length - 1 ? lastMessageRef : null}>
                                {item.sender === user?._id ? (
                                    <div className="flex gap-3 items-center mb-3 justify-end">
                                        <p className="text-[10px] text-gray-500">{handleCompareDate(item.created_at)}</p>

                                        <div className="flex gap-2 items-center">
                                            <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-l-full rounded-t-full text-right">{item.text}</h1>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 items-center mb-3">
                                        <div className="w-[30px] h-[30px] overflow-hidden rounded-full relative">
                                            <Image
                                                src={user?._id === data?.participants[1]._id ? data?.participants[0].profilePicture : data?.participants[1].profilePicture}
                                                className="w-full h-full object-cover absolute "
                                                alt=""
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-r-full rounded-t-full ">{item.text}</h1>
                                            <p className="text-[10px] text-gray-500 ">{handleCompareDate(item.created_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {data.messages?.length === 0 && <div className="h-full flex items-center justify-center">Chưa có lịch sử nhắn tin...</div>}
                    </div>
                </div>
                {/* <div className="sticky bottom-0 w-full p-2">
                   
                </div> */}
                <div className="mt-3">
                    <form className="flex h-10" onSubmit={handleSendMess}>
                        <Button className="rounded-none text-orange-700 h-full">
                            <FaCirclePlus size={20} />
                        </Button>
                        <div className="border-[1px] w-full flex overflow-hidden h-full">
                            <Input placeholder="Aa" autoFocus className="rounded-none border-none focus:border-none h-full" value={input} onChange={(e) => setInput(e.target.value)}></Input>
                            <Popover
                                content={
                                    <div>
                                        <div className="">
                                            <Input placeholder="Search" value={searchEmoji} onChange={(e) => handleSearchEmoji(e)}></Input>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1 w-[300px]  mt-2">
                                            {dataEmoji && dataEmoji.length > 0 ? ( // Check if emoji exists and has elements
                                                <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                    {dataEmoji.map((item, index) => (
                                                        <div className="flex items-center justify-center hover:bg-gray-200 cursor-pointer" key={index}>
                                                            <h1 className="text-xl" onClick={() => setInput(input + item.character)}>
                                                                {item.character}
                                                            </h1>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>Lỗi không hiển thị được emoji</p> // Display a message if no data
                                            )}
                                        </div>
                                    </div>
                                }
                                title="Chọn icon"
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>
                                <Button className="rounded-none border-none h-full">
                                    <MdEmojiEmotions color="#ff9838" size={22} />
                                </Button>
                            </Popover>
                        </div>
                        <button className="rounded-none text-orange-700 h-full" type="submit">
                            <BiSolidSend size={20} />
                        </button>
                    </form>
                </div>
            </div>
            {!loading && (
                <div className="flex items-center justify-center h-[500px]">
                    <Spin />
                </div>
            )}
        </div>
    );
}
