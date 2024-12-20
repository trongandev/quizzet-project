"use client";
import { Button, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import Image from "next/image";
import { useSocket } from "@/context/socketContext";
import handleCompareDate from "@/lib/CompareDate";
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

export default function Chat() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null);
    const [input, setInput] = useState("a");
    const debouncedSearchTerm = useDebounce(input, 300);
    const router = useRouter();
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        const handleRenderUser = async () => {
            setLoading(true);
            const req = await GET_API("/chat", token);
            if (req.ok) {
                setProfile(req.chats);
            }
            setLoading(false);
        };
        if (token === undefined) {
            messageApi.open({
                type: "error",
                content: "Vui lòng đăng nhập để nhắn tin",
            });
        } else {
            handleRenderUser();
        }
    }, []);
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/profile/findbyname/${input}`, token);
            if (req.ok) setSearch(req.users);
            else message.error(req.message);
            setLoading(false);
        };
        if (debouncedSearchTerm) {
            fetchAPI();
        }
    }, [debouncedSearchTerm]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const { user } = useUser();
    const handleCreateAndCheckRoomChat = async (id_another_user) => {
        const req = await GET_API(`/chat/check/${id_another_user}`, token);
        if (req.ok && req.exists) {
            // Phòng chat đã tồn tại, điều hướng đến phòng chat
            router.push(`/chat/${req.chatId}`);
        } else if (req.ok && !req.exists) {
            // Phòng chat chưa tồn tại, tạo mới
            const createReq = await POST_API(
                "/chat/create-chat",
                {
                    participants: [user._id, id_another_user],
                },
                "POST",
                token
            );
            const reqData = await createReq.json();
            if (reqData.ok) {
                router.push(`/chat/${reqData.chat}`);
            } else {
                messageApi.open({
                    type: "error",
                    content: reqData.message,
                });
            }
        } else {
            messageApi.open({
                type: "error",
                content: reqData.message,
            });
        }
        setIsModalOpen(false);
    };

    const handleChangeInput = async (e) => {
        setInput(e.target.value);
        setLoading(true);
    };

    const { onlineUsers } = useSocket();

    const getUserOnlineStatus = (userId) => {
        const onlineUser = onlineUsers.find((user) => user.userId === userId);
        return onlineUser ? "bg-green-600" : "bg-gray-400";
    };

    const checkIdUser = (item) => {
        if (user?._id === item?.participants[1]._id) {
            return item?.participants[0]._id;
        }
        return item?.participants[1]._id;
    };

    return (
        <div className="">
            {contextHolder}
            <div className="flex justify-between items-center px-3 h-[44px]">
                <Link href="/chat">
                    <h1 className="text-2xl">Chats</h1>
                </Link>
                <Button className="">
                    <IoIosSettings />
                </Button>
            </div>
            <div className="border-t-[1px] my-3 h-[530px] overflow-y-scroll">
                {profile &&
                    profile?.map((item) => (
                        <Link key={item.id} href={`/chat/${item._id}`} className="flex gap-2 items-center hover:bg-gray-200 p-2 hover:cursor-pointer">
                            <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative">
                                <Image
                                    src={user?._id === item?.participants[1]._id ? item?.participants[0].profilePicture : item?.participants[1].profilePicture}
                                    className="w-full h-full rounded-full object-cover absolute"
                                    fill
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className={`absolute w-3 h-3 rounded-full ${getUserOnlineStatus(checkIdUser(item))} bottom-[-2px] right-1`}></div>
                            </div>
                            <div className="">
                                <h1 className="font-bold">{user?._id === item?.participants[1]._id ? item?.participants[0].displayName : item?.participants[1].displayName}</h1>
                                <p className="text-gray-500">
                                    {item?.last_message || "Chat ngay"} | {handleCompareDate(item.last_message_date)}
                                </p>
                            </div>
                        </Link>
                    ))}
            </div>
            <div className="px-3 text-right">
                <Button className="" onClick={showModal}>
                    <FaCirclePlus />
                </Button>
                <Modal footer={[]} title="Tìm bạn bè mới" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div className="">
                        <Input value={input} autoFocus placeholder="Tìm kiếm bạn bè mới của bạn..." onChange={(e) => handleChangeInput(e)}></Input>
                    </div>
                    <div className="py-3 flex flex-col gap-3 h-[500px] overflow-y-scroll pr-3">
                        {!loading &&
                            search &&
                            search.map((item) => (
                                <div className="flex gap-3 items-center justify-between" key={item._id}>
                                    <label htmlFor={item._id} className="block w-[85%]">
                                        <div className="flex gap-3 items-center ">
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] relative">
                                                <Image
                                                    src={item.profilePicture}
                                                    className="w-full h-full rounded-full object-cover absolute"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    alt=""
                                                />
                                                <div className={`absolute w-3 h-3   ${getUserOnlineStatus(item._id)} rounded-full bottom-[-2px] right-0`}></div>
                                            </div>
                                            <Link href={`/profile/${item._id}`}>
                                                <h1 className="hover:underline hover:cursor-pointer">{item.displayName}</h1>
                                            </Link>
                                        </div>
                                    </label>
                                    <div className="">
                                        <Button onClick={() => handleCreateAndCheckRoomChat(item._id)}>Nhắn tin ngay</Button>
                                    </div>
                                </div>
                            ))}
                        {input !== "" && loading && (
                            <div className="flex items-center justify-center w-full mt-3">
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </div>
                        )}

                        {!loading && search && search.length === 0 && input !== "" && <p>Không tìm thấy kết quả nào...</p>}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
