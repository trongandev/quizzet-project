import ChatCommunity from "@/components/community/ChatCommunity";
import React from "react";

export async function generateMetadata() {
    return {
        title: `Quizzet | Chat cộng đồng`,
        description: `Trang chat cộng đồng của Quizzet, giúp người dùng kết nối, chia sẻ và thảo luận về các chủ đề thú vị.`,
        openGraph: {
            title: `Quizzet | Chat cộng đồng`,
            description: `Trang chat cộng đồng của Quizzet, giúp người dùng kết nối, chia sẻ và thảo luận về các chủ đề thú vị.`,
            type: "website",
            images: "/chatcommunity.png",
            url: "https://quizzet.site/congdong",
        },
    };
}
export default function CongDong() {
    return <ChatCommunity />;
}
