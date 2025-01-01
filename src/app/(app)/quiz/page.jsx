import CQuiz from "@/components/CQuiz";
import { getCachedQuizzet } from "@/lib/cacheData";
import React from "react";

export default async function page() {
    const quizData = await getCachedQuizzet();
    return (
        <div className="px-3 md:px-0">
            <CQuiz quizData={quizData} />
        </div>
    );
}
