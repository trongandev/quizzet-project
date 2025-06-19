"use client";

import React, { useState, useCallback, useMemo } from "react";
import { message, Progress, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BsQuestion } from "react-icons/bs";
import Swal from "sweetalert2";

// Constants
const AI_MODEL = "gemini-1.5-flash";
const ANSWER_LABELS = ["A", "B", "C", "D"] as const;

// Types
interface QuizResult {
    id: string;
    quiz_id?: {
        title: string;
        content: string;
    };
    score: number;
    time: number;
    questions?: {
        data_history: any[];
    };
}

interface QuestionItem {
    id: string;
    question_name: string;
    question: string;
    answers: string[];
    answer_correct: number;
    answer_choose: number;
    correct: number;
}

interface CAnswerProps {
    quiz: QuizResult;
    question: QuestionItem[];
}

// Utility functions
const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h:${minutes}p:${seconds}s`;
};

const calculateAccuracyPercentage = (correctAnswers: number, totalQuestions: number): number => {
    return Math.floor((correctAnswers / totalQuestions) * 100);
};

const calculateErrorPercentage = (correctAnswers: number, totalQuestions: number): number => {
    const wrongAnswers = totalQuestions - correctAnswers;
    return Math.floor((wrongAnswers / totalQuestions) * 100);
};

export default function CAnswer({ quiz, question: questionList }: CAnswerProps) {
    const [loadingQuestionIndex, setLoadingQuestionIndex] = useState<number | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    // Memoized values
    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY_AI || ""), []);

    const statisticsData = useMemo(
        () => ({
            totalQuestions: questionList?.length || 0,
            correctAnswers: quiz?.score || 0,
            wrongAnswers: (questionList?.length || 0) - (quiz?.score || 0),
            accuracyPercentage: calculateAccuracyPercentage(quiz?.score || 0, questionList?.length || 1),
            errorPercentage: calculateErrorPercentage(quiz?.score || 0, questionList?.length || 1),
            formattedTime: formatTime(quiz?.time || 0),
        }),
        [quiz?.score, quiz?.time, questionList?.length]
    );

    const generateAIPrompt = useCallback((questionItem: QuestionItem): string => {
        const basePrompt = `
            Giải thích lựa chọn câu nào, tại sao lại lựa chọn.
            Yêu cầu: ngắn gọn xúc tích dễ hiểu, đúng vào trọng tâm, không lòng vòng.
            Không cần nói tóm lại, không cần nói lại sự kì vọng ở cuối câu.
            Trả ra định dạng HTML có format rõ ràng.
        `;

        const questionContent = `
            Câu hỏi: ${questionItem.question}
            A: ${questionItem.answers[0]}
            B: ${questionItem.answers[1]}
            C: ${questionItem.answers[2]}
            D: ${questionItem.answers[3]}
            Đáp án đúng: ${questionItem.answers[questionItem.correct]}
        `;

        return questionContent + basePrompt;
    }, []);

    const handleExplainAnswer = useCallback(
        async (questionItem: QuestionItem, questionIndex: number): Promise<void> => {
            try {
                setLoadingQuestionIndex(questionIndex);

                const model = genAI.getGenerativeModel({ model: AI_MODEL });
                const prompt = generateAIPrompt(questionItem);
                const result = await model.generateContent(prompt);

                const cleanedResponse = result.response
                    .text()
                    .replace(/```html/g, "")
                    .replace(/```/g, "");

                await Swal.fire({
                    title: "Giải thích đáp án",
                    html: cleanedResponse,
                    icon: "info",
                    confirmButtonText: "Đã hiểu",
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
                messageApi.error(`Không thể tạo giải thích: ${errorMessage}`);
            } finally {
                setLoadingQuestionIndex(null);
            }
        },
        [genAI, generateAIPrompt, messageApi]
    );

    const renderAnswerOption = useCallback((answer: string, answerIndex: number, questionItem: QuestionItem, questionIndex: number) => {
        const isCorrectAnswer = questionItem.answer_correct === answerIndex;
        const isChosenAnswer = questionItem.answer_choose === answerIndex;
        const answerLabel = ANSWER_LABELS[answerIndex];

        const getLabelClassName = (): string => {
            if (isCorrectAnswer) return "!bg-primary !text-white";
            if (isChosenAnswer) return "!bg-red-500 text-white";
            return "";
        };

        return (
            <div key={answerIndex} className={`relative flex items-center ${isCorrectAnswer ? "text-primary font-bold" : ""}`}>
                <input type="radio" name={`question-${questionItem.id}`} className="w-1 invisible" disabled id={`question-${questionIndex}-answer-${answerIndex}`} defaultChecked={isCorrectAnswer} />
                <label htmlFor={`question-${questionIndex}-answer-${answerIndex}`} className={`absolute font-bold w-10 h-10 flex items-center justify-center rounded-lg ${getLabelClassName()}`}>
                    {answerLabel}
                </label>
                <label htmlFor={`question-${questionIndex}-answer-${answerIndex}`} className="block w-full ml-10 p-3 cursor-pointer">
                    {answer}
                </label>
            </div>
        );
    }, []);

    // Loading state
    if (!questionList?.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="px-3 md:px-0 text-third dark:text-white min-h-[80vh]">
                {/* Quiz Header */}
                <div className="flex justify-between flex-col md:flex-row gap-5 md:gap-0 mb-8">
                    <div className="space-y-2">
                        {quiz?.quiz_id && (
                            <>
                                <h1 className="text-2xl font-bold text-primary">Bài quiz về chủ đề: {quiz.quiz_id.title}</h1>
                                <p className="text-secondary dark:text-white/70">Nội dung: {quiz.quiz_id.content}</p>
                            </>
                        )}
                        <p className="font-medium">
                            Tổng số câu đúng: {statisticsData.correctAnswers}/{statisticsData.totalQuestions} câu
                        </p>
                        <p className="font-medium">Tổng thời gian làm: {statisticsData.formattedTime}</p>
                    </div>

                    {/* Statistics */}
                    <div className="flex gap-5 text-center justify-center">
                        <div>
                            <Progress type="circle" percent={statisticsData.errorPercentage} strokeColor="#ff4d4f" size={80} />
                            <p className="text-gray-600 dark:text-white/70 mt-1">Câu sai: {statisticsData.wrongAnswers}</p>
                        </div>
                        <div>
                            <Progress type="circle" percent={statisticsData.accuracyPercentage} strokeColor="#2187d5" size={80} />
                            <p className="text-gray-600 dark:text-white/70 mt-1">Câu đúng: {statisticsData.correctAnswers}</p>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-5">
                    {questionList.map((questionItem, questionIndex) => {
                        const isCorrectAnswer = questionItem.answer_correct === questionItem.answer_choose;

                        return (
                            <div key={questionItem.id} className="bg-linear-item-2 p-5 border border-white/10 rounded-md">
                                {/* Question Header */}
                                <div className={`mb-3 flex gap-2 items-center ${isCorrectAnswer ? "text-primary" : "text-red-500"}`}>
                                    <h2 className="text-lg font-bold">
                                        Câu {questionIndex + 1}: {questionItem.question_name}
                                    </h2>
                                    <span className={`text-white px-3 rounded-md text-xs ${isCorrectAnswer ? "bg-primary" : "bg-red-500"}`}>{isCorrectAnswer ? "Đúng" : "Sai"}</span>
                                </div>

                                {/* AI Explain Button */}
                                <button
                                    disabled={loadingQuestionIndex === questionIndex}
                                    className="flex items-center gap-1 btn btn-primary !py-1 text-xs mb-3"
                                    onClick={() => handleExplainAnswer(questionItem, questionIndex)}
                                    aria-label={`Giải thích câu ${questionIndex + 1} bằng AI`}>
                                    {loadingQuestionIndex === questionIndex ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : <BsQuestion />}
                                    Giải thích bằng AI
                                </button>

                                {/* Answer Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {questionItem.answers?.map((answer, answerIndex) => renderAnswerOption(answer, answerIndex, questionItem, questionIndex))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
