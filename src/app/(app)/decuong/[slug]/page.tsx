import React from "react";
import { unstable_cache } from "next/cache";
import { GET_API, GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import CTaiLieuDetail from "@/components/CTaiLieuDetail";

const getCachedDecuong = (slug: string) =>
    unstable_cache(
        async () => {
            const response = await GET_API_WITHOUT_COOKIE(`/admin/so/${slug}`);
            return response;
        },
        [`de_cuong_${slug}`], // Key cache
        { revalidate: 30 } // TTL = 1 giờ
    );

export async function generateMetadata({ params }: any) {
    const { slug } = params;
    const decuong = await getCachedDecuong(slug)();
    return {
        title: `Quizzet | ${decuong?.title} | Số câu hỏi:  + ${decuong?.lenght}`,
        description: `Quizzet | ${decuong?.title} | Số câu hỏi:  + ${decuong?.lenght}`,
        openGraph: {
            title: `Quizzet | ${decuong?.title} | Số câu hỏi:  + ${decuong?.lenght}`,
            description: `Quizzet | ${decuong?.title} | Số câu hỏi:  + ${decuong?.lenght}`,
            type: "website",
            images: decuong?.image,
            url: "https://quizzet.site/decuong/" + slug,
        },
    };
}

export default async function Decuong({ params }: any) {
    const { slug } = params;

    const decuong = await getCachedDecuong(slug)();
    return <CTaiLieuDetail DeCuongData={decuong} />;
}
