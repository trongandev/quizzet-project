"use client";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import React, { Suspense, useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";
import { IComment, IQuestion, IQuiz } from "@/types/type";
import DetailQuiz from "@/components/quiz/DetailQuiz";
import Loading from "@/components/ui/loading";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>();
    const [quiz, setQuiz] = useState<IQuestion[]>();
    const [comment, setComment] = useState<IComment[]>([]);
    const token = Cookies.get("token") || "";
    const userContext = useUser();
    const user = userContext?.user;

    const defaultReport = { type_of_violation: "spam", content: "" };
    const [report, setReport] = useState(defaultReport);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`);
            if (res.ok) {
                setComment(res?.quiz?.comment);
                setQuiz(res?.quiz?.questions?.data_quiz);
                delete res?.quiz?.questions;
                setData(res.quiz);
            }
        };
        fetchData();
    }, []);

    return (
        <Suspense fallback={LoadingScreen()}>
            <DetailQuiz quiz={quiz} data={data} comment={comment} setComment={setComment} user={user} />;
        </Suspense>
    );
}
