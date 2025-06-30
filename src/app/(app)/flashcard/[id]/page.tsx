import React from "react";
import { Metadata } from "next";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import CFlashcardDetail from "@/components/flashcard/CFlashcardDetail";
import { getCachedFlashcardDetail } from "@/lib/cacheData";

// ✅ 1. Static Site Generation với ISR
export async function generateStaticParams() {
    try {
        // Chỉ pre-generate cho popular flashcards
        const req = await GET_API_WITHOUT_COOKIE("/list-flashcards?limit=50&sort=popular");
        const flashcards = req?.listFlashCards || [];

        return flashcards.map((flashcard: any) => ({
            id: flashcard._id,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// ✅ 2. Metadata cho SEO và caching
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const req = await getCachedFlashcardDetail(params.id)();
        const flashcard = req?.listFlashCards;

        return {
            title: `${flashcard?.title || "Flashcard"} - Quizzet`,
            description: flashcard?.desc || "Học từ vựng hiệu quả với Quizzet",
            openGraph: {
                title: flashcard?.title,
                description: flashcard?.desc,
                type: "article",
                url: `https://quizzet.site/flashcard/${params.id}`,
            },
        };
    } catch (error) {
        return {
            title: "Flashcard - Quizzet",
            description: "Học từ vựng hiệu quả với Quizzet",
        };
    }
}

// ✅ 3. Main Page Component với caching
export default async function FlashcardPage({ params }: { params: { id: string } }) {
    const res = await getCachedFlashcardDetail(params.id)();

    return (
        <CFlashcardDetail
            id_flashcard={params.id}
            initialData={res.listFlashCards} // Pass data từ SSG
            statusCounts={res.statusCounts}
        />
    );
}
