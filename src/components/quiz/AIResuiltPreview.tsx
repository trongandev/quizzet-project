"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit, Trash2, Plus, CheckCircle, Bot, Save, Check, X } from "lucide-react";
import { renderContentWithLaTeX, renderHightlightedContent } from "../renderCode";

interface QuizQuestion {
    title: string;
    subject: string;
    content: string;
    questions: Quiz[];
}

interface Quiz {
    id: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    question: string;
    answers?: string[];
    correct: string;
    points: number;
}

interface AIResultPreviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quiz: QuizQuestion;
    onQuizUpdate: any;
    setOpenAddMoreInfo: (open: boolean) => void;
    setGeneratedQuiz: any;
}

export function AIResultPreview({ open, onOpenChange, quiz, onQuizUpdate, setOpenAddMoreInfo, setGeneratedQuiz }: AIResultPreviewProps) {
    const [quizData, setQuizData] = useState<QuizQuestion>(quiz);
    console.log("AIResultPreview quizData", quizData);
    const [editingQuestion, setEditingQuestion] = useState<Quiz | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Quiz>({
        id: "",
        type: "multiple-choice",
        question: "",
        answers: ["", "", "", ""],
        correct: "",
        points: 1,
    });

    const handleEditQuestion = (question: Quiz) => {
        console.log("Editing question:", question);
        setNewQuestion(question);
        setEditingQuestion(question);
        setIsEditDialogOpen(true);
    };

    const handleAddQuestion = () => {
        setNewQuestion({
            id: Date.now().toString(),
            type: "multiple-choice",
            question: "",
            answers: ["", "", "", ""],
            correct: "",
            points: 1,
        });
        setEditingQuestion(null);
        setIsEditDialogOpen(true);
    };

    const handleSaveQuestion = () => {
        if (!newQuestion.question.trim()) return;

        const updatedQuestions = editingQuestion ? quiz.questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q)) : [...quiz.questions, newQuestion];
        // onQuizUpdate({ ...quiz, updatedQuestions });
        setQuizData((prev) => ({
            ...prev,
            questions: updatedQuestions,
        }));
        setIsEditDialogOpen(false);
        setEditingQuestion(null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        const updatedQuestions = quiz.questions.filter((q) => q.id !== questionId);
        onQuizUpdate({ ...quiz, updatedQuestions });
    };

    const handleQuestionTypeChange = (type: Quiz["type"]) => {
        setNewQuestion((prev) => {
            const updated = { ...prev, type, correct: "" };

            if (type === "multiple-choice") {
                updated.answers = ["", "", "", ""];
            } else if (type === "true-false") {
                updated.answers = ["Đúng", "Sai"];
            } else {
                updated.answers = undefined;
            }

            return updated;
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        setNewQuestion((prev) => ({
            ...prev,
            answers: prev.answers?.map((opt, i) => (i === index ? value : opt)),
        }));
    };

    // const getQuestionTypeLabel = (type: string) => {
    //     switch (type) {
    //         case "multiple-choice":
    //             return "Trắc nghiệm";
    //         case "true-false":
    //             return "Đúng/Sai";
    //         case "short-answer":
    //             return "Tự luận ngắn";
    //         default:
    //             return type;
    //     }
    // };

    const handleChangeAnswers = (value: string) => {
        setNewQuestion((prev) => ({
            ...prev,
            correct: value,
        }));
        setQuizData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => (q.id === newQuestion.id ? { ...q, correct: value } : q)),
        }));
    };

    const renderQuestionForm = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="question-text">Câu hỏi</Label>
                <Textarea
                    id="question-text"
                    placeholder="Nhập câu hỏi..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    className="mt-1 h-40"
                />
            </div>

            <div className="hidden">
                <Label htmlFor="question-type">Loại câu hỏi</Label>
                <Select value={newQuestion.type} defaultValue="multiple-choice" disabled onValueChange={handleQuestionTypeChange}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                        <SelectItem value="true-false">Đúng/Sai</SelectItem>
                        <SelectItem value="short-answer">Tự luận ngắn</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Các lựa chọn</Label>
                <div className="space-y-2 mt-2">
                    <RadioGroup defaultValue={newQuestion.correct} value={newQuestion.correct} onValueChange={(value) => handleChangeAnswers(value)}>
                        {newQuestion &&
                            newQuestion.answers?.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Input
                                        placeholder={`Lựa chọn ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className={String(index) == newQuestion.correct ? "border-green-500 bg-green-50 dark:bg-green-800/50 dark:text-green-200" : ""}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor={`option-${index}`} className="flex items-center space-x-1">
                                            {String(index) == newQuestion.correct ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <RadioGroupItem defaultValue={String(index)} value={String(index)} id={`option-${index}`} className="hidden" />
                                                </>
                                            ) : (
                                                <RadioGroupItem value={String(index)} id={`option-${index}`} />
                                            )}
                                        </Label>
                                    </div>
                                </div>
                            ))}
                    </RadioGroup>
                </div>
            </div>
            {/* {newQuestion.type === "multiple-choice" && (
            )} */}

            {newQuestion.type === "true-false" && (
                <div>
                    <Label>Đáp án đúng</Label>
                    <RadioGroup value={newQuestion.correct} onValueChange={(value) => setNewQuestion((prev) => ({ ...prev, correct: value }))} className="mt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Đúng" id="true" />
                            <Label htmlFor="true">Đúng</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Sai" id="false" />
                            <Label htmlFor="false">Sai</Label>
                        </div>
                    </RadioGroup>
                </div>
            )}

            {newQuestion.type === "short-answer" && (
                <div>
                    <Label htmlFor="text-answer">Đáp án mẫu</Label>
                    <Textarea
                        id="text-answer"
                        placeholder="Nhập đáp án mẫu..."
                        value={newQuestion.correct}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, correct: e.target.value }))}
                        className="mt-1"
                    />
                </div>
            )}

            {/* <div>
                <Label htmlFor="explanation">Giải thích (tùy chọn)</Label>
                <Textarea
                    id="explanation"
                    placeholder="Giải thích đáp án..."
                    value={newQuestion.explanation || ""}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, explanation: e.target.value }))}
                    className="mt-1"
                    rows={2}
                />
            </div> */}

            <div className="hidden">
                <Label htmlFor="points">Điểm số</Label>
                <Input
                    id="points"
                    type="number"
                    disabled
                    min="1"
                    defaultValue={1}
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 1 }))}
                    className="mt-1"
                />
            </div>
        </div>
    );

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-purple-500" />
                            <span>Kết quả Quiz được tạo bởi AI</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Quiz Info */}
                        <Alert className="border-green-200 bg-green-50 dark:bg-green-800/20 ">
                            <AlertDescription className="text-green-800 dark:text-green-200 flex items-center gap-3">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <strong>Thành công!</strong> AI đã tạo {quiz?.questions?.length} câu hỏi cho quiz &quot;{quiz?.title}&quot;, mô tả &quot;{quiz?.content}&quot;. Bạn có thể xem trước,
                                chỉnh sửa hoặc thêm câu hỏi mới.
                            </AlertDescription>
                        </Alert>

                        {/* Actions */}
                        <div className="flex justify-between items-center  flex-col md:flex-row ">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold">Danh sách câu hỏi</h3>
                                <Badge variant="secondary">{quiz.questions.length} câu</Badge>
                            </div>
                            <Button onClick={handleAddQuestion} className="dark:text-white flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Thêm câu hỏi</span>
                            </Button>
                        </div>

                        {/* List */}
                        <div className="space-y-4 max-h-[700px] overflow-y-auto">
                            {quizData &&
                                quizData.questions.map((question, index) => (
                                    <Card key={question.id} className="p-2 md:p-6 border-l-4 border-l-purple-500 dark:border-l-purple-700  hover:shadow-lg transition-shadow duration-200">
                                        <CardHeader className="pb-3 p-2 md:p-6 ">
                                            <div className="flex  flex-col-reverse gap-3 md:gap-0 md:flex-row items-start justify-between ">
                                                <div className="flex-1">
                                                    <CardTitle className="text-base font-medium ">
                                                        Câu {index + 1}: {renderHightlightedContent(question.question)}
                                                    </CardTitle>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        {/* <Badge variant="secondary">{getQuestionTypeLabel(question.type)}</Badge> */}
                                                        <Badge variant="secondary">Trắc nghiệm</Badge>
                                                        <Badge variant="outline">1 điểm</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {question.answers && (
                                            <CardContent className="pt-0 p-2 md:p-6 ">
                                                <div className="space-y-1">
                                                    {question.answers.map((option, optIndex) => (
                                                        <div
                                                            key={optIndex}
                                                            className={`p-2 rounded text-sm ${
                                                                String(optIndex) == question.correct
                                                                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700"
                                                                    : "bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200"
                                                            }`}>
                                                            {String.fromCharCode(65 + optIndex)}. {renderContentWithLaTeX(option)}
                                                            {option === question.correct && <span className="ml-2 text-xs font-medium">(Đáp án đúng)</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>
                            <Button
                                className="text-white bg-gradient-to-r from-purple-500 to-pink-500"
                                onClick={() => {
                                    setOpenAddMoreInfo(true);
                                    setGeneratedQuiz(quizData);
                                }}>
                                <Save className="mr-2 h-4 w-4" />
                                Lưu và xuất bản Quiz
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Question Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</DialogTitle>
                    </DialogHeader>

                    {renderQuestionForm()}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveQuestion} className="text-white">
                            {editingQuestion ? "Cập nhật" : "Thêm câu hỏi"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
