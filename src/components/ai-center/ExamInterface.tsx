"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle, AlertCircle } from "lucide-react"
import { MultipleChoiceQuestion } from "@/components/ai-center/question-type/multiple-choice"
import { FillInBlankQuestion } from "@/components/ai-center/question-type/fill-in-blank"
// import { MatchingQuestion } from "@/components/ai-center/question-type/matching"
import { RearrangeSentencesQuestion } from "@/components/ai-center/question-type/rearrange-sentences"
import { RewriteSentenceQuestion } from "@/components/ai-center/question-type/rewrite-sentence"
import { ReadingComprehensionQuestion } from "@/components/ai-center/question-type/reading-comprehension"
import { ListeningComprehensionQuestion } from "@/components/ai-center/question-type/listening-comprehension"
import { ExamResults } from "@/components/ai-center/ExamResults"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IEnglishExam } from "@/types/typeEnglishExam"
interface ExamInterfaceProps {
    examData: IEnglishExam
    open: boolean
    setOpen: (open: boolean) => void
}

export function ExamInterface({ examData, open, setOpen }: ExamInterfaceProps) {
    const renderQuestion = (question: any) => {
        switch (question.question_type) {
            case "multiple_choice":
                return <MultipleChoiceQuestion question={question} />
            case "fill_in_the_blank":
                return <FillInBlankQuestion question={question} />
            case "matching":
                // return <MatchingQuestion question={question} />
                return <div className="text-slate-400">Matching questions are not supported yet</div>
            case "rearrange_sentences":
                return <RearrangeSentencesQuestion question={question} />
            case "rewrite_sentence":
                return <RewriteSentenceQuestion question={question} />
            case "reading_comprehension":
                return <ReadingComprehensionQuestion question={question} />
            case "listening_comprehension":
                return <ListeningComprehensionQuestion question={question} />
            default:
                return <div className="text-slate-400">Unsupported question type</div>
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-[90vh] overflow-scroll max-w-4xl">
                {examData.questions.map((question: any, index) => (
                    <div className="" key={index}>
                        {renderQuestion(question)}
                    </div>
                ))}
            </DialogContent>
        </Dialog>
    )
}
