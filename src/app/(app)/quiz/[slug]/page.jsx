import React from "react";
import CQuizDetail from "@/components/CQuizDetail";
import { getCachedQuiz } from "@/lib/cacheData";

export async function generateMetadata({ params }) {
    const { slug } = params;
    const quiz = await getCachedQuiz(slug)();
    return {
        title: `Quizzet | ${quiz?.title}`,
        description: `Quizzet | ${quiz?.content}`,
        openGraph: {
            title: `Quizzet | ${quiz?.title} | Số câu hỏi:  + ${quiz?.lenght}`,
            description: `Quizzet | ${quiz?.content}`,
            type: "website",
            images: quiz?.img,
            url: "https://trongan.site/quiz/" + slug,
        },
    };
}

export default async function Quiz({ params }) {
    const { slug } = params;

    const quiz = await getCachedQuiz(slug)();
    return <CQuizDetail QuizData={quiz} />;
}
