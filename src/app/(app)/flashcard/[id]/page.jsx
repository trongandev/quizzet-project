import CFlashcardDetail from "@/components/CFlashcardDetail";
import React from "react";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";

export async function generateMetadata({ params }) {
    const listFlashCards = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.id}`);
    return {
        title: `Quizzet | Flashcard: ${listFlashCards?.listFlashCards?.title}`,
        description: `${listFlashCards?.listFlashCards?.desc || "Không có mô tả"} | Ngôn ngữ: ${listFlashCards?.listFlashCards?.language}`,
        openGraph: {
            title: `Quizzet | Flashcard: ${listFlashCards?.listFlashCards?.title}`,
            description: listFlashCards?.listFlashCards?.desc + " | " + listFlashCards?.listFlashCards?.language,
            type: "website",
            url: "https://quizzet.site/flashcard/" + params.id,
        },
    };
}

export default async function page({ params }) {
    return <CFlashcardDetail id_flashcard={params.id} />;
}
