"use client"
import { useUser } from "@/context/userContext"
import { GET_API } from "@/lib/fetchAPI"
import { IEnglishExam } from "@/types/typeEnglishExam"
import React, { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { MultipleChoiceQuestion } from "@/components/ai-center/question-type/multiple-choice"
import { FillInBlankQuestion } from "@/components/ai-center/question-type/fill-in-blank"
import { MatchingQuestion } from "@/components/ai-center/question-type/matching"
import { RearrangeSentencesQuestion } from "@/components/ai-center/question-type/rearrange-sentences"
import { RewriteSentenceQuestion } from "@/components/ai-center/question-type/rewrite-sentence"
import { ReadingComprehensionQuestion } from "@/components/ai-center/question-type/reading-comprehension"
import { ListeningComprehensionQuestion } from "@/components/ai-center/question-type/listening-comprehension"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
export default function EnglishExamDetailPage({ params }: { params: { id: string } }) {
    const [dataEnglishExam, setDataEnglishExam] = useState<IEnglishExam | null>(null)
    const token = Cookies.get("token") || ""
    const { user } = useUser() || { user: null }
    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API(`/english-exam/${params.id}`, token)
            setDataEnglishExam(res?.englishExam)
            console.log("res?.englishExams", res?.englishExam)
        }
        fetchData()
    }, [])
    const renderQuestion = (question: any, index: number) => {
        switch (question.question_type) {
            case "multiple_choice":
                return <MultipleChoiceQuestion question={question} id={index} />
            case "fill_in_the_blank":
                return <FillInBlankQuestion question={question} id={index} />
            case "matching":
                return <MatchingQuestion question={question} id={index} />
            case "rearrange_sentences":
                return <RearrangeSentencesQuestion question={question} is_exam={true} id={index} />
            case "rewrite_sentence":
                return <RewriteSentenceQuestion question={question} id={index} />
            case "reading_comprehension":
                return <ReadingComprehensionQuestion question={question} id={index} />
            case "listening_comprehension":
                return <ListeningComprehensionQuestion question={question} id={index} />
            default:
                return <div className="text-slate-400">Unsupported question type</div>
        }
    }
    return (
        <div className="w-full min-h-screen md:w-[1000px] xl:w-[1200px] px-2 md:px-0 mx-auto py-16">
            <div className="min-h-[500px]  md:min-h-[600px] overflow-y-scroll space-y-3 ">
                <div className="dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md p-6 rounded-lg mb-3">
                    <h1 className="text-xl font-semibold">{dataEnglishExam?.title || "Chưa có tiêu đề"}</h1>
                    <div className="dark:text-white/80 text-sm space-y-1">
                        <p>{dataEnglishExam?.description || "Chưa có mô tả"}</p>
                        {dataEnglishExam?.skills.map((skill, index) => (
                            <Badge variant="secondary" key={index} className="mr-2 mb-2">
                                {skill.charAt(0).toUpperCase() + skill.slice(1)}
                            </Badge>
                        ))}
                        <p>Thời gian làm bài: {dataEnglishExam?.timeLimit}p</p>
                    </div>
                </div>
                <div className="flex gap-3 flex-col md:flex-row h-screen overflow-scroll overscroll-contain scroll-smooth">
                    <div className="space-y-3 flex-1 rounded-lg">
                        {dataEnglishExam?.questions.map((question: any, index) => (
                            <div className="w-full" key={index}>
                                {renderQuestion(question, index)}
                            </div>
                        ))}
                    </div>
                    <div className="sticky w-[200px] top-0">
                        <div className=" dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md p-5 rounded-lg  min-h-[100px]">
                            <div className="grid grid-cols-3 gap-3">
                                {dataEnglishExam?.questions.map((question: any, index) => (
                                    <Link href={`#question-${index}`} key={index} className="flex items-center cursor-pointer rounded-md bg-slate-700 text-white font-medium hover:bg-slate-600">
                                        <div className="w-10 h-10 flex items-center justify-center ">{index + 1}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
