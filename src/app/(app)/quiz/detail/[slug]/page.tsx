"use client"
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI"
import React, { Suspense, useEffect, useState } from "react"

import { useUser } from "@/context/userContext"
import { IComment, IDataQuiz, IQuiz } from "@/types/type"
import DetailQuiz from "@/components/quiz/DetailQuiz"
import { LoadingScreen } from "@/components/LoadingScreen"
import { toast } from "sonner"
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>()
    const [loadingReload, setLoadingReload] = useState(false)
    const [quiz, setQuiz] = useState<IDataQuiz[]>()
    const [comment, setComment] = useState<IComment[]>([])
    const userContext = useUser()
    const user = userContext?.user

    // Hàm reload dữ liệu
    const reloadData = async () => {
        setLoadingReload(true)
        try {
            const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`)
            if (res.ok) {
                setComment(res?.quiz?.comment)
                setQuiz(res?.quiz?.questions?.data_quiz)
                delete res?.quiz?.questions
                setData(res.quiz)
                toast.success("Đã cập nhật dữ liệu bài quiz", {
                    duration: 5000,
                    position: "top-center",
                })
            }
        } catch (error) {
            console.error("Error reloading data:", error)
        } finally {
            setLoadingReload(false)
        }
    }
    useEffect(() => {
        reloadData()
    }, [params.slug])
    return (
        <Suspense fallback={LoadingScreen()}>
            <DetailQuiz quiz={quiz} params={params} data={data} comment={comment} setComment={setComment} user={user} loadingReload={loadingReload} reloadData={reloadData} />;
        </Suspense>
    )
}
