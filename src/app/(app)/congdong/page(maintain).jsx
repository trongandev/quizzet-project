"use client";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer } from "react";
import Cookies from "js-cookie";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { message, Spin } from "antd";

import axios from "axios";

import MessageList from "./MessageList";
import ChatArea from "./ChatArea";
import OnlineUsers from "./OnlineUsers";
import { chatReducer, initialChatState } from "../../../reducers/chatReducer";

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
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const { socket, onlineUsers } = useSocket();
    const { user } = useUser();
    const token = Cookies.get("token");
    const lastMessageRef = useRef(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchInitialMessages = useCallback(async () => {
        if (!token) return;
        const req = await GET_API(`/chatcommu?skip=${state.skip}&limit=50`, token);
        if (req.ok) {
            const sortedMessages = req.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            dispatch({ type: "SET_MESSAGES", payload: sortedMessages });
        }
    }, [token, state.skip]);

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
    const handleNewMessage = useCallback((text) => {
        setMessages((prev) => [...prev, text]);
    }, []);

    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage) => {
                setChatState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, newMessage],
                }));
            },
            handleUnsend: (messageId) => {
                setChatState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)),
                }));
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
                message: state.newMessage,
                image: imageUrl,
                token,
                replyTo: state.replyingTo,
            };
            socket.emit("sendMessageCommu", messageData);
            dispatch({ type: "RESET_MESSAGE_STATE" });
        } catch (error) {
            messageApi.error("Failed to send text", error);
        } finally {
            setLoading(false);
        }
    }, [state.newMessage, state.image, user, token, state.replyingTo, socket]);

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

    const handleMessageChange = useCallback((e) => {
        setNewMessage(e.target.value);
    }, []);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

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
                <MessageList
                    messages={state.messages}
                    onReply={(id) =>
                        dispatch({
                            type: "SET_REPLYING_TO",
                            payload: id,
                        })
                    }
                    onUnsend={handleUnsend}
                    onReact={handleReactIcon}
                />
                <ChatArea
                    message={state.newMessage}
                    onMessageChange={(e) =>
                        dispatch({
                            type: "SET_NEW_MESSAGE",
                            payload: e.target.value,
                        })
                    }
                    onSend={handleSendMessage}
                    image={state.image}
                    imagePreview={state.imageReview}
                    onImageChange={handleImageChange}
                />
            </div>
            <OnlineUsers onlineUsers={onlineUsers} />
        </div>
    );
}
