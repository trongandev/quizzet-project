"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { IFillInTheBlankQuestion } from "@/types/typeEnglishExam"

export function FillInBlankQuestion({ question }: { question: IFillInTheBlankQuestion }) {
    const renderQuestionWithBlank = () => {
        const parts = question.question_text.split("_____")

        return (
            <div className="text-xl text-white leading-relaxed">
                {parts.map((part: string, index: number) => (
                    <span key={index}>
                        {part}
                        {index < parts.length - 1 && <Input value={question.correct_answer_text} className="inline-block w-32 mx-2 bg-slate-700 border-slate-600 text-white text-center" placeholder="..." />}
                    </span>
                ))}
            </div>
        )
    }

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
                <div className="mb-6">{renderQuestionWithBlank()}</div>

                <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-2">Câu trả lời của bạn:</p>
                    <Input value={question.correct_answer_text} className="bg-slate-600 border-slate-500 text-white" placeholder="Nhập câu trả lời..." />
                </div>
            </CardContent>
        </Card>
    )
}
