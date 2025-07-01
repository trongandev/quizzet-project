import React from "react";
import { cookies } from "next/headers";
import CFlashcardPage from "@/components/admin/CFlashcardPage";
import { GET_API } from "@/lib/fetchAPI";
export default async function FlashcardPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/list-flashcards/admin", token);
    return <CFlashcardPage flashcard={res} />;
}
