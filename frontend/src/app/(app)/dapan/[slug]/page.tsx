import React, { Suspense } from "react"
import { GET_API } from "@/lib/fetchAPI"
import CAnswer from "./CAnswer"
import { cookies } from "next/headers"
import { LoadingScreen } from "@/components/LoadingScreen"

export async function generateMetadata(params: any) {
    const cookieStore = cookies()
    const authToken = cookieStore.get("token")?.value || ""
    const req = await GET_API("/history/" + params.slug, authToken)
    const quiz = req?.history
    return {
        title: `Quizzet | ${quiz?.quiz_id?.title}`,
        description: `Quizzet | ${quiz?.quiz_id?.content}`,
        openGraph: {
            title: `Quizzet | ${quiz?.quiz_id?.title}`,
            description: `Quizzet | ${quiz?.quiz_id?.content}`,
            type: "website",
            // images: quiz[0]?.img,
            url: "https://quizzet.site/dapan/" + params.slug,
        },
    }
}
export default async function Answer({ params }: any) {
    const cookieStore = cookies()
    const authToken = cookieStore.get("token")?.value || ""
    const req = await GET_API("/history/" + params.slug, authToken)

    return (
        <Suspense fallback={LoadingScreen()}>
            <CAnswer history={req?.history} question={req?.question}></CAnswer>;
        </Suspense>
    )
}
