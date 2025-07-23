import CFlashcardPractice from "@/components/flashcard/CFlashcardPractice"
import { LoadingScreen } from "@/components/LoadingScreen"
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI"
import React, { Suspense } from "react"

export default async function FlashcardPracticePage({ params }: { params: { slug: string } }) {
    const res = await GET_API_WITHOUT_COOKIE(`/flashcards/${params.slug}`)
    return (
        <Suspense fallback={LoadingScreen()}>
            <CFlashcardPractice fc={res?.listFlashCards?.flashcards} />
        </Suspense>
    )
}
