"use client";

import React, { useState, useCallback, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IDataQuiz, IHistory } from "@/types/type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import { renderContentWithLaTeX, renderHightlightedContent } from "@/components/renderCode";
// Constants
const AI_MODEL = "gemini-2.5-flash";

interface CAnswerProps {
    history: IHistory;
    question: IDataQuiz[];
}

export default function CAnswer({ history, question }: CAnswerProps) {
    const router = useRouter();
    const [loadingQuestionIndex, setLoadingQuestionIndex] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<number | null>(null);
    const [explain, setExplain] = useState<string | null>(null);
    // Memoized values
    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.API_KEY_AI || ""), []);

    const generateAIPrompt = useCallback((questionItem: any): string => {
        const basePrompt = `
            Giải thích câu trả lời.
            Yêu cầu: ngắn gọn xúc tích dễ hiểu, đúng vào trọng tâm, không lòng vòng.
            Không cần nói tóm lại, không cần nói lại câu hỏi và sự kì vọng ở cuối câu.
            Trả ra định dạng HTML có format rõ ràng.
        `;

        const questionContent = `
            Câu hỏi: ${questionItem.question}
            A: ${questionItem.answers[0]}
            B: ${questionItem.answers[1]}
            C: ${questionItem.answers[2]}
            D: ${questionItem.answers[3]}
            Đáp án đúng: ${questionItem.answers[Number(questionItem.correct)]}
        `;

        return questionContent + basePrompt;
    }, []);

    const handleExplainAnswer = useCallback(
        async (questionItem: IDataQuiz, questionIndex: number): Promise<void> => {
            try {
                setLoadingQuestionIndex(questionIndex);

                const model = genAI.getGenerativeModel({ model: AI_MODEL });
                const prompt = generateAIPrompt(questionItem);
                const result = await model.generateContent(prompt);

                const cleanedResponse = result.response
                    .text()
                    .replace(/```html/g, "")
                    .replace(/```/g, "");

                setExplain(cleanedResponse);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
                toast.error(`Không thể lấy giải thích`, {
                    description: errorMessage,
                    position: "top-center",
                    duration: 5000,
                });
                setShowExplanation(null);
            } finally {
                setLoadingQuestionIndex(null);
            }
        },
        [genAI, generateAIPrompt]
    );

    const toggleExplanation = (questionId: number) => {
        setExplain(null);
        setShowExplanation(showExplanation === questionId ? null : questionId);
        if (showExplanation === questionId) {
            setExplain(null);
            return;
        }
        handleExplainAnswer(question[questionId - 1], questionId);
    };

    // Loading state
    // if (!question.length) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <Spin size="large" />
    //         </div>
    //     );
    // }
    return (
        <div className="flex items-center justify-center dark:text-white/80 text-gray-400">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-16">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-500 dark:text-white/80">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại trang lịch sử
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Chi tiết từng câu hỏi</h1>
                </div>

                <div className="space-y-6">
                    {question &&
                        question.map((question: any) => (
                            <Card key={question.id} className="border border-transparent dark:border-white/10 shadow-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">
                                            Câu {question.id}: {renderHightlightedContent(question.question)}
                                        </CardTitle>
                                        <Badge
                                            variant={history.userAnswers[question.id] != null ? (history.userAnswers[question.id] == question.correct ? "default" : "destructive") : "outline"}
                                            className="text-white ml-4">
                                            {history.userAnswers[question.id] != null ? (history.userAnswers[question.id] == question.correct ? "Đúng" : "Sai") : "Chưa trả lời"}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.answers.map((option: any, index: number) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border-2 transition-colors flex items-center ${
                                                    index === Number(question.correct)
                                                        ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-800/50 dark:text-green-200 dark:border-green-700"
                                                        : index === Number(history.userAnswers[question.id]) && index !== Number(question.correct)
                                                        ? "border-red-500 bg-red-50 text-red-800 dark:bg-red-800/50 dark:text-red-200 dark:border-red-700"
                                                        : "border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50"
                                                }`}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold ml-2 mr-3">{String.fromCharCode(65 + Number(index))}</span>
                                                    <span>{renderContentWithLaTeX(option)}</span>
                                                    {Number(history.userAnswers[question.id]) === index && index === Number(question.correct) && (
                                                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto dark:text-green-200" />
                                                    )}
                                                    {Number(history.userAnswers[question.id]) === index && index !== Number(question.correct) && (
                                                        <XCircle className="h-4 w-4 text-red-600 ml-auto dark:text-red-200" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-start flex-col gap-2">
                                        <div className="relative group overflow-hidden">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleExplanation(question.id)}
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:text-white">
                                                {loadingQuestionIndex === question.id ? (
                                                    <Loading className="border-x-white" />
                                                ) : (
                                                    <Brain className="h-4 w-4 mr-2 transition-all duration-500 rotate-0 group-hover:rotate-180" />
                                                )}

                                                {showExplanation === question.id && explain ? "Ẩn giải thích" : "Giải thích bằng AI"}
                                            </Button>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                        </div>

                                        {showExplanation === question.id && explain && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/50 dark:border-blue-700">
                                                <div className="text-blue-800 dark:text-blue-200" dangerouslySetInnerHTML={{ __html: explain || "" }} />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    );
}
