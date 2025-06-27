"use client";
import React from "react";

import Link from "next/link";
import "@/app/globals.css";
import CTaiLieu from "@/components/CTaiLieu";
import CQuiz from "./CQuiz";
import { IListFlashcard, IQuiz, ISO } from "@/types/type";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Chrome, FileText, Github, Info, Save, Star, TrendingUp, Users, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import PublicFCHome from "./flashcard/PublicFCHome";
import { useRouter } from "next/navigation";

export default function CHome({ quizData, toolData, publicFlashcards }: { quizData: IQuiz[]; toolData: ISO[]; publicFlashcards: IListFlashcard[] }) {
    const router = useRouter();
    return (
        <div className="">
            <div className="px-2  dark:text-white">
                <div className="text-gray-700 dark:text-white text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className="font-bold text-3xl md:text-5xl ">
                        Chào mừng bạn đến với <span className="bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-500 dark:to-purple-500 text-transparent bg-clip-text">Quizzet</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-[14px] md:text-lg">
                        Nền tảng học tập thông minh giúp bạn nâng cao kiến thức thông qua flashcard, quiz và đề cương chất lượng cao. Học tập hiệu quả, tiến bộ mỗi ngày.
                    </p>
                </div>
                {/* <div className="my-2 flex gap-5 items-center justify-center">
                    {notice &&
                        notice.map((item) => (
                            <Link href={item?.link || "#"} className="bg-third px-3 py-1 rounded-md text-white" key={item?._id}>
                                <p>{item?.title}</p>
                            </Link>
                        ))}
                </div> */}
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 mt-10">
                    {/* Flashcard */}
                    <Card
                        onClick={() => router.push("/flashcard")}
                        className="cursor-pointer dark:border-white/10 group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-0 dark:border  dark:from-blue-900/50 dark:to-purple-900/50 dark:hover:from-blue-900 dark:hover:to-purple-900 overflow-hidden relative hover:scale-105 ">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                        <CardContent className="p-5 md:p-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-white rotate-0 group-hover:rotate-180 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 dark:text-slate-200">Flashcard</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed break-words dark:text-slate-400 line-clamp-3">
                                Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Học thông minh với hệ thống lặp lại ngắt quãng.
                            </p>
                            <div className="flex items-center justify-between">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Tìm hiểu thêm</Button>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Phổ biến
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quiz */}
                    <Card
                        onClick={() => router.push("/quiz")}
                        className="cursor-pointer dark:border-white/10 group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 dark:border  dark:from-cyan-900/50 dark:to-blue-900/50 dark:hover:from-cyan-900 dark:hover:to-blue-900 overflow-hidden relative hover:scale-105 ">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                        <CardContent className="p-5 md:p-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-8 h-8 text-white  rotate-0 group-hover:rotate-180 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 dark:text-slate-200">Quiz</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân. Thử thách bản thân và cải thiện kết quả học tập.
                            </p>
                            <div className="flex items-center justify-between">
                                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">Tìm hiểu thêm</Button>
                                <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-200">
                                    <Star className="w-3 h-3 mr-1" />
                                    Thú vị
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Đề cương */}
                    <Card
                        onClick={() => router.push("/decuong")}
                        className="cursor-pointer dark:border-white/10 group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:border  dark:from-purple-900/50 dark:to-pink-900/50 dark:hover:from-purple-900 dark:hover:to-pink-900 overflow-hidden relative hover:scale-105 ">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                        <CardContent className="p-5 md:p-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-white  rotate-0 group-hover:rotate-180 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 dark:text-slate-200">Đề cương</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Tổng hợp những đề cương của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất. Chuẩn bị tốt cho mọi kỳ thi.
                            </p>
                            <div className="flex items-center justify-between">
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">Tìm hiểu thêm</Button>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200">
                                    <Users className="w-3 h-3 mr-1" />
                                    Cộng đồng
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Public Flashcards */}
                <PublicFCHome publicFlashcards={publicFlashcards} />
                <div className="my-5 mt-10">
                    <CQuiz quizData={quizData} />
                </div>
                <div className="">
                    <CTaiLieu toolData={toolData} />
                </div>
                <div className="mt-10 bg-gradient-to-r from-emerald-200/80 to-lime-200/80 dark:from-emerald-800/50 dark:to-lime-800/50 pt-5 rounded-xl shadow-md border border-gray-300 dark:border-white/10 overflow-hidden">
                    <div className="flex items-center justify-center flex-col gap-3  px-3">
                        <Badge className="flex gap-2 items-center bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                            <Chrome />
                            Extension mới
                        </Badge>
                        <h2 className="text-2xl text-center md:text-4xl font-bold text-gray-700 dark:text-gray-200">
                            Học từ vựng thông minh với <span className="text-emerald-600">Extension Dịch Thuật</span>
                        </h2>
                        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
                            Biến việc lướt web thành cơ hội học tập! Dịch từ vựng ngay lập tức và tự động lưu vào flashcard cá nhân.
                        </p>
                    </div>
                    {/* feature grid */}
                    <div className="grid md:grid-cols-3 gap-3 md:gap-8 px-5 mt-3">
                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 dark:text-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Dịch Tức Thì</h3>
                                <p className="text-gray-600 dark:text-gray-400">Chỉ cần bôi đen từ vựng, nghĩa tiếng Việt hiện ngay lập tức. Hỗ trợ nhiều ngôn ngữ phổ biến.</p>
                            </CardContent>
                        </Card>

                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 dark:text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Save className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Lưu Từ Thông Minh</h3>
                                <p className="text-gray-600 dark:text-gray-400">Gặp từ hay? Một cú click là lưu ngay! Không bao giờ quên những từ vựng quan trọng nữa.</p>
                            </CardContent>
                        </Card>

                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 dark:text-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Flashcard Tự Động</h3>
                                <p className="text-gray-600 dark:text-gray-400">Từ vựng đã lưu tự động chuyển thành flashcard, đồng bộ với tài khoản Quizzet của bạn.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-center">
                        <div className="dark:bg-slate-800/20 mt-5 p-8 text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">Sẵn sàng nâng cao trải nghiệm học từ vựng?</h3>
                            <p className="text-emerald-700 dark:text-emerald-100 mb-6 max-w-2xl mx-auto text-md">
                                Tải extension ngay hôm nay và biến mọi trang web thành lớp học từ vựng của riêng bạn!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="https://github.com/trongandev/translate-quizzet-extension">
                                    <Button
                                        size="lg"
                                        className="bg-white dark:bg-emerald-800/50 dark:text-emerald-200 text-emerald-600 hover:scale-105 transition-transform duration-300 hover:bg-white/90">
                                        <Github className="w-5 h-5 mr-2" />
                                        Tải về từ Github
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/extension">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="dark:border-emerald-200/50 text-emerald-600 dark:bg-transparent dark:hover:bg-transparent hover:text-emerald-500 dark:text-emerald-200 hover:scale-105 transition-transform duration-300">
                                        <Info />
                                        Xem thêm thông tin
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6 text-emerald-600 dark:text-emerald-100 ">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Miễn phí 100%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Không quảng cáo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Đồng bộ tài khoản</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
