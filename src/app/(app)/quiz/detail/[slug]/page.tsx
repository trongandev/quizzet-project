"use client"
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI"
import React, { Suspense, useEffect, useState } from "react"

import { useUser } from "@/context/userContext"
import { IComment, IDataQuiz, IQuiz } from "@/types/type"
import DetailQuiz from "@/components/quiz/DetailQuiz"
import { LoadingScreen } from "@/components/LoadingScreen"
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>()
    const [quiz, setQuiz] = useState<IDataQuiz[]>()
    const [comment, setComment] = useState<IComment[]>([])
    const userContext = useUser()
    const user = userContext?.user

    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`)
            if (res.ok) {
                setComment(res?.quiz?.comment)
                setQuiz(res?.quiz?.questions?.data_quiz)
                delete res?.quiz?.questions
                setData(res.quiz)
            }
        }
        fetchData()
    }, [])

    return (
        <Suspense fallback={LoadingScreen()}>
            <DetailQuiz quiz={quiz} data={data} comment={comment} setComment={setComment} user={user} />;
        </Suspense>
    )
}
