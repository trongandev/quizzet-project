import { unstable_cache } from "next/cache";
import { GET_API, GET_API_WITHOUT_COOKIE } from "./fetchAPI";

export const getCachedQuizzet = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/quiz");
        return response.quiz;
    },
    ["quizzet"], // Key cache
    { revalidate: 60 * 60 * 8 } // TTL = 8 giờ
);

export const getCachedQuiz = (slug: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/quiz/${slug}`);
            return response;
        },
        [`quiz_${slug}`], // Key cache
        { revalidate: 60 * 60 * 24 } // TTL = 24 giờ
    );

export const getCachedTool = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/admin/suboutline");
        return response;
    },
    ["tool"], // Key cache
    { revalidate: 60 * 60 * 24 } // TTL = 24 tiếng
);

export const getCachedFlashcardPublic = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/list-flashcards/public");
        return response.data;
    },
    ["flashcard_public"], // Key cache
    { revalidate: 60 } // TTL =24 tieng
);

export const getCachedFlashcardUser = (token: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API(`/list-flashcards`, token);
            return response;
        },
        [`flashcard_${token}`], // Key cache
        { revalidate: 30 } // TTL = 24 giờ
    );

export const getCachedFlashcardDetail = (id: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/flashcards/${id}`);
            return response;
        },
        [`flashcard_${id}`], // Key cache
        { revalidate: 30 } // TTL = 24 giờ
    );

export const getEmoji = unstable_cache(
    async () => {
        const req = await fetch("https://emoji-api.com/emojis?access_key=bf409e3ed3d59cc01d12b7f1a9512896fe36f4f1");
        const data = await req.json();
        return data;
    },
    ["emoji"], // Key cache
    { revalidate: 300 } // TTL = 30 giây
);
