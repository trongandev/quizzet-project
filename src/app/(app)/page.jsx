import CHome from "@/components/CHome";
import { getCachedFlashcardPublic, getCachedQuizzet, getCachedTool } from "@/lib/cacheData";
import React from "react";

export async function generateMetadata() {
    const quiz = await getCachedQuizzet();
    const tool = await getCachedTool();
    let data = "";
    let dataTool = "";
    quiz?.map((item) => {
        data += item.content + " | ";
    });
    tool?.map((item) => {
        dataTool += item.title + " | ";
    });

    return {
        title: `Quizzet | Trang chủ`,
        description: `Quizzet | ${data} ${dataTool}`,
        openGraph: {
            title: `Quizzet | Trang chủ`,
            description: `Quizzet | ${data} ${dataTool}`,
            type: "website",
            images: "quiz[0]?.img",
            url: "https://trongan.site",
        },
    };
}

export default async function HomePage() {
    const quizzet = await getCachedQuizzet();
    const tool = await getCachedTool();
    const publicFlashcards = await getCachedFlashcardPublic();
    return <CHome quizData={quizzet} toolData={tool} publicFlashcards={publicFlashcards} />;
}
