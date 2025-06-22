"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, CheckCircle, Circle, AlertCircle, RefreshCcw, ReceiptText } from "lucide-react";
import { IQuiz, IDataQuiz } from "@/types/type";
import { POST_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import handleCompareDate from "@/lib/CompareDate";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function QuizExam(QuizData: IQuiz) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLimit, setTimeLimit] = useState(30); // Convert to seconds default 30 minutes
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds default 30 minutes
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [linkHistory, setLinkHistory] = useState("");
    const token = Cookies.get("token") || "";
    const router = useRouter();
    // Timer effect
    useEffect(() => {
        if (isQuizStarted && !isQuizCompleted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsQuizCompleted(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isQuizStarted, isQuizCompleted, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [Number(questionId)]: answerId,
        }));
    };

    const getQuestionStatus = (questionIndex: number) => {
        const questionId = Number(QuizData.questions.data_quiz[questionIndex].id);
        if (answers[questionId]) return "answered";
        if (questionIndex === currentQuestion) return "current";
        return "unanswered";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "answered":
                return "bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white";
            case "current":
                return "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 text-white";
            default:
                return "bg-gray-200 dark:bg-gray-300 hover:bg-gray-300 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "answered":
                return <CheckCircle className="w-4 h-4" />;
            case "current":
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Circle className="w-4 h-4" />;
        }
    };

    const calculateScore = () => {
        let correct = 0;
        QuizData.questions.data_quiz.forEach((question: IDataQuiz) => {
            console.log(answers[Number(question.id)]);
            if (answers[Number(question.id)] == question.correct) {
                correct++;
            }
        });
        return correct;
    };

    const handleSubmitQuiz = async () => {
        setIsQuizCompleted(true);
        setLoading(true);

        const historyData = {
            quiz_id: QuizData._id,
            score: calculateScore(),
            total_questions: QuizData.questions.data_quiz.length,
            time: timeLimit * 60 - timeLeft,
            userAnswers: answers,
        };
        try {
            const req = await POST_API("/history", historyData, "POST", token);
            if (req) {
                const data = await req.json();
                if (req.ok) {
                    toast.success(data?.message);
                    setLinkHistory(data?.id_history);
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi nộp bài quiz", {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
            });
        } finally {
            setLoading(false);
        }
    };

    const progress = ((currentQuestion + 1) / QuizData?.questions?.data_quiz?.length) * 100;

    if (!isQuizStarted) {
        return (
            <div className="min-h-screen ">
                <div className="max-w-2xl bg-white rounded-xl dark:bg-slate-900/50 mx-auto">
                    <Card className="shadow-xl">
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{QuizData.title}</CardTitle>
                            <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-300 mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{QuizData.uid?.displayName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {QuizData?.date && <span>{handleCompareDate(QuizData?.date)}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{timeLimit} phút</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg mb-6 dark:bg-blue-800/50">
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Thông tin bài quiz:</h3>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>
                                        • Số câu hỏi: <span className="font-medium">{QuizData.questions?.data_quiz.length}</span>
                                    </li>
                                    <li>
                                        • Thời gian làm bài: <span className="font-medium">{timeLimit}</span> phút (có thể chỉnh)
                                    </li>
                                    <li>• Loại: Trắc nghiệm nhiều lựa chọn</li>
                                </ul>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center w-full flex items-center justify-center flex-col gap-3">
                            <Select defaultValue="30" onValueChange={(value) => setTimeLimit(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Chọn thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn thời gian phù hợp</SelectLabel>
                                        <SelectItem value="5">5 phút</SelectItem>
                                        <SelectItem value="10">10 phút</SelectItem>
                                        <SelectItem value="15">15 phút</SelectItem>
                                        <SelectItem value="20">20 phút</SelectItem>
                                        <SelectItem value="30">30 phút</SelectItem>
                                        <SelectItem value="45">45 phút</SelectItem>
                                        <SelectItem value="60">60 phút</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => {
                                    setIsQuizStarted(true);
                                    setTimeLeft(timeLimit * 60);
                                }}
                                size="lg"
                                className="px-8 py-3 text-lg font-semibold text-white">
                                Bắt đầu làm bài
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isQuizCompleted) {
        const score = calculateScore();
        const percentage = Math.round((score / QuizData.questions?.data_quiz?.length) * 100);

        return (
            <div className="min-h-screen  p-4">
                <div className="max-w-2xl mx-auto pt-20">
                    <Card className="shadow-xl">
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-3xl font-bold text-gray-800 mb-4">Kết quả bài quiz</CardTitle>
                            <div className="text-6xl font-bold text-blue-600 mb-4">{percentage}%</div>
                            <p className="text-xl text-gray-600 mb-6">
                                Bạn đã trả lời đúng {score}/{QuizData.questions?.data_quiz?.length} câu
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Chi tiết:</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        Câu đúng: <span className="font-semibold text-green-600">{score}</span>
                                    </div>
                                    <div>
                                        Câu sai: <span className="font-semibold text-red-600">{QuizData.questions?.data_quiz?.length - score}</span>
                                    </div>
                                    <div>
                                        Thời gian còn lại: <span className="font-semibold">{formatTime(timeLeft)}</span>
                                    </div>
                                    <div>
                                        Tỷ lệ: <span className="font-semibold text-blue-600">{percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className=" flex items-center gap-2 justify-center">
                            <Button
                                onClick={() => {
                                    setCurrentQuestion(0);
                                    setAnswers({});
                                    setTimeLeft(timeLimit * 60);
                                    setIsQuizStarted(false);
                                    setIsQuizCompleted(false);
                                }}
                                size="lg"
                                className="px-8 py-3 text-lg font-semibold">
                                <RefreshCcw />
                                Làm lại
                            </Button>
                            <Button size="lg" className="px-8 py-3 text-lg font-semibold" onClick={() => router.push("/dapan/" + linkHistory)} disabled={loading}>
                                <ReceiptText />
                                Xem chi tiết bài
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentQ = QuizData.questions.data_quiz[currentQuestion];
    return (
        <div className="min-h-screen px-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800/50 shadow-sm border rounded-xl dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{QuizData.title}</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tác giả: {QuizData.uid?.displayName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`px-3 py-1 ${timeLeft <= 60 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(timeLeft)}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                                {currentQuestion + 1}/{QuizData.questions?.data_quiz?.length}
                            </Badge>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            <div className=" py-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    Câu {currentQuestion + 1}: {currentQ?.question}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {currentQ?.answers.map((option: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAnswerSelect(currentQ.id, index.toString())}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                answers[Number(currentQ.id)] === index.toString()
                                                    ? "border-blue-500 bg-blue-50 dark:border-blue-300 dark:bg-blue-800"
                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                            }`}>
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                                        answers[Number(currentQ.id)] === index.toString()
                                                            ? "bg-blue-500 dark:bg-blue-200 dark:text-blue-800 text-white"
                                                            : "bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-800 leading-relaxed dark:text-gray-300">{option}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-8">
                                    <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
                                        Câu trước
                                    </Button>

                                    {currentQuestion === QuizData.questions.data_quiz.length - 1 ? (
                                        <Button onClick={() => handleSubmitQuiz()} className="bg-green-600 hover:bg-green-700">
                                            Hoàn thành
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setCurrentQuestion(Math.min(QuizData.questions.data_quiz.length - 1, currentQuestion + 1))}
                                            className="dark:text-white"
                                            disabled={currentQuestion === QuizData.questions.data_quiz.length - 1}>
                                            Câu tiếp theo
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg sticky top-4 dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Danh sách câu hỏi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-12 lg:grid-cols-5 gap-2 max-h-[250px] overflow-scroll">
                                    {QuizData?.questions &&
                                        QuizData?.questions.data_quiz.map((_, index) => {
                                            const status = getQuestionStatus(index);
                                            return (
                                                <Button key={index} variant="outline" size="sm" onClick={() => setCurrentQuestion(index)} className={`h-10 w-10 p-0 ${getStatusColor(status)}`}>
                                                    <span className="sr-only">{getStatusIcon(status)}</span>
                                                    {index + 1}
                                                </Button>
                                            );
                                        })}
                                </div>

                                <div className="mt-6 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                                        <span>Đã trả lời</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></div>
                                        <span>Câu hiện tại</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-300 rounded"></div>
                                        <span>Chưa trả lời</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <div>
                                            Đã trả lời: <span className="font-semibold">{Object.keys(answers).length}</span>
                                        </div>
                                        <div>
                                            Còn lại: <span className="font-semibold">{QuizData.questions?.data_quiz?.length - Object.keys(answers).length}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
