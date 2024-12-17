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

export const getCachedTool = unstable_cache(
    async () => {
        const response = await GET_API_WITHOUT_COOKIE("/admin/suboutline");
        return response;
    },
    ["tool"], // Key cache
    { revalidate: 30 } // TTL = 30 giây
);
