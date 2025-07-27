// import { AICreateView } from "@/components/quiz/AICreateView"
import React from "react"

export async function generateMetadata() {
    return {
        title: "Tạo Quiz AI - Quizzet",
        description: "Tạo quiz tự động với AI trên Quizzet",
        openGraph: {
            title: "Tạo Quiz AI - Quizzet",
            description: "Tạo quiz tự động với AI trên Quizzet",
            type: "website",
            url: "https://quizzet.site/quiz/themcauhoi/ai-create",
            images: "/ai-create.png",
        },
        keywords: ["AI Quiz", "Tạo Quiz", "Quizzet"],
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default function AICreatePage() {
    // return <AICreateView />
    return <div>Chưa có</div>
}
