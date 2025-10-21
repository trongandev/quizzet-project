"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Play, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface QuizSubject {
    id: string;
    title: string;
    description: string;
    totalQuestions: number;
    image: string;
    category: string;
}

const subjects: QuizSubject[] = [
    {
        id: "history",
        title: "Lịch sử đảng",
        description: "Lịch sử Đảng Cộng sản Việt Nam",
        totalQuestions: 999,
        image: "https://nodemy.vn/wp-content/uploads/2023/04/Untitled-1-17-1024x576.png",
        category: "Lịch sử",
    },
    {
        id: "javascript",
        title: "Lập trình hướng đối tượng",
        description: "Lập trình hướng đối tượng trong JavaScript",
        totalQuestions: 89,
        image: "https://nodemy.vn/wp-content/uploads/2023/04/Untitled-1-17-1024x576.png",
        category: "Lập trình",
    },
    {
        id: "database",
        title: "Cơ sở dữ liệu nâng cao",
        description: "Kiến thức chuyên sâu về cơ sở dữ liệu",
        totalQuestions: 289,
        image: "https://images.vnuhcmpress.edu.vn/Picture/2023/5/18/image-20230518110537316.jpg",
        category: "Cơ sở dữ liệu",
    },
];

const questionOptions = [5, 10, 15, 20, 25, 30, 50];
const timeOptions = [5, 10, 15, 20, 30, 45, 60, 90, 120];
export default function NganHang() {
    const [input, setInput] = useState<number>(10);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [questionCount, setQuestionCount] = useState<{ [key: string]: number }>({});
    const [timeLimit, setTimeLimit] = useState<{ [key: string]: number }>({});

    const handleQuestionCountChange = (subjectId: string, count: number) => {
        setQuestionCount((prev) => ({ ...prev, [subjectId]: count }));
    };

    const handleTimeLimitChange = (subjectId: string, time: number) => {
        setTimeLimit((prev) => ({ ...prev, [subjectId]: time }));
    };

    const handleStartQuiz = (subject: QuizSubject) => {
        const questions = questionCount[subject.id] || 10;
        const time = timeLimit[subject.id] || 15;
    };
    return (
        <div className="flex items-center justify-center dark:text-white/80 text-gray-400">
            <div className="w-full md:w-[1000px] xl:w-[1200px] ">
                <div className="p-2 md:px-5 py-20 flex flex-col gap-5 min-h-screen">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-800 mb-4 dark:text-slate-200">Ngân hàng câu hỏi</h1>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto dark:text-slate-400">
                            Bạn có thể làm bài thi với số lượng câu hỏi tùy chỉnh (5, 10, 15, 20, 30 câu...). Thời gian tùy chỉnh tùy theo nhu cầu. Câu hỏi được lấy ngẫu nhiên từ ngân hàng câu hỏi của
                            bộ môn tương ứng và được sắp xếp ngẫu nhiên.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                                <div className="relative">
                                    <Image src={subject.image || "/placeholder.svg"} alt={subject.title} width={300} height={200} className="w-full h-48 object-cover" />
                                    <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-700">
                                        {subject.category}
                                    </Badge>
                                </div>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 dark:text-slate-200">{subject.title}</CardTitle>
                                    <p className="text-sm text-slate-600 line-clamp-2  dark:text-slate-400">{subject.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500  dark:text-slate-300">
                                        <FileText className="h-4 w-4" />
                                        <span>Gồm {subject.totalQuestions} câu hỏi</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor={`questions-${subject.id}`} className="text-xs font-medium text-slate-600  dark:text-slate-400">
                                                Số câu hỏi
                                            </Label>
                                            <Select defaultValue="10" onValueChange={(value) => handleQuestionCountChange(subject.id, Number.parseInt(value))}>
                                                <SelectTrigger className="mt-1 h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {questionOptions
                                                        .filter((option) => option <= subject.totalQuestions)
                                                        .map((option) => (
                                                            <SelectItem key={option} value={option.toString()}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor={`time-${subject.id}`} className="text-xs font-medium text-slate-600  dark:text-slate-400">
                                                Thời gian (phút)
                                            </Label>
                                            <Select defaultValue="15" onValueChange={(value) => handleTimeLimitChange(subject.id, Number.parseInt(value))}>
                                                <SelectTrigger className="mt-1 h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeOptions.map((option) => (
                                                        <SelectItem key={option} value={option.toString()}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button onClick={() => handleStartQuiz(subject)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5">
                                        <Play className="h-4 w-4 mr-2" />
                                        Bắt đầu làm bài
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
