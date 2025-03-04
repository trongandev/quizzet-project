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
    const [messageApi, contextHolder] = message.useMessage();
    const { socket, onlineUsers } = useSocket();

    const [messages, setMessages] = useState<{ _id: string; [key: string]: any }[]>([]);
    const [sendMess, setSendMess] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const userId = user?._id;
    const [image, setImage] = useState(null);
    const [imageReview, setImageReview] = useState<string | null>(null);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [emoji, setEmoji] = useState<{ unicodeName: string }[]>([]);
    const [emojiData, setEmojiData] = useState<{ unicodeName: string }[]>([]);
    const [searchEmoji, setSearchEmoji] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [loadingIcon, setLoadingIcon] = useState(false);

    const fetchInitialMessages = useCallback(async () => {
        if (!token) return;
        const req = await GET_API_WITHOUT_COOKIE(`/chatcommu?skip=${skip}&limit=50`);
        if (req.ok) {
            const sortedMessages = req.messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            setMessages(sortedMessages);
            setHasMore(req?.hasMore);
            // setSkip(50);
        }
    }, [token, skip]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchEmojis = useCallback(async () => {
        try {
            const reqEmoji = await fetch("https://emoji-api.com/emojis?access_key=bf409e3ed3d59cc01d12b7f1a9512896fe36f4f1");
            const dataEmoji = await reqEmoji.json();
            setEmoji(dataEmoji);
            setEmojiData(dataEmoji);
        } catch (error) {
            console.error("Error fetching emojis:", error);
        }
    }, []);

    useEffect(() => {
        fetchInitialMessages();
        fetchEmojis();

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Optimized text handler
    const handleNewMessage = useCallback((text: { _id: string; [key: string]: any }) => {
        setMessages((prev) => [...prev, text]);
    }, []);

    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage: { _id: string; [key: string]: any }) => {
                setMessages((prev) => [...prev, newMessage]); // Sử dụng setMessages thay vì setChatState
            },
            handleUnsend: (messageId: string) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
            },
        }),
        []
    );

    console.log("rerender");

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessageCommu", messageHandlers.updateMessages);
        socket.on("replyUnsendMessageCommu", messageHandlers.handleUnsend);

        return () => {
            socket.off("newMessageCommu", messageHandlers.updateMessages);
            socket.off("replyUnsendMessageCommu", messageHandlers.handleUnsend);
        };
    }, [socket, messageHandlers]);

    // const loadMoreMessages = async () => {
    //     setLoading(true);
    //     setSkip((prevSkip) => prevSkip + 50);
    //     try {
    //         const newMessages = await GET_API(`/chatcommu?skip=${skip}&limit=50`, token); // Gọi API để tải tin nhắn
    //         setMessages((prevMessages) => [...newMessages.messages, ...prevMessages]);
    //         setHasMore(newMessages.length > 0);
    //     } catch (error) {
    //         messageApi.open({
    //             type: "error",
    //             content: error,
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSendMessage = useCallback(async () => {
        if (!inputRef.current?.value.trim() && !image) return;

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
            messageApi.error("Failed to send text", error);
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

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setImage(file);
        setImageReview(file ? URL.createObjectURL(file) : null);
    };

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: any) => {
        setOpen(newOpen);
    };

    const debouncedSearchEmoji = useCallback(
        debounce((searchTerm: any) => {
            const filteredData = emoji.filter((item) => item?.unicodeName.toLowerCase().includes(searchTerm.toLowerCase()));
            setEmojiData(filteredData);
        }, 300),
        [emoji]
    );

    const handleSearchEmoji = useCallback(
        (e: any) => {
            const searchTerm = e.target.value;
            setSearchEmoji(searchTerm);
            debouncedSearchEmoji(searchTerm);
        },
        [debouncedSearchEmoji]
    );

    const handleUnsend = async (messageId: string) => {
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

    const handleReactIcon = async (messageId: string, emoji: any) => {
        setLoadingIcon(true);
        if (!user) return;
        const req = await POST_API(`/chatcommu/react`, { messageId, userId: user._id, emoji }, "POST", token);
        if (req) {
            const res = await req.json();
            if (res.ok) {
                setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, reactions: res.reactions } : msg)));
            } else {
                messageApi.open({
                    type: "error",
                    content: res.text,
                });
            }
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

    const showModal = (messageId: any) => {
        setIsModalOpen(messageId);
    };

    const handleCancel = () => {
        setIsModalOpen(null);
    };

    const [isModalOpenEditMess, setIsModalOpenEditMess] = useState(null);
    const [editMess, setEditMess] = useState<{ _id?: string; message?: string }>({});

    const showModalEditMess = (messageId: any) => {
        setIsModalOpenEditMess(messageId);
    };

    const handleOkEditMess = async () => {
        if (!editMess.message) return;
        const newMess = { messageId: editMess._id, userId: user?._id, newMessage: editMess.message };
        setLoading(true);
        const req = await POST_API(`/chatcommu/editmess`, newMess, "PUT", token);
        if (req) {
            const res = await req.json();
            if (res.ok) {
                setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === editMess._id ? { ...msg, message: editMess.message, isEdit: true } : msg)));
            } else {
                messageApi.open({
                    type: "error",
                    content: res.message,
                });
            }
        }
        handleCancelEditMess();
        setLoading(false);
        setEditMess({});
    };

    const handleCancelEditMess = () => {
        setIsModalOpenEditMess(null);
    };

    const handleEditMess = async (msg: any) => {
        setEditMess(msg);
        showModalEditMess(msg._id);
    };
    const inputRef = useRef<HTMLInputElement | null>(null);
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

    const handleSetDefaultImage = () => {
        setImage(null);
        setImageReview(null);
    };

    if (!messages.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="text-third dark:text-white flex gap-5 flex-wrap px-3 md:px-0 min-h-[85vh]">
            {contextHolder}

            <div className=" w-full md:w-[700px] p-3 md:p-5  border border-primary  rounded-md">
                <MessageList
                    messages={messages}
                    lastMessageRef={lastMessageRef}
                    setReplyingTo={setReplyingTo}
                    handleReactIcon={handleReactIcon}
                    user={user}
                    token={token}
                    isModalOpen={isModalOpen}
                    reactIconList={reactIconList}
                    loadingIcon={loadingIcon}
                    emoji={emojiData}
                    onReply={(id: any) => setReplyingTo(id)}
                    onModalOpen={showModal}
                    onOpenChange={handleOpenChange}
                    onModalCancel={handleCancel}
                    handleUnsend={handleUnsend}
                    loading={loading}
                    handleEditMess={handleEditMess}
                    isModalOpenEditMess={isModalOpenEditMess}
                    handleOkEditMess={handleOkEditMess}
                    setEditMess={setEditMess}
                    handleCancelEditMess={handleCancelEditMess}
                    showModalEditMess={showModalEditMess}
                    editMess={editMess}
                    onEdit={handleEditMess}
                    onModalOk={handleOkEditMess}
                    onModalOpenEditMess={showModalEditMess}
                />
                <ChatArea
                    user={user}
                    setReplyingTo={setReplyingTo}
                    handleOpenChange={handleOpenChange}
                    inputRef={inputRef}
                    handleMessageChange={handleMessageChange}
                    handleSendMessage={handleSendMessage}
                    // image={image}
                    imageReview={imageReview}
                    handleImageChange={handleImageChange}
                    handleSetDefaultImage={handleSetDefaultImage}
                    handleKeyPress={handleKeyPress}
                    handlePaste={handlePaste}
                    open={open}
                    emojiData={emojiData}
                    searchEmoji={searchEmoji}
                    handleSearchEmoji={handleSearchEmoji}
                    replyingTo={replyingTo}
                    newMessage={newMessage}
                    loading={loading}
                    onEmojiSelect={(emoji: any) => {
                        if (inputRef.current) {
                            inputRef.current.value += emoji;
                        }
                    }}
                />
            </div>
            <OnlineUsers onlineUsers={onlineUsers} />
        </div>
    );
}
