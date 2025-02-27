import CQuiz from "@/components/CQuiz";
import { getCachedQuizzet, getCachedTool } from "@/lib/cacheData";
import React from "react";

export async function generateMetadata() {
    // const quiz = await getCachedQuizzet();
    // const tool = await getCachedTool();
    // let data = "";
    // let dataTool = "";
    // quiz?.map((item) => {
    //     data += item.content + " | ";
    // });
    // tool?.map((item) => {
    //     dataTool += item.title + " | ";
    // });

    return {
        title: `Quizzet | Trang chủ`,
        description: `Quizzet`,
        openGraph: {
            title: `Quizzet | Trang chủ`,
            description: `Quizzet`,
            type: "website",
            // images: quiz[0]?.img,
            url: "https://trongan.site",
        },
    };
}

export default async function page() {
    const quizData = await getCachedQuizzet();
    return (
        <div className="px-3 md:px-0">
            <CQuiz quizData={quizData} />
        </div>
    );
}
