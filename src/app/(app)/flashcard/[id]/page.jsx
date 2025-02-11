import CFlashcardDetail from "@/components/CFlashcardDetail";
import React from "react";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";

export async function generateMetadata({ params }) {
    const listFlashCards = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.id}`);
    return {
        title: `Quizzet | Flashcard: ${listFlashCards?.data?.title}`,
        description: `${listFlashCards?.data?.desc || "Không có mô tả"} | Ngôn ngữ: ${listFlashCards?.data?.language}`,
        openGraph: {
            title: `Quizzet | Flashcard: ${listFlashCards?.data?.title}`,
            description: listFlashCards?.data?.desc + " | " + listFlashCards?.data?.language,
            type: "website",
            url: "https://trongan.site/flashcard/" + params.id,
        },
    };
}

export default async function page({ params }) {
    return <CFlashcardDetail id_flashcard={params.id} />;
}
