import React from "react";
import { Spin } from "antd";
import { GET_API } from "@/lib/fetchAPI";
import CAnswer from "./CAnswer";
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("token")?.value;
    const req = await GET_API("/history/" + params.slug, authToken);
    const quiz = req?.history;
    return {
        title: `Quizzet | ${quiz?.quiz_id?.title}`,
        description: `Quizzet | ${quiz?.quiz_id?.content}`,
        openGraph: {
            title: `Quizzet | ${quiz?.quiz_id?.title}`,
            description: `Quizzet | ${quiz?.quiz_id?.content}`,
            type: "website",
            // images: quiz[0]?.img,
            url: "https://quizzet.site/dapan/" + params.slug,
        },
    };
}
export default async function Answer({ params }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("token")?.value;
    const req = await GET_API("/history/" + params.slug, authToken);

    if (req && req?.history.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }
    return <CAnswer quiz={req?.history} question={req?.history?.questions?.data_history}></CAnswer>;
}
