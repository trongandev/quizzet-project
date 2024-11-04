import CHome from "@/components/CHome";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { unstable_cache } from "next/cache";
import React from "react";
const getCachedQuizzet = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/quiz");
        return response?.quiz;
    },
    ["quizzet"], // Key cache
    { revalidate: 30 } // TTL = 1 giờ
);

const getCachedTool = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/admin/suboutline");
        return response;
    },
    ["tool"], // Key cache
    { revalidate: 30 } // TTL = 1 giờ
);

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
            images: quiz[0]?.img,
            url: "https://trongan.site",
        },
    };
}

export default async function HomePage() {
    const quizzet = await getCachedQuizzet();
    const tool = await getCachedTool();
    return <CHome quizData={quizzet} toolData={tool} />;
}
