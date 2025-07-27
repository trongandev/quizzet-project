"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Brain, FileText, ImageIcon, Volume2, Settings, Sparkles, Plus, Trash2, Edit3, Eye } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MultiSelect } from "@/components/ui/multi-select"
import Loading from "@/components/ui/loading"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { optimizedPromptEnglishExam } from "@/lib/optimizedPrompt"
import { toast } from "sonner"
import { ExamInterface } from "@/components/ai-center/ExamInterface"
import { IEnglishExam } from "@/types/typeEnglishExam"

export default function CEnglishExam() {
    const [activeTab, setActiveTab] = useState("gui")
    const [openResult, setOpenResult] = useState(false)
    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        content: "",
        difficulty: "",
        skills: [""],
        questionTypes: [""],
        questionCount: 10,
        timeLimit: 30,
    })

    const [generatedQuestions, setGeneratedQuestions] = useState<IEnglishExam | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const difficultyLevels = [
        { value: "a1", label: "A1 - Beginner" },
        { value: "a2", label: "A2 - Elementary" },
        { value: "b1", label: "B1 - Intermediate" },
        { value: "b2", label: "B2 - Upper Intermediate" },
        { value: "c1", label: "C1 - Advanced" },
        { value: "c2", label: "C2 - Proficiency" },
    ]

    const skillTypes = [
        { value: "grammar", label: "Ngữ pháp" },
        { value: "vocabulary", label: "Từ vựng" },
        { value: "reading", label: "Đọc hiểu" },
        { value: "listening", label: "Nghe hiểu" },
        { value: "writing", label: "Viết" },
        { value: "speaking", label: "Nói" },
    ]

    const questionTypes = [
        { value: "multiple-choice", label: "Trắc nghiệm" },
        { value: "fill-blank", label: "Điền từ" },
        { value: "matching", label: "Nối câu" },
        { value: "reorder", label: "Sắp xếp câu" },
        { value: "rewrite", label: "Viết lại câu" },
        { value: "true-false", label: "Đúng/Sai" },
    ]

    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.API_KEY_AI || ""), [])

    const handleGenerateQuestionsWithAI = async () => {
        try {
            console.log("Generating questions with data:", quizData)
            setGeneratedQuestions(null)
            setIsGenerating(true)

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
            const prompt = optimizedPromptEnglishExam(quizData)
            const result = await model.generateContent(prompt)

            const responseText = result?.response
                .text()
                .replace(/^```json\s*/, "")
                .replace(/^```html\s*/, "")
                .replace(/```\s*$/, "")

            const jsonOutput = JSON.parse(responseText || "")
            console.log("Generated JSON Output:", jsonOutput)
            setIsGenerating(false)

            const newExamData: IEnglishExam = {
                title: quizData.title,
                description: quizData.description,
                difficulty: quizData.difficulty as any,
                skills: quizData.skills as any,
                timeLimit: quizData.timeLimit,
                questions: jsonOutput || [],
            }
            setGeneratedQuestions(newExamData)
            toast.success("Tạo đề thi tiếng anh thành công!", {
                position: "top-center",
                duration: 5000,
                // action: {
                //     label: "Xem trước",
                //     onClick: () => setShowPreview(true),
                // },
            })
        } catch (error) {
            console.error("Error generating quiz:", error)

            toast.error("Đã xảy ra lỗi khi tạo quiz.", {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
                position: "top-center",
                duration: 5000,
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="px-6">
            <div className="text-center space-y-2 relative mb-5">
                <SidebarTrigger className="absolute top-0 left-0" />
                <h1 className="text-3xl font-bold">Tạo đề thi tiếng anh</h1>
                <p className="text-muted-foreground">Mô tả chủ đề và để AI tạo đề thi hoàn chỉnh cho bạn</p>
            </div>
            <div className="flex-1  overflow-auto">
                <div className="">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                        <TabsList className="grid grid-cols-3 bg-slate-800 h-12">
                            <TabsTrigger value="gui" className="flex items-center gap-2 h-10">
                                <FileText className="w-4 h-4" />
                                Giao diện
                            </TabsTrigger>
                            <TabsTrigger value="text" className="flex items-center gap-2 h-10">
                                <FileText className="w-4 h-4" />
                                Văn bản
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 h-10">
                                <Settings className="w-4 h-4" />
                                Cài đặt
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="gui" className="space-y-6">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Nhập nội dung
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-slate-300">
                                            Tiêu đề
                                        </Label>
                                        <Input id="title" placeholder="Nhập tiêu đề..." value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} className="bg-slate-700 border-slate-600 text-white" />
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-slate-300">
                                            Mô tả
                                        </Label>
                                        <Input id="description" placeholder="Mô tả ngắn..." value={quizData.description} onChange={(e) => setQuizData({ ...quizData, description: e.target.value })} className="bg-slate-700 border-slate-600 text-white" />
                                    </div>

                                    <div>
                                        <Label htmlFor="content" className="text-slate-300">
                                            Nội dung của bài thi
                                        </Label>
                                        <Textarea id="content" placeholder="Nhập đoạn văn bản hoặc chủ đề mà bạn muốn tạo câu hỏi, có thể thêm phạm vi, yêu cầu đặc biệt..." value={quizData.content} onChange={(e) => setQuizData({ ...quizData, content: e.target.value })} className="bg-slate-700 border-slate-600 text-white min-h-[200px]" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-300">Cấp độ khó</Label>
                                            <Select value={quizData.difficulty} onValueChange={(value) => setQuizData({ ...quizData, difficulty: value })}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                    <SelectValue placeholder="Chọn cấp độ" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    {difficultyLevels.map((level) => (
                                                        <SelectItem key={level.value} value={level.value} className="text-slate-300">
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-slate-300">Kỹ năng tập trung</Label>
                                            <MultiSelect options={skillTypes} onValueChange={(value) => setQuizData({ ...quizData, skills: value })} className="bg-slate-700 border-slate-600 text-white" />
                                            {/* <Select value={quizData.skill} onValueChange={(value) => setQuizData({ ...quizData, skill: value })}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                    <SelectValue placeholder="Chọn kỹ năng" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    {skillTypes.map((skill) => (
                                                        <SelectItem key={skill.value} value={skill.value} className="text-slate-300">
                                                            {skill.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-slate-300 mb-3 block">Loại câu hỏi</Label>
                                        <MultiSelect options={questionTypes} onValueChange={(value) => setQuizData({ ...quizData, questionTypes: value })} className="bg-slate-700 border-slate-600 text-white" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="questionCount" className="text-slate-300">
                                                Số câu hỏi
                                            </Label>
                                            <Input id="questionCount" type="number" min="5" max="50" value={quizData.questionCount} onChange={(e) => setQuizData({ ...quizData, questionCount: Number.parseInt(e.target.value) })} className="bg-slate-700 border-slate-600 text-white" />
                                        </div>

                                        <div>
                                            <Label htmlFor="timeLimit" className="text-slate-300">
                                                Thời gian làm bài (phút)
                                            </Label>
                                            <Input id="timeLimit" type="number" min="5" max="180" value={quizData.timeLimit} onChange={(e) => setQuizData({ ...quizData, timeLimit: Number.parseInt(e.target.value) })} className="bg-slate-700 border-slate-600 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {generatedQuestions && (
                                            <Button className="h-12 " variant="outline" onClick={() => setOpenResult(true)}>
                                                <Eye />
                                                Xem trước
                                            </Button>
                                        )}

                                        <Button onClick={handleGenerateQuestionsWithAI} disabled={!quizData.content || !quizData.difficulty || quizData.questionTypes.length === 0 || isGenerating} className="w-full bg-gradient-to-r h-12 text-white from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                            {isGenerating ? (
                                                <>
                                                    <Loading />
                                                    Đang tạo câu hỏi...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Tạo câu hỏi bằng AI
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {generatedQuestions && <ExamInterface examData={generatedQuestions} open={openResult} setOpen={setOpenResult} />}
                        </TabsContent>

                        <TabsContent value="text" className="space-y-6">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5" />
                                        Tạo câu hỏi từ hình ảnh
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                                        <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-300 mb-2">Kéo thả hình ảnh vào đây hoặc</p>
                                        <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                                            Chọn hình ảnh
                                        </Button>
                                        <p className="text-slate-500 text-sm mt-2">Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Cài đặt nâng cao
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-slate-300">Trộn câu hỏi</Label>
                                                <p className="text-slate-500 text-sm">Thay đổi thứ tự câu hỏi mỗi lần làm bài</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-slate-300">Trộn đáp án</Label>
                                                <p className="text-slate-500 text-sm">Thay đổi thứ tự các lựa chọn</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-slate-300">Hiển thị giải thích</Label>
                                                <p className="text-slate-500 text-sm">Hiển thị giải thích sau khi trả lời</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-slate-300">Cho phép quay lại</Label>
                                                <p className="text-slate-500 text-sm">Học sinh có thể xem lại câu trước</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
