import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import { MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../pages/Auth/firebase";

export default function ChatRoom() {
    const params = useParams();
    const [data, setData] = useState({});
    useEffect(() => {
        const chatRoom = onSnapshot(doc(db, "chat", params.id), (doc) => {
            console.log("Current data: ", doc.data());
            setData(doc.data());
        });
    }, []);
    return (
        <div className=" w-[75%] ">
            <div className=" border-b-[1px] flex justify-between items-center h-[10%]">
                <div className="flex gap-2 items-center p-2 ">
                    <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] relative">
                        <img src="https://greengarden.vn/wp-content/uploads/2023/12/hoa-hong2.jpg" className="w-full h-full rounded-full" alt="" />
                        <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                    </div>
                    <div className="">
                        <h1 className="font-bold">Duyên hêu</h1>
                        <p className="text-gray-500 text-sm">Đang hoạt động</p>
                    </div>
                </div>
                <div className="flex gap-3 text-2xl px-3 text-orange-700">
                    <IoIosCall className="hover:text-gray-600 cursor-pointer" />
                    <IoVideocam className="hover:text-gray-600 cursor-pointer" />
                    <IoIosInformationCircle className="hover:text-gray-600 cursor-pointer" />
                </div>
            </div>
            <div className="relative h-[90%]">
                <div className="p-3">
                    <div className="flex gap-3 items-center mb-3">
                        <div className="w-[30px] h-[30px] overflow-hidden rounded-full">
                            <img src="https://greengarden.vn/wp-content/uploads/2023/12/hoa-hong2.jpg" className="w-full h-full " alt="" />
                        </div>
                        <div className="flex gap-2 items-center">
                            <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-r-full rounded-t-full ">hello xin chào bạn? mình tên là adf</h1>
                            <p className="text-[10px] text-gray-500 ">1 min</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center mb-3 justify-end">
                        <p className="text-[10px] text-gray-500">1 min</p>

                        <div className="flex gap-2 items-center">
                            <h1 className="bg-gray-200 flex items-center px-6 py-1 rounded-l-full rounded-t-full text-right">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium i
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 w-full p-2">
                    <div className="flex items-center ">
                        <Button className="rounded-none text-orange-700">
                            <FaCirclePlus size={20} />
                        </Button>
                        <div className="border-[1px] w-full flex overflow-hidden">
                            <Input placeholder="Aa" className="rounded-none border-none focus:border-none"></Input>
                            <Button className="rounded-none border-none">
                                <MdEmojiEmotions color="#ff9838" size={22} />
                            </Button>
                        </div>
                        <Button className="rounded-none text-orange-700">
                            <BiSolidSend size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
