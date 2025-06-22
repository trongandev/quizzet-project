import React from "react";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import CFlashcardDetail from "@/components/flashcard/CFlashcardDetail";
export async function generateMetadata({ params }: any) {
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

export default async function page({ params }: any) {
    return <CFlashcardDetail id_flashcard={params.id} />;
}
