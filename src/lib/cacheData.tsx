import { unstable_cache } from "next/cache";
import { GET_API, GET_API_WITHOUT_COOKIE } from "./fetchAPI";

export const getCachedQuizzet = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/quiz");
        return response.quiz;
    },
    ["quizzet"],
    {
        revalidate: 60 * 60 * 8,
        tags: ["quizzet"], // ✅ Thêm tags
    }
);

export const getCachedQuiz = (slug: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/quiz/${slug}`);
            return response;
        },
        [`quiz_${slug}`],
        {
            revalidate: 60 * 60 * 24,
            tags: [`quiz_${slug}`, "quiz"], // ✅ Thêm tags
        }
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
        return response;
    },
    ["flashcard_public"],
    {
        revalidate: 60,
        tags: ["flashcard_public", "flashcards"], // ✅ Thêm tags
    }
);

export const getCachedFlashcardUser = (token: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API(`/list-flashcards`, token);
            return response;
        },
        [`flashcard_${token}`], // Key cache
        { revalidate: 30 } // TTL = 30s
    );

export const getCachedFlashcardDetail = (id: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/flashcards/${id}`);
            return response;
        },
        [`flashcard_${id}`],
        {
            revalidate: 30,
            tags: [`flashcard_${id}`, "flashcards"], // ✅ Thêm tags
        }
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
