import CPublicFlashcard from "@/components/CPublicFlashcard";
import { getCachedFlashcardPublic } from "@/lib/cacheData";
import React from "react";
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
    const publicFlashcards = await getCachedFlashcardPublic();
    return <CPublicFlashcard publicFlashcards={publicFlashcards} />;
}
