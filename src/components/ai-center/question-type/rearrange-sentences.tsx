"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, RotateCcw, ArrowUp, ArrowDown } from "lucide-react"

interface RearrangeSentencesQuestionProps {
    question: any
}

export function RearrangeSentencesQuestion({ question }: RearrangeSentencesQuestionProps) {
    const [sentences, setSentences] = useState(question.scrambled_sentences)

    const updateAnswer = (newSentences: any[]) => {
        setSentences(newSentences)
    }

    const moveSentence = (fromIndex: number, toIndex: number) => {
        const newSentences = [...sentences]
        const [movedSentence] = newSentences.splice(fromIndex, 1)
        newSentences.splice(toIndex, 0, movedSentence)
        updateAnswer(newSentences)
    }

    const moveUp = (index: number) => {
        if (index > 0) {
            moveSentence(index, index - 1)
        }
    }

    const moveDown = (index: number) => {
        if (index < sentences.length - 1) {
            moveSentence(index, index + 1)
        }
    }

    const resetOrder = () => {
        updateAnswer([...question.scrambled_sentences])
    }

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{question.question_text}</h3>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-300">Kéo thả hoặc sử dụng các nút mũi tên để sắp xếp lại thứ tự câu.</p>
                        <Button variant="outline" size="sm" onClick={resetOrder} className="border-slate-600 text-slate-300 bg-transparent">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Đặt lại
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {sentences.map((sentence: any, index: number) => (
                            <div key={sentence.id} className="bg-slate-700 rounded-lg p-4 flex items-center gap-4 group hover:bg-slate-600 transition-colors">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
                                    <Badge variant="secondary" className="bg-slate-600 text-slate-300 min-w-[2rem] justify-center">
                                        {index + 1}
                                    </Badge>
                                </div>

                                <div className="flex-1 text-white">{sentence.text}</div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-400 hover:text-white h-8 w-8 p-0">
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => moveDown(index)} disabled={index === sentences.length - 1} className="text-slate-400 hover:text-white h-8 w-8 p-0">
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-slate-300 mb-3">Xem trước đoạn văn:</h4>
                    <div className="text-white leading-relaxed">
                        {sentences.map((sentence: any, index: number) => (
                            <span key={sentence.id}>
                                {sentence.text}
                                {index < sentences.length - 1 && " "}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
