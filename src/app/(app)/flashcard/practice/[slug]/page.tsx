import CFlashcardPractice from "@/components/flashcard/CFlashcardPractice"
import { LoadingScreen } from "@/components/LoadingScreen"
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI"
import React, { Suspense } from "react"

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const req = await GET_API_WITHOUT_COOKIE("/flashcards/" + params.slug)
    const fc = req?.listFlashCards
    return {
        title: `Quizzet | ${fc.title}`,
        description: `Quizzet | ${fc.desc} | Ngôn ngữ: ${fc.language} |${fc.flashcards.length} flashcards`,
        openGraph: {
            title: `Quizzet | ${fc.title}`,
            description: `Quizzet | ${fc.desc} | Ngôn ngữ: ${fc.language} |${fc.flashcards.length} flashcards`,
            type: "website",
            images: "/flashcard-detail.png",
            url: "https://quizzet.site/flashcard/" + params.slug,
        },
    }
}

export default async function FlashcardPracticePage({ params }: { params: { slug: string } }) {
    const res = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.slug}`)
    return (
        <Suspense fallback={LoadingScreen()}>
            <CFlashcardPractice fc={res?.listFlashCards?.flashcards} />
        </Suspense>
    )
}
