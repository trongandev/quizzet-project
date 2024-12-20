import { unstable_cache } from "next/cache";
import { GET_API_WITHOUT_COOKIE } from "./fetchAPI";

export const getCachedQuizzet = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/quiz");
        return response?.quiz;
    },
    ["quizzet"], // Key cache
    { revalidate: 30 } // TTL = 1 giờ
);

export const getCachedQuiz = (slug: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/quiz/${slug}`);
            return response?.quiz;
        },
        [`quiz_${slug}`], // Key cache
        { revalidate: 30 } // TTL = 1 giờ
    );

export const getCachedTool = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/admin/suboutline");
        return response;
    },
    ["tool"], // Key cache
    { revalidate: 30 } // TTL = 30 giây
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
