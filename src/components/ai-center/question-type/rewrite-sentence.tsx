"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IRewriteSentenceQuestion } from "@/types/typeEnglishExam"

export function RewriteSentenceQuestion({ question }: { question: IRewriteSentenceQuestion }) {
    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{question.question_text}</h3>

                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <h4 className="font-medium text-slate-300 mb-2">Câu gốc:</h4>
                        <p className="text-white text-lg italic">{question.question_text.includes(":") ? question.question_text.split(":")[1].trim().replace(/['"]/g, "") : "The students finished all the homework."}</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-300">Câu trả lời của bạn:</h4>
                        </div>
                        <Textarea value={question.correct_answer_text} className="bg-slate-700 border-slate-600 text-white min-h-[120px] text-lg leading-relaxed" placeholder="Viết lại câu theo yêu cầu..." />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
