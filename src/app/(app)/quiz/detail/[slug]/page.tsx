"use client";
import handleCompareDate from "@/lib/CompareDate";
import { GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import { message, Modal, Rate, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { FaFileCircleQuestion, FaRegEye, FaRegFlag } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { IoArrowForwardCircleOutline, IoShareSocial } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdOutlineVerified } from "react-icons/md";
import Cookies from "js-cookie";
import { RiTimeLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { IComment, IQuestion, IQuiz, IUser } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CircleChevronRight, Flag, Send } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import DetailQuiz from "@/components/quiz/DetailQuiz";
export default function QuizDetail({ params }: { params: any }) {
    const [data, setData] = useState<IQuiz>();
    const [quiz, setQuiz] = useState<IQuestion[]>([]);
    const [comment, setComment] = useState<IComment[]>([]);
    const [value, setValue] = useState(5);
    const [review, setReview] = useState("");
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
                <Spin size="large" />
            </div>
        );
    }

    return <DetailQuiz quiz={quiz} data={data} comment={comment} setComment={setComment} user={user} />;
}
