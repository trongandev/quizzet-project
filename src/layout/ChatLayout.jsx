import React from "react";
import Chat from "../pages/User/Chat";
import { Outlet } from "react-router-dom";

export default function ChatLayout() {
    return (
        <div className="flex bg-white border-gray-200 border-[1px] rounded-lg shadow-sm ">
            <div className=" h-[83vh] w-[25%]  py-2 border-r-[1px] ">
                <Chat />
            </div>
            <Outlet />
        </div>
    );
}
