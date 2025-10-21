import CFlashcardPractice from "@/components/flashcard/CFlashcardPractice"
import { LoadingScreen } from "@/components/LoadingScreen"
import { GET_API } from "@/lib/fetchAPI"
import { cookies } from "next/headers"
import React, { Suspense } from "react"

export default async function FlashcardPracticePage() {
    const cookiesStore = cookies()
    const token = cookiesStore.get("token")?.value || ""
    const req = await GET_API(`/flashcards/practice`, token)
    return (
        <Suspense fallback={LoadingScreen()}>
            <CFlashcardPractice fc={req?.listFlashCards} />
        </Suspense>
    )
}
