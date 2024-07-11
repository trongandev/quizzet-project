import { Button, Input, Popover, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import { MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../pages/Auth/firebase";
import Swal from "sweetalert2";
import { format, isMonday, isToday } from "date-fns";
import { is } from "date-fns/locale";

export default function ChatRoom() {
    const params = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const chatRoom = onSnapshot(doc(db, "chat", params.id), (doc) => {
            setData(doc.data());
            setLoading(true);
        });
    }, []);

    const [input, setInput] = useState("");

    const addMessageToChatRoom = async (roomId, message) => {
        try {
            const roomRef = doc(db, "chat", roomId);
            await updateDoc(roomRef, {
                chat: arrayUnion({
                    message: message,
                    image: auth.currentUser.photoURL,
                    create_at: format(new Date(), " HH:mm:ss yyyy-MM-dd"),
                    sender: auth.currentUser.uid,
                }),
            });
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi trong quá trình gửi tin nhắn\n" + error.message,
                icon: "error",
            });
        }
    };

    const formatDate = (date) => {
        const formattedTime = format(date, " hh:mma"); // Định dạng thời gian thành 'hh:mma'
        if (isToday(date)) {
            return `Today at ${formattedTime}`;
        } else {
            // Định dạng khác nếu không phải hôm nay, ví dụ: 'MM/dd/yyyy at hh:mma'
            return format(date, "MM/dd/yyyy at hh:mma");
        }
    };

    const handleSendMess = (e) => {
        e.preventDefault();
        if (input === "") return;
        addMessageToChatRoom(params.id, input);
        setInput("");
    };

    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const [emoji, setEmoji] = useState({});

    useEffect(() => {
        fetch("https://emoji-api.com/emojis?access_key=bf409e3ed3d59cc01d12b7f1a9512896fe36f4f1")
            .then((res) => res.json())
            .then((data) => {
                setEmoji(data);
            });
    }, []);

    return (
        <div className=" w-[75%] ">
            {loading ? (
                <>
                    <div className=" border-b-[1px] flex justify-between items-center h-[10%]">
                        <div className="flex gap-2 items-center p-2 ">
                            <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] relative">
                                <img
                                    src={auth.currentUser?.uid === data.currentUser?.uid ? data.anotherUser?.photoURL : data.currentUser?.photoURL}
                                    className="w-full h-full rounded-full object-cover"
                                    alt=""
                                />
                                <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                            </div>
                            <div className="">
                                <h1 className="font-bold">{auth.currentUser?.uid === data.currentUser?.uid ? data.anotherUser?.displayName : data.currentUser?.displayName || "Chưa đặt tên"}</h1>
                                <p className="text-gray-500 text-sm">Đang hoạt động</p>
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
                            <div className="">
                                {data.chat?.map((item, index) => (
                                    <div className="" key={item.sender + index}>
                                        {item.sender === auth.currentUser.uid ? (
                                            <div className="flex gap-3 items-center mb-3 justify-end">
                                                <p className="text-[10px] text-gray-500">{formatDate(item.create_at)}</p>

                                                <div className="flex gap-2 items-center">
                                                    <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-l-full rounded-t-full text-right">{item.message}</h1>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3 items-center mb-3">
                                                <div className="w-[30px] h-[30px] overflow-hidden rounded-full">
                                                    <img src={item.image} className="w-full h-full object-cover " alt="" />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-r-full rounded-t-full ">{item.message}</h1>
                                                    <p className="text-[10px] text-gray-500 ">{formatDate(item.create_at)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sticky bottom-0 w-full p-2">
                            <form className="flex items-center " onSubmit={handleSendMess}>
                                <Button className="rounded-none text-orange-700">
                                    <FaCirclePlus size={20} />
                                </Button>
                                <div className="border-[1px] w-full flex overflow-hidden">
                                    <Input placeholder="Aa" className="rounded-none border-none focus:border-none" value={input} onChange={(e) => setInput(e.target.value)}></Input>
                                    <Popover
                                        content={
                                            <div>
                                                <div className="">
                                                    <Input placeholder="Search"></Input>
                                                </div>
                                                <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                    {emoji && emoji.length > 0 ? ( // Check if emoji exists and has elements
                                                        <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                            {emoji.map((item, index) => (
                                                                <div className="flex items-center justify-center hover:bg-gray-200 cursor-pointer" key={index}>
                                                                    <h1 className="text-xl" onClick={(e) => setInput(input + item.character)}>
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
                                        <Button className="rounded-none border-none">
                                            <MdEmojiEmotions color="#ff9838" size={22} />
                                        </Button>
                                    </Popover>
                                </div>
                                <Button className="rounded-none text-orange-700" onClick={(e) => handleSendMess(e)}>
                                    <BiSolidSend size={20} />
                                </Button>
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <Spin />
                </div>
            )}
        </div>
    );
}
