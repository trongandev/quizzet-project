import { Button, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
// import { UserOutlined } from "@ant-design/icons";
// import { IoIosCall } from "react-icons/io";
// import { IoVideocam } from "react-icons/io5";
// import { IoIosInformationCircle } from "react-icons/io";
// import { BiSolidSend } from "react-icons/bi";
// import { MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { get_api, post_api } from "../../services/fetchapi";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
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
    const [input, setInput] = useState(null);
    const debouncedSearchTerm = useDebounce(input, 300);

    useEffect(() => {
        const handleRenderUser = async () => {
            setLoading(true);
            const req = await get_api("/chat");
            if (req.ok) {
                setProfile(req.chats);
            }
            setLoading(false);
        };
        const token = Cookies.get("token");
        if (token === undefined) {
            Swal.fire({
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập để nhắn tin",
                icon: "warning",
                didClose: () => {
                    navigate("/login");
                },
            });
        } else {
            handleRenderUser();
        }
    }, []);

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await get_api(`/profile/findbyname/${input}`);
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
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const handleCreateAndCheckRoomChat = async (id_another_user) => {
        const req = await get_api(`/chat/check/${id_another_user}`);
        if (req.ok && req.exists) {
            // Phòng chat đã tồn tại, điều hướng đến phòng chat
            navigate(`/chat/room/${req.chatId}`);
        } else if (req.ok && !req.exists) {
            // Phòng chat chưa tồn tại, tạo mới
            const createReq = await post_api(
                "/chat/create-chat",
                {
                    participants: [user._id, id_another_user],
                },
                "POST"
            );
            const reqData = await createReq.json();
            if (reqData.ok) {
                navigate(`/chat/room/${reqData.chat}`);
            } else {
                console.log(reqData.message);
            }
        } else {
            console.log(req.message);
        }
        setIsModalOpen(false);
    };

    const handleChangeInput = async (e) => {
        setInput(e.target.value);
        setLoading(true);
    };

    return (
        <div className="">
            <div className="flex justify-between items-center px-3 h-[44px]">
                <Link to="/chat">
                    <h1 className="text-2xl">Chats</h1>
                </Link>
                <Button className="">
                    <IoIosSettings />
                </Button>
            </div>
            <div className="border-t-[1px] my-3 h-[530px] overflow-y-scroll">
                {profile &&
                    profile?.map((item) => (
                        <Link key={item.id} to={`/chat/room/${item._id}`} className="flex gap-2 items-center hover:bg-gray-200 p-2 hover:cursor-pointer">
                            <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative">
                                <img
                                    src={user._id === item.participants[1]._id ? item.participants[0].profilePicture : item.participants[1].profilePicture}
                                    className="w-full h-full rounded-full object-cover"
                                    alt=""
                                />
                                <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                            </div>
                            <div className="">
                                <h1 className="font-bold">{user._id === item.participants[1]._id ? item.participants[0].displayName : item.participants[1].displayName}</h1>
                                <p className="text-gray-500">Chat now</p>
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
                    <div className="py-3 flex flex-col gap-3">
                        {!loading &&
                            search &&
                            search.map((item) => (
                                <div className="flex gap-3 items-center justify-between" key={item._id}>
                                    <label htmlFor={item._id} className="block w-[85%]">
                                        <div className="flex gap-3 items-center ">
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] relative">
                                                <img src={item.profilePicture} className="w-full h-full rounded-full object-cover" alt="" />
                                                <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                                            </div>
                                            <Link to={`/profile/${item._id}`}>
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
