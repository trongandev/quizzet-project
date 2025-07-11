import React from "react";
import CDeCuongDetail from "@/components/decuong/CDeCuongDetail";
import { getCachedDecuongDetail } from "@/lib/cacheData";

export async function generateMetadata({ params }: any) {
    const { slug } = params;
    const decuong = await getCachedDecuongDetail(slug)();
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

    const decuong = await getCachedDecuongDetail(slug)();
    return <CDeCuongDetail DeCuongData={decuong} />;
}
