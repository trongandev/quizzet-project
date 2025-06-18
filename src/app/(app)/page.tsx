import CHome from "@/components/CHome";
import { getCachedFlashcardPublic, getCachedQuizzet, getCachedTool } from "@/lib/cacheData";
import React from "react";

export async function generateMetadata() {
    return {
        title: `Quizzet - AI Quiz, Flashcard Generator`,
        description: `Quizzet là một nền tảng web được thiết kế nhằm tối ưu hóa quá trình học tập và ôn luyện của sinh viên thông qua các tính năng đa dạng và ứng dụng công nghệ (AI). Nền tảng không chỉ giúp sinh viên tự kiểm tra kiến thức mà còn hỗ trợ xây dựng lộ trình học tập hiệu quả, tương tác với cộng đồng và tiếp cận nguồn tài liệu phong phú.`,
        openGraph: {
            title: `Quizzet - AI Quiz, Flashcard Generator`,
            description: `Quizzet là một nền tảng web được thiết kế nhằm tối ưu hóa quá trình học tập và ôn luyện của sinh viên thông qua các tính năng đa dạng và ứng dụng công nghệ trí tuệ nhân tạo (AI). Nền tảng không chỉ giúp sinh viên tự kiểm tra kiến thức mà còn hỗ trợ xây dựng lộ trình học tập hiệu quả, tương tác với cộng đồng và tiếp cận nguồn tài liệu phong phú.`,
            type: "website",
            images: "/banner.png",
            url: "https://quizzet.site",
        },
    };
}

export default async function HomePage() {
    const quizzet = await getCachedQuizzet();
    const tool = await getCachedTool();
    const publicFlashcards = await getCachedFlashcardPublic();
    return <CHome quizData={quizzet} toolData={tool} publicFlashcards={publicFlashcards} />;
}
