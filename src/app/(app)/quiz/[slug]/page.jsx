import React from "react";
import { unstable_cache } from "next/cache";
import { GET_API } from "@/lib/fetchAPI";
import CQuiz from "@/components/CQuiz";
const getCachedQuiz = (slug) =>
    unstable_cache(
        async () => {
            const response = await GET_API(`/quiz/${slug}`);
            return response.quiz;
        },
        [`quiz_${slug}`], // Key cache
        { revalidate: 30 } // TTL = 1 giờ
    );

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
    return <CQuiz QuizData={quiz} />;
}
