import CDeCuong from "@/components/decuong/CDeCuong"
import CQuizPage from "@/components/quiz/CQuizPage"
import { getCachedDeCuong, getCachedQuizzet } from "@/lib/cacheData"
import React from "react"

export async function generateMetadata() {
    return {
        title: `Quizzet | Quiz + Đề cương`,
        description: `Quizzet | Khu vực tổng hợp các bài trắc nghiệm và đề cương học tập`,
        openGraph: {
            title: `Quizzet | Quiz + Đề cương`,
            description: `Quizzet | Khu vực tổng hợp các bài trắc nghiệm và đề cương học tập`,
            type: "website",
            images: "/quiz.png",
            url: "https://quizzet.site/quiz",
        },
    }
}

export default async function page() {
    const quizData = await getCachedQuizzet()
    const res = await getCachedDeCuong()

    return (
        <div className=" py-20">
            <CQuizPage publicQuizData={quizData} />
            <div className="mt-20"></div>
            <CDeCuong findText={res?.findText} findFile={res?.findFile} />
        </div>
    )
}
