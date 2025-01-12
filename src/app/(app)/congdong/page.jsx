"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import Image from "next/image";
import { Dropdown, Image as Images, message, Modal, Spin, Tooltip } from "antd";

import Link from "next/link";
import { GrFormClose } from "react-icons/gr";
import { MdEdit, MdOutlineInsertEmoticon, MdOutlineReply } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { Popover } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaRegImage } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { TbSendOff } from "react-icons/tb";
import handleCompareDate from "@/lib/CompareDate";

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export default function CongDong() {
    const [messages, setMessages] = useState([]);
    const [sendMess, setSendMess] = useState(false);
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
    const [loadingIcon, setLoadingIcon] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token);
            if (req.ok) {
                const sort = req.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setMessages(sort);
                setHasMore(req?.hasMore);
                // setSkip(50);
            }
        };
        fetchAPI();
    }, []);
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // useEffect(() => {
    //     if (sendMess) {
    //         if (lastMessageRef.current) {
    //             lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    //         }
    //         setSendMess(false);
    //     }
    // }, [sendMess, messages]);

    useEffect(() => {
        setTimeout(async () => {
            const reqEmoji = await fetch("https://emoji-api.com/emojis?access_key=bf409e3ed3d59cc01d12b7f1a9512896fe36f4f1");
            const dataEmoji = await reqEmoji.json();

            setEmoji(dataEmoji);
            setEmojiData(dataEmoji);
        }, 3000);
    }, [messages]);

    // Optimized text handler
    const handleNewMessage = useCallback((text) => {
        setMessages((prev) => [...prev, text]);
    }, []);

    const handleUnsendMessage = useCallback((messageId) => {
        setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessageCommu", handleNewMessage);
        socket.on("replyUnsendMessageCommu", handleUnsendMessage);

        return () => {
            socket.emit("userDisconnect", userId);
            socket.off("newMessageCommu", handleNewMessage);
            socket.off("replyUnsendMessageCommu", handleUnsendMessage);
        };
    }, [socket, userId, handleNewMessage]);

    const loadMoreMessages = async () => {
        setLoading(true);
        setSkip((prevSkip) => prevSkip + 50);
        try {
            const newMessages = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token); // Gọi API để tải tin nhắn
            setMessages((prevMessages) => [...newMessages.messages, ...prevMessages]);
            setHasMore(newMessages.length > 0);
        } catch (error) {
            messageApi.open({
                type: "error",
                content: error,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() && !image) return;

        setLoading(true);
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
                message: newMessage,
                image: imageUrl,
                token,
                replyTo: replyingTo,
            };
            socket.emit("sendMessageCommu", messageData);

            setNewMessage("");
            setImage(null);
            setImageReview(null);
            setReplyingTo(null);
            setSendMess(true);
        } catch (error) {
            messageApi.error("Failed to send text", error);
        } finally {
            setLoading(false);
        }
    }, [newMessage, image, user, token, replyingTo, socket, messageApi]);

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

    const debouncedSearchEmoji = useCallback(
        debounce((searchTerm) => {
            const filteredData = emoji.filter((item) => item.unicodeName.toLowerCase().includes(searchTerm.toLowerCase()));
            setEmojiData(filteredData);
        }, 300),
        [emoji]
    );

    const handleSearchEmoji = useCallback(
        (e) => {
            const searchTerm = e.target.value;
            setSearchEmoji(searchTerm);
            debouncedSearchEmoji(searchTerm);
        },
        [debouncedSearchEmoji]
    );

    const handleUnsend = async (messageId) => {
        setLoading(true);
        socket.emit("unsendMessageCommu", { messageId, userId: user?._id, token });
        // const req = await POST_API(`/chatcommu/unsend`, { messageId, userId: user._id }, "POST", token);
        // const res = await req.json();
        // if (res.ok) {
        //     setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
        //     messageApi.open({
        //         type: "success",
        //         content: res.text,
        //     });
        // } else {
        //     messageApi.open({
        //         type: "error",
        //         content: res.text,
        //     });
        // }
        setLoading(false);
    };

    const handleReactIcon = async (messageId, emoji) => {
        setLoadingIcon(true);
        const req = await POST_API(`/chatcommu/react`, { messageId, userId: user._id, emoji }, "POST", token);
        const res = await req.json();
        if (res.ok) {
            setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, reactions: res.reactions } : msg)));
        } else {
            messageApi.open({
                type: "error",
                content: res.text,
            });
        }
        setLoadingIcon(false);
    };

    const reactIconList = useMemo(
        () => [
            "https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png",
            "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png",
            "https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png",
            "https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png",
            "https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png",
            "https://static.xx.fbcdn.net/images/emoji.php/v9/t47/1/32/1f621.png",
        ],
        []
    );

    const [isModalOpen, setIsModalOpen] = useState(null);

    const showModal = (messageId) => {
        setIsModalOpen(messageId);
    };

    const handleCancel = () => {
        setIsModalOpen(null);
    };

    const [isModalOpenEditMess, setIsModalOpenEditMess] = useState(null);
    const [editMess, setEditMess] = useState({});

    const showModalEditMess = (messageId) => {
        setIsModalOpenEditMess(messageId);
    };

    const handleOkEditMess = async () => {
        if (!editMess.message) return;
        const newMess = { messageId: editMess._id, userId: user._id, newMessage: editMess.message };
        setLoading(true);
        const req = await POST_API(`/chatcommu/editmess`, newMess, "PUT", token);
        const res = await req.json();
        if (res.ok) {
            setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === editMess._id ? { ...msg, message: editMess.message, isEdit: true } : msg)));
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        handleCancelEditMess();
        setLoading(false);
        setEditMess({});
    };

    const handleCancelEditMess = () => {
        setIsModalOpenEditMess(null);
    };

    const handleEditMess = async (msg) => {
        setEditMess(msg);
        showModalEditMess(msg._id);
    };

    if (!messages.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="text-third flex gap-5 flex-wrap px-3 md:px-0 min-h-[85vh]">
            {contextHolder}

            <div className=" w-full md:w-[700px] p-3 md:p-5  border border-primary  rounded-md">
                <div className="h-[550px] overflow-y-scroll flex flex-col pr-3 scroll-smooth">
                    {!loading && hasMore && (
                        <button onClick={loadMoreMessages} className="mb-5 btn btn-primary">
                            Load More Messages
                        </button>
                    )}
                    {messages &&
                        messages?.map((msg, index) => {
                            const isSameUser = index > 0 && messages[index - 1]?.userId?._id === msg?.userId?._id;
                            const isCurrentUser = msg?.userId?._id === user?._id;
                            const isLastMessage = index === messages?.length - 1;

                            return (
                                <div key={index} ref={isLastMessage ? lastMessageRef : null}>
                                    {/* Hiển thị tên người dùng trên đầu nhóm */}
                                    {!isSameUser && !isCurrentUser && <p className="ml-[45px] text-gray-500 text-sm mb-1 pl-1">{msg?.userId?.displayName}</p>}

                                    {/* Tin nhắn */}
                                    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"} mb-[4px] group min-h-[40px] items-center`}>
                                        {/* Avatar của người khác */}
                                        {!isCurrentUser && !isSameUser && (
                                            <Link href={`/profile/${msg?.userId?._id}`} className="w-[40px] h-[40px] relative mr-[-40px]">
                                                <Image
                                                    src={msg?.userId?.profilePicture || "/meme.jpg"}
                                                    alt=""
                                                    unoptimized
                                                    className="w-full h-full object-cover absolute border-2 border-primary rounded-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </Link>
                                        )}

                                        {/* Nội dung tin nhắn */}
                                        <div className={`flex items-center w-full gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                                            <div className={`max-w-[60%]  ${isCurrentUser ? "" : "ml-[45px]"}`}>
                                                {msg?.replyTo && (
                                                    <div className="text-[12px]">
                                                        {isCurrentUser ? (
                                                            <div className="">
                                                                <p className="flex items-center gap-1">
                                                                    <MdOutlineReply />
                                                                    Bạn đã trả lời {msg?.replyTo?.userId?._id == userId ? "chính bạn" : ":" + msg?.replyTo?.userId?.displayName}
                                                                </p>

                                                                {msg?.replyTo?.image && (
                                                                    <Link href={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-end`}>
                                                                        <Image alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="">
                                                                <p className="flex items-center gap-1">
                                                                    <MdOutlineReply />
                                                                    {msg?.userId?.displayName} đã trả lời bạn
                                                                </p>
                                                                {msg?.replyTo?.image && (
                                                                    <Link href={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-start`}>
                                                                        <Image alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg?.replyTo?.text !== "" && (
                                                            <Link href={`#${msg?.replyTo._id}`} className={`block ${isCurrentUser ? "w-full text-end" : ""}`}>
                                                                <p className={` inline-block bg-gray-400 rounded-lg px-3 py-2 mb-[-10px] line-clamp-2`}>
                                                                    {msg?.replyTo?.unsend ? "Tin nhắn đã bị gỡ" : msg?.replyTo?.message}
                                                                </p>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                                {msg?.isEdit && <span className={`text-xs text-gray-600 ${isCurrentUser ? "text-end mr-5" : "text-start ml-5"} block `}>Đã chỉnh sửa</span>}
                                                <div className={` ${isCurrentUser ? "w-full text-end" : ""} `} id={msg?._id}>
                                                    {msg?.message && (
                                                        <p
                                                            className={`max-w-[350px] ${isCurrentUser ? " bg-primary text-white" : "bg-gray-200 "} ${
                                                                msg?.unsend ? "!bg-white border border-primary !text-primary text-[12px]" : ""
                                                            } rounded-lg px-3 py-2 inline-block`}>
                                                            {msg?.unsend ? "Tin nhắn đã bị gỡ" : msg?.message}
                                                        </p>
                                                    )}

                                                    {!msg?.unsend && msg?.reactions && msg?.reactions?.length != 0 && (
                                                        <div className={`mt-[-10px] relative z-2 h-[20px] flex ${isCurrentUser ? "justify-end mr-1" : "ml-1"}`} onClick={() => showModal(msg._id)}>
                                                            {msg?.reactions?.map((react, index) => (
                                                                <div className="flex bg-linear-item-2 rounded-full items-center px-[3px] cursor-pointer " key={index}>
                                                                    <Image src={react.emoji} alt="" width={15} height={15} className="" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* <Modal title="Tin nhắn cảm xúc" open={isModalOpen === msg?._id} footer={[]} onCancel={handleCancel}>
                                                        {msg?.reactions && (
                                                            <div className="">
                                                                <div className="flex border rounded-full items-center h-[54px]">
                                                                    <div className="flex-1 text-center text-lg text-primary">Tất cả: {msg?.reactions?.length}</div>
                                                                    <div className="w-[1px] h-full bg-gray-100"></div>
                                                                    <div className="flex-1 text-center flex gap-1 justify-center">
                                                                        {msg?.reactions?.length > 0 && (
                                                                            <div className="flex items-center gap-2">
                                                                                {Object.entries(
                                                                                    msg.reactions.reduce((acc, react) => {
                                                                                        acc[react.emoji] = (acc[react.emoji] || 0) + 1;
                                                                                        return acc;
                                                                                    }, {})
                                                                                ).map(([emoji, count]) => (
                                                                                    <div className="flex items-center gap-1" key={emoji}>
                                                                                        <Image src={emoji} alt="Reaction" width={20} height={20} />
                                                                                        <span className="text-sm font-medium">{count}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3">
                                                                    {msg?.reactions?.map((react, index) => (
                                                                        <Link
                                                                            href={`/profile/${react?.userId?._id}`}
                                                                            className="flex items-center justify-between hover:bg-gray-200 cursor-pointer px-3 py-2 rounded-md"
                                                                            key={index}>
                                                                            <div className="flex gap-3 items-center">
                                                                                <div className="w-[40px] h-[40px] relative">
                                                                                    <Image src={react?.userId?.profilePicture} alt="Reaction" fill className="rounded-full object-cover absolute" />
                                                                                </div>
                                                                                <div className="">
                                                                                    <p className="text-md font-medium">{react?.userId?.displayName}</p>
                                                                                    <span className="text-sm">Bấm vào để xem profile</span>
                                                                                </div>
                                                                            </div>
                                                                            <Image src={react.emoji} alt="Reaction" width={20} height={20} />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Modal> */}
                                                </div>
                                                {!msg?.unsend && msg?.image && <Images src={msg?.image || "/meme.jpg"} alt="" width={200} height="auto" className="object-cover rounded-lg mt-2" />}
                                            </div>
                                            {token && (
                                                <div className={`hidden group-hover:block `}>
                                                    <div className={`flex gap-2 `}>
                                                        {!msg?.unsend && (
                                                            <Tooltip placement="top" title="Trả lời">
                                                                <label
                                                                    htmlFor="text"
                                                                    className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary"
                                                                    onClick={() => setReplyingTo(msg)}>
                                                                    <MdOutlineReply />
                                                                </label>
                                                            </Tooltip>
                                                        )}
                                                        {isCurrentUser && !msg?.unsend && (
                                                            <Tooltip placement="top" title="Thu hồi">
                                                                <div
                                                                    className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary"
                                                                    onClick={() => handleUnsend(msg?._id)}>
                                                                    {loading ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : <TbSendOff />}
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                        {!msg?.unsend && (
                                                            <Dropdown
                                                                overlay={
                                                                    <div className="flex items-center bg-linear-item-2 rounded-full h-[40px] ">
                                                                        {reactIconList.map((icon, index) => (
                                                                            <div
                                                                                className=" hover:bg-gray-400 rounded-full cursor-pointer w-[40px] h-[40px] flex items-center justify-center "
                                                                                key={index}>
                                                                                {loadingIcon ? (
                                                                                    <Spin indicator={<LoadingOutlined spin />} size="default" />
                                                                                ) : (
                                                                                    <Image src={icon} width={25} height={25} alt="" onClick={() => handleReactIcon(msg._id, icon)} />
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                }
                                                                trigger={["click"]}
                                                                placement="top">
                                                                <div className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary">
                                                                    <MdOutlineInsertEmoticon />
                                                                </div>
                                                            </Dropdown>
                                                        )}
                                                        {isCurrentUser && !msg?.unsend && (
                                                            <Tooltip placement="top" title="Chỉnh sửa">
                                                                <div className=" h-full text-white cursor-pointer bg-gray-400 p-2 rounded-full hover:bg-secondary" onClick={() => handleEditMess(msg)}>
                                                                    <MdEdit />
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                        <Modal
                                                            title="Chỉnh sửa tin nhắn"
                                                            open={isModalOpenEditMess === msg?._id}
                                                            onOk={handleOkEditMess}
                                                            onCancel={handleCancelEditMess}
                                                            confirmLoading={loading}>
                                                            <input
                                                                type="text"
                                                                placeholder="Nhập thông tin bạn muốn sửa"
                                                                value={editMess?.message}
                                                                onChange={(e) => setEditMess({ ...editMess, message: e.target.value })}
                                                            />
                                                        </Modal>
                                                    </div>
                                                </div>
                                            )}

                                            {isSameUser && <p className="text-gray-500 text-xs ">{msg?.timestamp && handleCompareDate(msg?.timestamp)}</p>}
                                        </div>
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
                                <label htmlFor="text" className="block replying-to relative bg-linear-item-blue px-3 py-1 rounded-lg mb-2 text-secondary ">
                                    <div className="absolute top-2 right-3 cursor-pointer hover:text-red-500" onClick={() => setReplyingTo(null)}>
                                        <IoMdClose />
                                    </div>
                                    <h1 className="text-secondary font-bold">Bạn đang trả lời{replyingTo?.userId?._id == userId ? " chính bạn" : ": " + replyingTo?.userId.displayName}</h1>
                                    <p className="line-clamp-2">{replyingTo?.message}</p>
                                    {replyingTo?.image && <Image src={replyingTo?.image} alt="" width={120} height={100} className="object-cover rounded-lg mt-2" />}
                                </label>
                            )}
                            <div className="flex gap-1">
                                <label htmlFor="image" className=" bg-primary px-3  rounded-md flex items-center justify-center text-white ">
                                    <FaRegImage />{" "}
                                </label>
                                <input id="image" type="file" className="hidden" onChange={(e) => handleImageChange(e)} />
                                <input
                                    type="text"
                                    id="text"
                                    className=""
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
                                            {emojiData && emojiData?.length == 0 && <p className="h-[300px] flex items-center justify-center">Không tìm thấy Emojii này...</p>}
                                        </div>
                                    }
                                    title="Chọn icon"
                                    trigger="click"
                                    open={open}
                                    onOpenChange={handleOpenChange}>
                                    <button className="btn btn-primary !rounded-md">
                                        <MdOutlineInsertEmoticon size={20} />
                                    </button>
                                </Popover>
                                <button type="submit" disabled={loading} onClick={handleSendMessage} className="btn btn-primary !rounded-md">
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
            <div className="flex-1 h-full">
                <h3>Các thành viên đang online: {onlineUsers?.length}</h3>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 mt-2 max-h-[180px] md:max-h-[85vh] overflow-y-scroll">
                    {onlineUsers?.map((onl_user) => (
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
                            <p className="text-sm group-hover:underline  mt-1 line-clamp-1" title={onl_user?.displayName || "Guest"}>
                                {onl_user?.displayName || "Guest"}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
