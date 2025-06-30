import CQuizPage from "@/components/quiz/CQuizPage";
import { getCachedQuizzet } from "@/lib/cacheData";
import React from "react";

export async function generateMetadata() {
    return {
        title: `Quizzet | Trang chủ`,
        description: `Quizzet`,
        openGraph: {
            title: `Quizzet | Trang chủ`,
            description: `Quizzet`,
            type: "website",
            images: "/quiz.png",
            url: "https://quizzet.site/quiz",
        },
    };
}

export default async function page() {
    const quizData = await getCachedQuizzet();
    return (
        <div className=" py-20">
            <CQuizPage publicQuizData={quizData} />
        </div>
    );
}
