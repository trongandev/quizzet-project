"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, RotateCcw, ArrowUp, ArrowDown, X, SquarePen, ArrowDownAZ } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { IRearrangeSentencesQuestion, IScrambledSentence } from "@/types/typeEnglishExam"
import { Input } from "@/components/ui/input"

const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export function RearrangeSentencesQuestion({ question }: { question: IRearrangeSentencesQuestion }) {
    const [items, setItems] = useState<any>(question.scrambled_sentences)
    const [edit, setEdit] = useState(false)
    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const reorderedItems = reorder(items, result.source.index, result.destination.index)

        setItems(reorderedItems as any)
    }

    const resetOrder = () => {
        setItems(question)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ArrowDownAZ className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-lg font-semibold text-white">Sắp xếp câu thành câu có ý nghĩa</h3>
                                </div>
                                <Badge variant="secondary" className="bg-slate-700">
                                    Đọc hiểu
                                </Badge>
                                <div className="flex gap-2 md:items-center justify-between my-4">
                                    <Button variant="outline" size="sm" onClick={resetOrder} className="mr-2 border-slate-600 text-slate-300 bg-transparent">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Đặt lại
                                    </Button>
                                    {edit ? (
                                        <Button onClick={() => setEdit(false)} variant="outline" size="sm">
                                            <X /> Tắt chỉnh sửa
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setEdit(true)} variant="outline" size="sm">
                                            <SquarePen /> Mở chỉnh sửa
                                        </Button>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-white mb-6">{question.question_text}</h3>
                                    {items.map((item: any, index: any) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided) => (
                                                <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-2 bg-slate-800 border-slate-700">
                                                    <CardContent className="flex items-center justify-between p-3">
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical className="text-slate-400" />
                                                            {edit ? (
                                                                <Input
                                                                    value={item.text}
                                                                    onChange={(e) => {
                                                                        const newItems = [...items]
                                                                        newItems[index].text = e.target.value
                                                                        setItems(newItems)
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                            ) : (
                                                                <span className="text-slate-300">{item.text}</span>
                                                            )}
                                                        </div>
                                                        <Badge variant="secondary">{index + 1}</Badge>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                {/* Preview */}
                                <div className="bg-slate-700 rounded-lg p-4">
                                    <h4 className="font-medium text-slate-300 mb-3">Xem trước đoạn văn:</h4>
                                    <div className="text-white leading-relaxed">
                                        {items.map((sentence: any, index: number) => (
                                            <span key={sentence.id}>
                                                {sentence.text}
                                                {index < items.length - 1 && " "}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
