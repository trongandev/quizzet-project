"use client"
import React, { useEffect, useRef, useState } from "react"

import Link from "next/link"
import "@/app/globals.css"
import CQuiz from "./quiz/CQuiz"
import { IListFlashcard, IQuiz } from "@/types/type"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Brain, Chrome, Sparkles, FileText, Github, Save, Zap, X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import PublicFCHome from "./flashcard/PublicFCHome"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Cookies from "js-cookie"
import { useUser } from "@/context/userContext"
export default function CHome({ quizData, publicFlashcards }: { quizData: IQuiz[]; publicFlashcards: IListFlashcard[] }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const { refetchUser } = useUser() || {}
    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("newMember", "true") // Lưu trạng thái đã xem
    }

    useEffect(() => {
        const newMember = localStorage.getItem("newMember")
        if (!newMember) {
            setIsOpen(true)
        }
    }, [])

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.play()
                } catch (error) {
                    console.log("Video autoplay was prevented:", error)
                    // Fallback: User cần interact trước
                }
            }
        }

        // Delay một chút để đảm bảo video đã load
        const timer = setTimeout(playVideo, 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")

        if (token) {
            try {
                Cookies.set("token", token, {
                    expires: 30,
                    secure: true,
                    sameSite: "none",
                })
                refetchUser?.()
                router.replace("/")
            } catch (e) {
                console.warn("Failed to save cookie:", e)
            }
        }
    }, [router])

    const introFeatures = [
        {
            title: "Tạo Flashcard bằng AI",
            description: "Chỉ cần nhập từ vựng, AI sẽ tự động tạo thẻ lật với định nghĩa, ví dụ và hình ảnh minh họa.",
            icon: <BookOpen className="w-8 h-8 text-white" />,
            link: "/flashcard",
            cta: "Tạo Flashcard ngay",
            gradient: "from-blue-500 to-purple-600",
            embed: "https://demo.arcade.software/VEOX7fL248JaEgeFmRtK?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true",
        },
        {
            title: "Quiz AI",
            description: "Tạo quiz thông minh với AI. Hệ thống quiz tự động điều chỉnh độ khó dựa trên prompt của bạn.",
            icon: <Brain className="w-8 h-8 text-white" />,
            link: "/ai-center",
            cta: "Tạo Quiz ngay",
            gradient: "from-cyan-500 to-blue-600",
            embed: "https://demo.arcade.software/zxjxwTDfQK8IAD91LsrX?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true",
        },
        {
            title: "Đề cương học tập",
            description: "Tổng hợp đề cương của nhiều môn học, giúp bạn ôn tập hiệu quả và chuẩn bị tốt cho kỳ thi.",
            icon: <FileText className="w-8 h-8 text-white" />,
            link: "/decuong",
            cta: "Xem Đề cương",
            gradient: "from-purple-500 to-pink-600",
            embed: "https://demo.arcade.software/4cxqqq721iga7KmMpcGQ?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true",
        },
    ]
    return (
        <div className="text-gray-700">
            <div className="px-2  dark:text-white space-y-20">
                <div className=" dark:text-white text-center space-y-7 px-5 md:p-0 w-full md:w-[700px] lg:w-[900px] mx-auto">
                    <h1 className="font-bold text-3xl md:text-5xl ">
                        Chào mừng bạn đến với <span className="bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-500 dark:to-purple-500 text-transparent bg-clip-text">Quizzet</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-[14px] md:text-lg">Nền tảng học tập dựa trên sức mạnh AI, tạo nhanh thẻ lật, bài trắc nghiệm cực đơn giản chỉ vài cú click</p>
                </div>

                {introFeatures.map((feature, index) => (
                    <div className={`text-center flex flex-1 ${index == 1 && "flex-row-reverse"} gap-10`} key={index}>
                        <div
                            style={{
                                position: "relative",
                                paddingBottom: "calc(50.520833333333336% + 41px)",
                                height: 0,
                                width: "100%",
                            }}
                        >
                            <iframe
                                src={feature.embed}
                                title="Tạo bộ flashcard mới để học từ vựng"
                                frameBorder="0"
                                loading="lazy"
                                allowFullScreen
                                allow="clipboard-write"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    colorScheme: "light",
                                }}
                            />
                        </div>
                        <div className="w-[400px] flex justify-center flex-col gap-3">
                            <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient}  rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mx-auto`}>{feature.icon}</div>
                            <h1 className="font-semibold text-2xl">{feature.title}</h1>
                            <p className="text-gray-500 dark:text-white/60">{feature.description}</p>
                            <Link href={feature.link} className="block mt-3 w-full hover:scale-105">
                                <Button variant="secondary" className={`bg-gradient-to-r ${feature.gradient} h-10 text-white`}>
                                    {feature.cta} <ArrowRight />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Public Flashcards */}
                <PublicFCHome publicFlashcards={publicFlashcards} />
                <div className="my-5 mt-10">
                    <CQuiz quizData={quizData} />
                </div>
                {/* <div className="mb-10">
                    <CDeCuongTypeText findText={findText} />
                </div>
                <DeCuongTypeFile findFile={findFile} /> */}
                <div className="mt-10 bg-gradient-to-r from-emerald-200/80 to-lime-200/80 dark:from-emerald-800/50 dark:to-lime-800/50 pt-5 rounded-xl shadow-md border border-gray-300 dark:border-white/10 overflow-hidden">
                    <div className="flex items-center justify-center flex-col gap-3  px-3">
                        <Badge className="flex gap-2 items-center bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                            <Chrome />
                            Extension mới
                        </Badge>
                        <h2 className="text-2xl text-center md:text-4xl font-bold text-gray-700 dark:text-gray-200">
                            Học từ vựng thông minh với <span className="text-emerald-600">Extension Dịch Thuật</span>
                        </h2>
                        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">Biến việc lướt web thành cơ hội học tập! Dịch từ vựng ngay lập tức và tự động lưu vào flashcard cá nhân.</p>
                    </div>
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
                            <p className="text-emerald-700 dark:text-emerald-100 mb-6 max-w-2xl mx-auto text-md">Tải extension ngay hôm nay và biến mọi trang web thành lớp học từ vựng của riêng bạn!</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="https://github.com/trongandev/translate-quizzet-extension">
                                    <Button size="lg" className="bg-white dark:bg-emerald-800/50 dark:text-emerald-200 text-emerald-600 hover:scale-105 transition-transform duration-300 hover:bg-white/90">
                                        <Github className="w-5 h-5 mr-2" />
                                        Tải về từ Github
                                        <ArrowRight className="w-4 h-4 ml-2" />
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
                <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[700px] overflow-y-auto">
                        <DialogHeader className="relative">
                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-center space-x-2">
                                    <Sparkles className="w-6 h-6 text-blue-400" />
                                    <DialogTitle className="text-2xl font-bold">
                                        Chào mừng đến với <span className="text-blue-400">Quizzet</span>!
                                    </DialogTitle>
                                    <Sparkles className="w-6 h-6 text-blue-400" />
                                </div>
                                <p className="text-slate-300">Bấm vào để khám phá những tính năng</p>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Features List */}
                            <div className="space-y-4">
                                <div className="px-4 pt-2 rounded-lg dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-700 ">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1" className="border-b-transparent">
                                            <AccordionTrigger className="flex items-start space-x-4 !no-underline">
                                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex items-start flex-col  mb-1">
                                                    <div className="flex gap-2">
                                                        <h3 className="font-semibold">Flashcard AI</h3>
                                                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30 ">
                                                            Phổ biến
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-300">Hệ thống flashcard tạo từ vựng siêu nhanh bằng AI, hỗ trợ thêm nhiều từ, luyện tập từ, kiểm tra độ ghi nhớ của từ, đa ngôn ngữ</p>
                                                    <Button
                                                        onClick={() => {
                                                            router.push("/flashcard")
                                                            handleClose()
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2 text-white w-full mt-3"
                                                    >
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>Tới Flashcard</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden">
                                                    <Image src="/how-to-use/tao-flashcard.gif" alt="" fill className="absolute object-cover"></Image>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                                <div className="px-4 pt-2 rounded-lg bg-slate-800/50 border dark:hover:bg-slate-800  border-slate-700">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1" className="border-b-transparent">
                                            <AccordionTrigger className="flex items-start space-x-4 !no-underline">
                                                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Brain className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex items-start flex-col  mb-1">
                                                    <div className="flex gap-2">
                                                        <h3 className="font-semibold">Quiz AI</h3>
                                                        <Badge variant="secondary" className="bg-teal-600/20 text-teal-400 border-teal-600/30">
                                                            AI-Powered
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-300">Tạo quiz tự động với AI, điều chỉnh độ khó thông minh dựa trên khả năng học tập của bạn</p>
                                                    <Button
                                                        onClick={() => {
                                                            router.push("/ai-center")
                                                            handleClose()
                                                        }}
                                                        className="bg-teal-600 hover:bg-teal-700 flex items-center justify-center space-x-2 text-white mt-3 w-full"
                                                    >
                                                        <Brain className="w-4 h-4" />
                                                        <span>Tới Trang tạo Quiz bằng AI</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden">
                                                    <Image src="/how-to-use/tao-quiz.gif" alt="" fill className="absolute object-cover"></Image>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4 border-t dark:border-white/10 border-slate-700">
                                <Button variant="outline" onClick={handleClose} className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
                                    <X className="w-4 h-4" />
                                    Không hiển thị lại
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
