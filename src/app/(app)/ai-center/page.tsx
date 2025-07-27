import { HomeViewAI } from "@/components/ai-center/HomeViewAI"
import React from "react"

export async function generateMetadata() {
    return {
        title: "Trung tâm AI",
        description: "Trung tâm AI của Quizzet - Nơi bạn có thể tạo quiz, quản lý đề cương và xem các bản nháp.",
        openGraph: {
            title: "Trung tâm AI - Quizzet",
            description: "Trung tâm AI của Quizzet - Nơi bạn có thể tạo quiz, quản lý đề cương và xem các bản nháp.",
            type: "website",
            url: "https://quizzet.site/ai-center",
            images: "/ai-center.png",
        },
    }
}

export default function MenuAddQuest() {
    return <HomeViewAI />
}
