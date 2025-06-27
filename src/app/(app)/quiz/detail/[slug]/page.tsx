"use client";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";
import { IComment, IQuestion, IQuiz } from "@/types/type";
import DetailQuiz from "@/components/quiz/DetailQuiz";
import Loading from "@/components/ui/loading";
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>();
    const [quiz, setQuiz] = useState<IQuestion[]>();
    const [comment, setComment] = useState<IComment[]>([]);
    const token = Cookies.get("token") || "";
    const userContext = useUser();
    const user = userContext?.user;

    const defaultReport = { type_of_violation: "spam", content: "" };
    const [report, setReport] = useState(defaultReport);
    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`);
            setComment(res?.quiz?.comment);
            setQuiz(res?.quiz?.questions?.data_quiz.slice(0, 6));
            delete res?.quiz?.questions;
            setData(res.quiz);
        };
        fetchData();
    }, []);

    if (data === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading className="h-14 w-14" />
            </div>
        );
    }

    return <DetailQuiz quiz={quiz} data={data} comment={comment} setComment={setComment} user={user} />;
}
