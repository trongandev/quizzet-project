import CPublicFlashcard from "@/components/flashcard/CPublicFlashcard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getCachedFlashcardPublic } from "@/lib/cacheData";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
export async function generateMetadata() {
    return {
        title: `Quizzet | Flashcard trắc nghiệm trực tuyến`,
        description: `Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!`,
        openGraph: {
            title: `Quizzet | Flashcard trắc nghiệm trực tuyến`,
            description: `Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!`,
            type: "website",
            images: "/flashcard.png",
            url: "https://quizzet.site/flashcard",
        },
    };
}

export default async function page() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value || "";
    const publicFlashcards = await getCachedFlashcardPublic();
    const summary = await GET_API("/flashcard/summary", token);
    return (
        <Suspense fallback={LoadingScreen()}>
            <CPublicFlashcard publicFlashcards={publicFlashcards} summary={summary} />
        </Suspense>
    );
}
