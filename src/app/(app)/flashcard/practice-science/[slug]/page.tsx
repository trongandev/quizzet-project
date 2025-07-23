import CFlashcardPracticeScience from "@/components/flashcard/CFlashcardPracticeScience"
import { LoadingScreen } from "@/components/LoadingScreen"
import { GET_API } from "@/lib/fetchAPI"
import { cookies } from "next/headers"
import React, { Suspense } from "react"

export default async function PracticeScienceIDPage({ params }: { params: { slug: string } }) {
    const cookiesStore = cookies()
    const token = cookiesStore.get("token")?.value || ""
    let flashcards = []
    const req = await GET_API(`/flashcards/practice/${params.slug}`, token)
    flashcards = req?.listFlashCards || []

    return (
        <Suspense fallback={LoadingScreen()}>
            <CFlashcardPracticeScience flashcards={flashcards} />
        </Suspense>
    )
}
