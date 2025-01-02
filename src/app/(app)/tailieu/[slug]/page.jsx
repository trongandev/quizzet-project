import React from "react";
import { unstable_cache } from "next/cache";
import { GET_API } from "@/lib/fetchAPI";
import CTaiLieuDetail from "@/components/CTaiLieuDetail";

const getCachedDecuong = (slug) =>
    unstable_cache(
        async () => {
            const response = await GET_API(`/admin/so/${slug}`);
            return response;
        },
        [`de_cuong_${slug}`], // Key cache
        { revalidate: 30 } // TTL = 1 giờ
    );

export async function generateMetadata({ params }) {
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
            url: "https://trongan.site/decuong/" + slug,
        },
    };
}

export default async function Decuong({ params }) {
    const { slug } = params;

    const decuong = await getCachedDecuong(slug)();
    return <CTaiLieuDetail DeCuongData={decuong} />;
}
