import CFlashcardDetail from "@/components/CFlashcardDetail";
import React from "react";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { Spin } from "antd";

export async function generateMetadata({ params }) {
    const listFlashCards = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.id}`);
    return {
        title: `Quizzet | Flashcard: ${listFlashCards?.listFlashCards?.title}`,
        description: `${listFlashCards?.listFlashCards?.desc || "Không có mô tả"} | Ngôn ngữ: ${listFlashCards?.listFlashCards?.language}`,
        openGraph: {
            title: `Quizzet | Flashcard: ${listFlashCards?.listFlashCards?.title}`,
            description: listFlashCards?.listFlashCards?.desc + " | " + listFlashCards?.listFlashCards?.language,
            type: "website",
            url: "https://trongan.site/flashcard/" + params.id,
        },
    };
}

export default async function page({ params }) {
    const listFlashCards = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.id}`);
    if (!listFlashCards) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }
    return <CFlashcardDetail listFlashCards={listFlashCards.listFlashCards} id_flashcard={params.id} />;
}
