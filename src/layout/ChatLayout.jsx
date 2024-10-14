import React, { useEffect, useState } from "react";
import Chat from "../pages/User/Chat";
// import ChatRoom from "../pages/User/ChatRoom";
import { Outlet, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { get_api } from "../services/fetchapi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
const Cookies = require("js-cookie");
export default function ChatLayout() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const handleRenderUser = async () => {
            setLoading(true);
            const req = await get_api("/chat");
            setLoading(false);
            setData(req);
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
    return (
        <div className="flex bg-white border-gray-200 border-[1px] rounded-lg shadow-sm ">
            <div className=" h-[83vh] w-[25%]  py-2 border-r-[1px] ">
                {!loading ? (
                    <Chat chat={data} user={user} />
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
