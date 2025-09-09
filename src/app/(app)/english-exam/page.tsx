"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Users, MoreVertical, Play, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IEnglishExam } from "@/types/typeEnglishExam"
import { GET_API } from "@/lib/fetchAPI"
import Cookies from "js-cookie"
import { ExamInterface } from "@/components/ai-center/ExamInterface"
import { useUser } from "@/context/userContext"
import Link from "next/link"
export default function EnglishExamPage() {
    const [dataEnglishExam, setDataEnglishExam] = useState<IEnglishExam[]>([])
    const [filterEnglishExam, setFilterEnglishExam] = useState<IEnglishExam[]>([])
    const token = Cookies.get("token") || ""
    const [generatedQuestions, setGeneratedQuestions] = useState<IEnglishExam | null>(null)
    const [openResult, setOpenResult] = useState(false)
    const { user } = useUser() || { user: null }
    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API("/english-exam", token)
            setDataEnglishExam(res?.englishExams)
            setFilterEnglishExam(res?.englishExams)
            console.log("res?.englishExams", res?.englishExams)
        }
        fetchData()
    }, [])

    const handleSetData = (quiz: IEnglishExam) => {
        console.log(quiz, "quiz")
        setGeneratedQuestions(quiz)
        setOpenResult(true)
    }
    console.log(generatedQuestions, "generatedQuestions")
    return (
        <div className="w-full min-h-screen md:w-[1000px] xl:w-[1200px] px-2 md:px-0 mx-auto py-20">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold mb-3">Đề thi tiếng anh</p>
                <Link href={"/ai-center/create-with-ai/english-ai"}>
                    <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">Tạo thử đề thi ngay</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filterEnglishExam.map((quiz) => (
                    <Card key={quiz._id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{quiz.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{quiz.description}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                        <DropdownMenuItem className="text-slate-300 hover:bg-slate-700" onClick={() => handleSetData(quiz)}>
                                            <Play className="w-4 h-4 mr-2" />
                                            Xem trước
                                        </DropdownMenuItem>
                                        {user?._id === quiz.user_id?._id && (
                                            <>
                                                <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400 hover:bg-slate-700">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                                <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {quiz.questions.length} câu
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {quiz.timeLimit} phút
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {quiz.user_id ? quiz.user_id.displayName : "Chưa có người dùng"}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs ">
                                        {quiz.difficulty.toUpperCase()}
                                    </Badge>
                                    <Badge variant={quiz.is_published ? "default" : "secondary"} className="text-xs">
                                        {quiz.is_published ? "Đã xuất bản" : "Bản nháp"}
                                    </Badge>
                                </div>
                                <Link href={`/english-exam/${quiz._id}`} className="flex items-center">
                                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                                        <Play className="w-4 h-4 mr-1" />
                                        Thi thử
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filterEnglishExam.length === 0 && <p className="text-center col-span-3">Chưa có đề thi nào</p>}
                {generatedQuestions && <ExamInterface examData={generatedQuestions} open={openResult} setOpen={setOpenResult} isEdit={false} />}
            </div>
        </div>
    )
}
