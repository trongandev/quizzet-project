import CPublicFlashcard from "@/components/CPublicFlashcard";
import { getCachedFlashcardUser, getCachedFlashcardPublic } from "@/lib/cacheData";
import React from "react";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
export async function generateMetadata() {
    return {
        title: `Quizzet | Flashcard trắc nghiệm trực tuyến`,
        description: `Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!`,
        openGraph: {
            title: `Quizzet | Flashcard trắc nghiệm trực tuyến`,
            description: `Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!`,
            type: "website",
            url: "https://trongan.site/flashcard",
        },
    };
}

export async function refreshUserFlashcardsCache(token: string) {
    "use server";
    await revalidateTag(`flashcard_${token}`);
    await revalidatePath("/flashcard");
}

export default async function page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const publicFlashcards = await getCachedFlashcardPublic();
    const listFlashCard = token ? await getCachedFlashcardUser(token.value)() : null;
    return <CPublicFlashcard publicFlashcards={publicFlashcards} listFlashCards={listFlashCard?.listFlashCards} token={token?.value} refreshCache={refreshUserFlashcardsCache} />;
}
