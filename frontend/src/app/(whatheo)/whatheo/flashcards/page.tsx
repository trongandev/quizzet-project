import React from "react"
import { cookies } from "next/headers"
import CFlashcardPage from "@/components/admin/CFlashcardPage"
import { GET_API } from "@/lib/fetchAPI"
export default async function FlashcardPage() {
    const cookiesStore = cookies()
    const token = cookiesStore.get("token")?.value || ""
    const res = await GET_API("/list-flashcards/admin", token)
    if (!res.ok) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1>Bạn không có quyền truy cập</h1>
            </div>
        )
    }
    return <CFlashcardPage flashcard={res?.publicFlashcards} />
}
