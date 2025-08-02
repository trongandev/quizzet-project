"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { IReadingComprehensionQuestion } from "@/types/typeEnglishExam"

export function ReadingComprehensionQuestion({ question }: { question: IReadingComprehensionQuestion }) {
    return (
        <div className="space-y-6">
            {/* Reading Passage */}
            <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Đoạn văn</h3>
                        <Badge variant="secondary" className="bg-slate-700">
                            Đọc hiểu
                        </Badge>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-6">
                        <p className="text-white leading-relaxed text-lg">{question.passage}</p>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 mt-6">{question.question_text}</h3>

                    <div className="space-y-3">
                        {question.options.map((option: any, index: number) => (
                            <Button key={option.id} variant="outline" className={`w-full justify-start h-auto p-4 text-left transition-all ${question.correct_answer_id === option.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"}`}>
                                <div className="flex items-center gap-3 w-full">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${question.correct_answer_id === option.id ? "border-blue-500 bg-blue-500" : "border-slate-500"}`}>{question.correct_answer_id === option.id && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                                    <div className="flex-1">
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                        <span className="whitespace-normal">{option.text}</span>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
