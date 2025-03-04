import Image from "next/image";
import React from "react";
import OnlineUsers from "./OnlineUsers";
export default function CongDong() {
    return (
        <div className="h-screen flex items-center justify-center flex-col">
            <Image src="https://ledlia.com/wp-content/uploads/2020/03/bao-tri-icon.jpg" alt="" width={500} height={500}></Image>
            <h1 className="text-center text-2xl mt-5 font-bold text-primary animate-bounce">Chat cộng đồng đang bảo trì...</h1>
            <OnlineUsers />
        </div>
    );
}
