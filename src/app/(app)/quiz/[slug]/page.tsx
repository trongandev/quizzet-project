import React from "react";
import CQuizDetail from "@/components/CQuizDetail";
import { getCachedQuiz } from "@/lib/cacheData";

export async function generateMetadata({ params }: { params: any }) {
    const { slug } = params;
    const quiz = await getCachedQuiz(slug)();
    return {
        title: `Quizzet | ${quiz?.quiz?.title}`,
        description: `Quizzet | ${quiz?.quiz?.content}`,
        openGraph: {
            title: `Quizzet | ${quiz?.quiz?.title} | Số câu hỏi:  + ${quiz?.quiz?.lenght}`,
            description: `Quizzet | ${quiz?.quiz?.content}`,
            type: "website",
            images: quiz?.quiz?.img,
            url: "https://quizzet.site/quiz/" + slug,
        },
    };
}

export default async function Quiz({ params }: { params: any }) {
    const quiz = await getCachedQuiz(params.slug)();
    const question = quiz.quiz?.questions?.data_quiz;
    return <CQuizDetail QuizData={quiz.quiz} QuestData={question} />;
}
