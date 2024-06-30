import { Avatar, Button, Input } from "antd";
import React from "react";
import { IoIosSettings } from "react-icons/io";
import { UserOutlined } from "@ant-design/icons";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import { MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Chat(props) {
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
            <div className="border-t-[1px] my-3">
                {props.user?.map((item) => (
                    <Link key={item.id} to={`/chat/room/${item.id}`} className="flex gap-2 items-center hover:bg-gray-200 p-2 hover:cursor-pointer">
                        <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative">
                            <img src={item.anotherUser?.photoURL} className="w-full h-full rounded-full" alt="" />
                            <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                        </div>
                        <div className="">
                            <h1 className="font-bold">{item.anotherUser?.displayName}</h1>
                            <p className="text-gray-500">Chat now</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
