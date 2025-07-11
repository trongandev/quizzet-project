"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { BookOpen, Clock, Search, Star, Target, Zap } from "lucide-react";
import { ISO } from "@/types/type";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Loading from "../ui/loading";

export default function CDeCuongDetail({ DeCuongData }: { DeCuongData: ISO | null }) {
    const [searchQuery, setSearchQuery] = useState("");
    // const [selectedRating, setSelectedRating] = useState(0);
    // const [reviewText, setReviewText] = useState("");
    // const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const handleChangeRouterDeCuong = async () => {
            await GET_API_WITHOUT_COOKIE(`/so/view/${DeCuongData?._id}`);
        };
        handleChangeRouterDeCuong();
    }, []);
    const filteredQuestions = DeCuongData?.quest?.data_so.filter((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-20 min-h-screen">
                <div className="text-third px-2 md:px-0 dark:text-white">
                    {/* Hero Section */}
                    <div className="mb-8">
                        <div className="bg-white/20  rounded-xl p-8 border border-white/20 shadow-xl dark:bg-gray-800/50 dark:border-white/10">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                                                {DeCuongData?.title}
                                            </h1>
                                            <p className="text-gray-600 mt-1 dark:text-gray-500">Bộ đề môn học</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-800 px-4 py-2 rounded-full">
                                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{DeCuongData?.lenght} câu hỏi</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-800 px-4 py-2 rounded-full">
                                            <Clock className="w-4 h-4 text-green-600 dark:text-green-200" />
                                            <span className="text-sm font-medium text-green-800 dark:text-green-300">~2 giờ học</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-800 px-4 py-2 rounded-full">
                                            <Star className="w-4 h-4 text-purple-600 dark:text-purple-200" />
                                            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">4.8/5 đánh giá</span>
                                        </div>
                                    </div>
                                    <div className="relative flex-1 max-w-md">
                                        <Input placeholder="Tìm kiếm câu hỏi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 z-1" />
                                    </div>
                                </div>

                                <Link href={`/decuong/flashcard/${DeCuongData?._id}`} className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Học bằng Flashcard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {filteredQuestions &&
                            filteredQuestions.map((question, index) => (
                                <Card
                                    key={question._id}
                                    className="group hover:shadow-lg transition-all duration-200 bg-white/20 border-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:border-white/10 rounded-xl">
                                    <CardHeader className="pb-3">
                                        <div className="flex">
                                            <div className="flex-1 flex items-start gap-3">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white/60 leading-relaxed">{question.question}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl p-4 border border-blue-100 dark:border-white/10">
                                            <p className="text-blue-800 dark:text-blue-200 font-medium">{question.answer}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        {!DeCuongData && (
                            <div className="h-[400px] flex items-center justify-center w-full p-5 mt-2">
                                <Loading />
                            </div>
                        )}
                    </div>
                    {/* <div className="flex justify-between items-center">
                        <div className="">
                            <h1 className="text-2xl ">
                                Bộ đề môn: <label className="text-primary font-bold ">{DeCuongData?.title}</label>
                            </h1>
                            <p>
                                Tổng: <label className="text-secondary dark:text-gray-300 font-bold ">{DeCuongData?.lenght} câu hỏi</label>
                            </p>
                        </div>
                        <Link href={`/decuong/flashcard/${DeCuongData?._id}`} className="flex gap-2 items-center !rounded-md">
                            <GiCardPick size={20} />
                            Luyện tập bằng Flashcard
                        </Link>
                    </div>
                    <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                        {DeCuongData &&
                            DeCuongData?.quest?.data_so.map((item, index) => (
                                <div className=" bg-linear-item-2 rounded-xl border border-white/20  p-5" key={index}>
                                    <h1 className=" font-bold text-lg dark:text-white/80">
                                        Câu {index + 1}: {item.question.replace("Câu ", "")}
                                    </h1>

                                    <p className="text-secondary  dark:text-white/70">{item.answer}</p>
                                </div>
                            ))}
                    </div>
                    {!DeCuongData && (
                        <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                            <Spin indicator={<LoadingOutlined spin />} size="large" />
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}
