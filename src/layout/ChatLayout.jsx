import React, { useEffect, useState } from "react";
import Chat from "../pages/User/Chat";
import ChatRoom from "../pages/User/ChatRoom";
import { Outlet, useParams } from "react-router-dom";
import { auth, db } from "../pages/Auth/firebase";
import { get_firebase } from "../utils/request";
import { Spin } from "antd";

export default function ChatLayout() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const handleRenderUser = async () => {
            const querySnapshot = await get_firebase(db, "chat");
            setData(querySnapshot);
            setLoading(true);
        };

        handleRenderUser();
    }, []);
    console.log(data);
    return (
        <div className="flex bg-white border-gray-200 border-[1px] rounded-lg shadow-sm">
            <div className=" h-[83vh] w-[25%]  py-2 border-r-[1px] ">
                {loading ? (
                    <Chat user={data} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Spin />
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}
