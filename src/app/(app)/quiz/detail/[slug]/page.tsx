"use client";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";
import { IComment, IQuestion, IQuiz } from "@/types/type";
import DetailQuiz from "@/components/quiz/DetailQuiz";
import Loading from "@/components/ui/loading";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>();
    const [quiz, setQuiz] = useState<IQuestion[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [comment, setComment] = useState<IComment[]>([]);
    const token = Cookies.get("token") || "";
    const userContext = useUser();
    const user = userContext?.user;

    const defaultReport = { type_of_violation: "spam", content: "" };
    const [report, setReport] = useState(defaultReport);
    const router = useRouter();
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`);
            setComment(res?.quiz?.comment);
            setQuiz(res?.quiz?.questions?.data_quiz);
            delete res?.quiz?.questions;
            setData(res.quiz);
        };
        fetchData();
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading className="h-14 w-14" />
            </div>
        );
    }

    if ((!data || !quiz) && !loading) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3">
                <p className="text-gray-500">Không tìm thấy quiz.</p>
                <Button onClick={() => router.back()}>
                    <ArrowBigLeft /> Quay về
                </Button>
            </div>
        );
    }

    return <DetailQuiz quiz={quiz} data={data} comment={comment} setComment={setComment} user={user} />;
}
