import React from "react"
import { Metadata } from "next"
import CFlashcardDetail from "@/components/flashcard/CFlashcardDetail"
import { getCachedFlashcardDetail } from "@/lib/cacheData"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const req = await getCachedFlashcardDetail(params.id)()
        const flashcard = req?.listFlashCards

        return {
            title: `${flashcard?.title || "Flashcard"} - Quizzet`,
            description: flashcard?.desc || "Học từ vựng hiệu quả với Quizzet",
            openGraph: {
                title: flashcard?.title,
                description: flashcard?.desc,
                type: "article",
                url: `https://quizzet.site/flashcard/${params.id}`,
            },
        }
    } catch (error) {
        return {
            title: "Flashcard - Quizzet",
            description: "Học từ vựng hiệu quả với Quizzet",
        }
    }
}

// ✅ 3. Main Page Component với caching
export default async function FlashcardPage({ params }: { params: { id: string } }) {
    return <CFlashcardDetail id_flashcard={params.id} />
}
