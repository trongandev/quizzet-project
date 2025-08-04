"use client"
import { IQuiz } from "@/types/type"
import React, { useEffect, useState } from "react"
import { SiQuizlet } from "react-icons/si"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Info, Plus, Search, Users, X } from "lucide-react"
import Cookies from "js-cookie"
import { GET_API } from "@/lib/fetchAPI"
import QuizItem from "./QuizItem"
import Loading from "../ui/loading"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"
import PaginationUI from "@/components/PaginationUI"

export default function CQuizPage({ publicQuizData }: { publicQuizData: IQuiz[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tab, setTab] = useState("my")
    const [searchQuiz, setSearchQuiz] = useState("")
    const token = Cookies.get("token") || ""
    const [loading, setLoading] = useState(false)
    const [filterQuiz, setFilterQuiz] = useState<IQuiz[]>([])
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [data, setData] = useState(publicQuizData)

    const totalItems = data?.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = data?.slice(startIndex, endIndex)
    const router = useRouter()
    const displayData = currentItems
    useEffect(() => {
        setLoading(true)
        if (window.innerWidth < 768) {
            setItemsPerPage(4) // Adjust items per page for mobile view
        } else {
            setItemsPerPage(8) // Default items per page for larger screens
        }
        const fetchListFlashCard = async () => {
            const res = await GET_API("/quiz/getquizbyuser", token)
            if (res.ok) {
                setFilterQuiz(res.quiz)
            } else {
                setFilterQuiz([])
            }
            setLoading(false)
        }
        fetchListFlashCard()
    }, [token, publicQuizData])
    const handleSearchQuiz = (value: any) => {
        // setSearchQuiz(value);
        // const search = quizData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        // setData(search);
        // setCurrentPage(1); // Reset to first page after search
    }

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("tutorialQuiz", "true") // Lưu trạng thái đã xem
    }

    useEffect(() => {
        const tutorialQuiz = localStorage.getItem("tutorialQuiz")
        if (!tutorialQuiz) {
            setIsOpen(true)
        }
    }, [])

    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] px-2 md:px-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 ">
                        <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                            <SiQuizlet size={21} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Quiz</h1>
                            <p className="line-clamp-2">Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                        </div>
                    </div>
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger>
                            <Button size="sm" className="dark:text-white " variant="secondary">
                                <Info />
                                <p className="hidden md:block"> Hướng dẫn</p>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-6xl">
                            <div
                                style={{
                                    position: "relative",
                                    paddingBottom: "calc(50.520833333333336% + 41px)",
                                    height: 0,
                                    width: "100%",
                                }}
                            >
                                <iframe
                                    src="https://demo.arcade.software/E9dDTckTtd0TesQjnscx?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
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
                            <AlertDialogFooter>
                                <AlertDialogAction className="text-white" onClick={handleClose}>
                                    <X /> Đóng
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="">
                    <Tabs defaultValue="my" className="mt-8" value={tab} onValueChange={setTab}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
                            <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-gray-100 dark:bg-slate-600">
                                <TabsTrigger value="my" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                    Quiz của tôi
                                </TabsTrigger>
                                <TabsTrigger value="community" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                    Khám phá cộng đồng
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center flex-col md:flex-row gap-3">
                                <div className="relative w-full ">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input placeholder="Tìm kiếm flashcard..." className="pl-10 w-full h-11 border border-gray-300 dark:border-white/10 " value={searchQuiz} onChange={(e) => handleSearchQuiz(e.target.value)} />
                                </div>
                                <Button onClick={() => router.push("/ai-center/create-with-ai/quiz-ai")} className="h-11 w-full md:w-auto px-10 relative group overflow-hidden  bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                    <Plus className="h-4 w-4" />
                                    Tạo câu hỏi bằng AI
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="my">
                            <div>
                                {token ? (
                                    <div className="mt-3">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
                                            {filterQuiz && filterQuiz.map((item) => <QuizItem item={item} key={item._id} />)}
                                            {loading && (
                                                <div className="flex items-center justify-center col-span-4 h-[500px]">
                                                    <Loading className="h-12 w-12" />{" "}
                                                </div>
                                            )}
                                            {token && !loading && filterQuiz?.length <= 0 && (
                                                <div className="h-[350px] col-span-12 flex items-center flex-col gap-3 justify-center ">
                                                    <p className="dark:text-gray-400">Bạn chưa tạo bài quiz nào :(</p>
                                                    <Link href="/quiz/themcauhoi">
                                                        <Button className="text-white">
                                                            <Plus />
                                                            Tạo quiz mới thôi!
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className=" text-gray-700 mt-10 dark:text-gray-300 h-[350px] flex flex-col gap-3 items-center justify-center">
                                        <p>Bạn cần đăng nhập để có thể thêm quiz hoặc</p>
                                        <Button className="dark:text-white" onClick={() => setTab("community")} variant="secondary">
                                            <Users className="h-4 w-4" /> Xem tab cộng đồng của chúng tôi
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="community">
                            <div className="mt-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-5">
                                    {displayData && displayData.map((item) => <QuizItem item={item} key={item?._id} />)}

                                    {publicQuizData?.length <= 0 && <div className="h-[350px] col-span-full flex items-center justify-center text-gray-700 dark:text-gray-300">Không có dữ liệu...</div>}
                                </div>
                                <PaginationUI data={publicQuizData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} startIndex={startIndex} endIndex={endIndex} totalPages={totalPages} totalItems={totalItems} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
