"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Bot, Sparkles, Wand2, Clock, Users, BookOpen, Eye, CheckCircle, Save, Gamepad2, File } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { optimizedPromptQuiz } from "@/lib/optimizedPrompt"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Game2048Smooth } from "@/components/ai-center/Game2048Smooth"
import DialogAddMoreInfoQuiz from "@/components/ai-center/DialogAddMoreInfoQuiz"
import { AIResultPreview } from "@/components/ai-center/AIResuiltPreview"

interface QuizQuestion {
    title: string
    subject: string
    content: string
    questions: Quiz[]
}

interface Quiz {
    id: string
    type: "multiple-choice" | "true-false" | "short-answer"
    question: string
    answers?: string[]
    correct: string
    points: number
}

export function CQuizAI() {
    const [topic, setTopic] = useState("")
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false)
    const [description, setDescription] = useState("")
    const [difficulty, setDifficulty] = useState("medium")
    const [questionCount, setQuestionCount] = useState([10])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [openGame, setOpenGame] = useState(false)

    const router = useRouter()
    const pathname = usePathname()

    // ✅ Refs để track trạng thái
    const isPageActiveRef = useRef(true)
    const isGeneratingRef = useRef(false)
    const currentTopicRef = useRef("")
    const currentDifficultyRef = useRef("")

    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.API_KEY_AI || ""), [])

    // ✅ Cập nhật refs khi state thay đổi
    useEffect(() => {
        isGeneratingRef.current = isGenerating
    }, [isGenerating])

    useEffect(() => {
        currentTopicRef.current = topic
        currentDifficultyRef.current = difficulty
    }, [topic, difficulty])

    // ✅ Cleanup khi component unmount hoặc user rời trang
    useEffect(() => {
        isPageActiveRef.current = true

        // Cleanup function khi component unmount
        return () => {
            isPageActiveRef.current = false
        }
    }, [])

    // ✅ Detect khi user navigate ra khỏi trang
    useEffect(() => {
        const handleRouteChange = () => {
            isPageActiveRef.current = false
        }

        // Listen cho route changes
        window.addEventListener("beforeunload", handleRouteChange)

        return () => {
            window.removeEventListener("beforeunload", handleRouteChange)
            handleRouteChange()
        }
    }, [])

    // ✅ Function để auto-save vào draft
    const autoSaveToDraft = (quiz: QuizQuestion, topic: string, difficulty: string) => {
        const draftStorage = localStorage.getItem("draftQuiz")
        const draft = {
            ...quiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "ai",
            status: "draft",
            difficulty: difficulty,
            // autoSaved: true, // ✅ Flag để biết là auto-saved
        }

        if (draftStorage) {
            const existingDrafts = JSON.parse(draftStorage)
            localStorage.setItem("draftQuiz", JSON.stringify([...existingDrafts, draft]))
        } else {
            localStorage.setItem("draftQuiz", JSON.stringify([draft]))
        }

        // ✅ Toast thông báo auto-save
        toast.info("Quiz đã được tự động lưu vào nháp", {
            description: `Do bạn đã rời khỏi trang tạo quiz với chủ đề "${topic}"`,
            position: "top-center",
            duration: 15000,
            action: {
                label: "Xem nháp",
                onClick: () => router.push("/quiz/themcauhoi/drafts"),
            },
        })
    }

    const handleGenerate = async () => {
        try {
            setGeneratedQuiz(null)
            setIsGenerating(true)
            setOpenGame(true)

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
            const prompt = optimizedPromptQuiz(topic, description, questionCount[0], difficulty)
            const result = await model.generateContent(prompt)

            const responseText = result?.response
                .text()
                .replace(/^```json\s*/, "")
                .replace(/^```html\s*/, "")
                .replace(/```\s*$/, "")

            const jsonOutput = JSON.parse(responseText || "")

            setIsGenerating(false)

            // ✅ Kiểm tra xem user còn ở trang này không
            if (!isPageActiveRef.current) {
                // User đã rời trang -> auto-save vào draft
                autoSaveToDraft(jsonOutput, currentTopicRef.current, currentDifficultyRef.current)
                return
            }

            // ✅ User vẫn ở trang -> hiển thị như bình thường
            setGeneratedQuiz(jsonOutput)
            toast.success("Quiz đã được tạo thành công!", {
                description: `Với chủ đề "${topic}" và độ khó "${difficulty}".`,
                position: "top-center",
                duration: 5000,
                action: {
                    label: "Xem trước",
                    onClick: () => setShowPreview(true),
                },
            })
        } catch (error) {
            console.error("Error generating quiz:", error)

            // ✅ Chỉ hiển thị error toast nếu user vẫn ở trang
            if (isPageActiveRef.current) {
                toast.error("Đã xảy ra lỗi khi tạo quiz.", {
                    description: error instanceof Error ? error.message : "Lỗi không xác định",
                    position: "top-center",
                    duration: 5000,
                })
            }
        } finally {
            setIsGenerating(false)
        }
    }

    // ✅ Function lưu thủ công vào draft (giữ nguyên)
    const handleAddToDraft = () => {
        const draftStorage = localStorage.getItem("draftQuiz")
        const draft = {
            ...generatedQuiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "ai",
            status: "draft",
            difficulty: difficulty,
            autoSaved: false, // ✅ User save thủ công
        }

        if (draftStorage) {
            const existingDrafts = JSON.parse(draftStorage)
            localStorage.setItem("draftQuiz", JSON.stringify([...existingDrafts, draft]))
        } else {
            localStorage.setItem("draftQuiz", JSON.stringify([draft]))
        }

        toast.success("Quiz đã được lưu vào nháp", {
            description: "Bạn có thể xem lại trong phần Draft",
            duration: 5000,
            action: {
                label: "Xem nháp",
                onClick: () => router.push("/quiz/themcauhoi/drafts"),
            },
        })
    }

    // ✅ Thêm effect để detect route change (alternative approach)
    useEffect(() => {
        const currentPath = pathname

        return () => {
            // Khi component unmount và đang generate
            if (isGeneratingRef.current) {
                isPageActiveRef.current = false
            }
        }
    }, [pathname])

    const difficultyOptions = [
        { value: "easy", label: "Cơ bản", badge: "Cơ bản", desc: "Phù hợp cho người mới bắt đầu", color: "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200" },
        {
            value: "medium",
            label: "Trung bình",
            badge: "Vừa",
            desc: "Cần hiểu biết nhất định về chủ đề",
            color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-200",
        },
        { value: "hard", label: "Nâng cao", badge: "Khó", desc: "Đòi hỏi kiến thức chuyên sâu", color: "bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-200" },
    ]

    const topicSuggestions = ["Toán học cơ bản", "Lịch sử Việt Nam", "Tiếng Anh giao tiếp", "Khoa học tự nhiên", "Công nghệ thông tin", "Kinh tế học", "Văn học Việt Nam", "Địa lý thế giới"]

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Tạo Quiz bằng AI</h1>
                </div>
                <p className="text-muted-foreground">Mô tả chủ đề và để AI tạo quiz hoàn chỉnh cho bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5" />
                                <span>Thông tin chủ đề</span>
                            </CardTitle>
                            <CardDescription>Cung cấp thông tin về chủ đề quiz bạn muốn tạo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="topic">Chủ đề quiz *</Label>
                                <Input id="topic" placeholder="VD: Lịch sử Việt Nam thế kỷ 20" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1" />
                            </div>

                            <div>
                                <Label>Gợi ý chủ đề</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {topicSuggestions.map((suggestion) => (
                                        <Badge key={suggestion} variant="outline" className="cursor-pointer dark:text-white/80" onClick={() => setTopic(suggestion)}>
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả chi tiết (tùy chọn)</Label>
                                <Textarea id="description" placeholder="Mô tả thêm về nội dung, phạm vi, yêu cầu đặc biệt..." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={3} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Wand2 className="h-5 w-5" />
                                <span>Cấu hình quiz</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Số lượng câu hỏi: {questionCount[0]}</Label>
                                <Slider value={questionCount} onValueChange={setQuestionCount} max={50} min={5} step={5} className="mt-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>5 câu</span>
                                    <span>50 câu</span>
                                </div>
                            </div>
                            <div>
                                <Label>Lựa chọn cấp độ</Label>
                                <div className="flex gap-2  flex-col md:flex-row ">
                                    {difficultyOptions.map((option) => (
                                        <Card key={option.value} className={`relative !ml-0 flex-1 p-3 rounded-lg cursor-pointer dark:border-white/10 ${difficulty === option.value ? option.color : "bg-white dark:bg-gray-800"} hover:shadow-md transition-shadow ml-2`} onClick={() => setDifficulty(option.value)}>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={`${option.color} dark:border-white/10 `}>{option.badge}</Badge>
                                                <span className="text-sm">{option.label}</span>
                                                <div className={`absolute top-1 right-1 w-3 h-3  rounded-full dark:border-white/50 ${difficulty === option.value ? option.color + " border-2" : ""}`}></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2"> {option.desc}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview/Stats */}
                <div className="space-y-6">
                    <Card className="dark:border-white/10 dark:shadow-md bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-900/20 dark:to-pink-900/20">
                        <CardContent className="p-4">
                            <div className="text-center space-y-2">
                                <Bot className="h-8 w-8 text-purple-500 mx-auto" />
                                <p className="text-sm font-medium">AI sẽ tạo quiz dựa trên:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Chủ đề và mô tả của bạn</li>
                                    <li>• Độ khó phù hợp</li>
                                    <li>• Đa dạng loại câu hỏi</li>
                                    <li>• Đáp án chính xác</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Xem trước</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Chủ đề:</span>
                                </div>
                                <p className="text-sm font-medium">{topic || "Chưa nhập chủ đề"}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Số câu hỏi:</span>
                                </div>
                                <p className="text-sm font-medium">{questionCount[0]} câu</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Thời gian tạo ước tính:</span>
                                </div>
                                <p className="text-sm font-medium">{30 + Math.ceil(questionCount[0] / 0.4)}s</p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm mr-2">Độ khó:</span>
                                <Badge className={difficultyOptions.find((d) => d.value === difficulty)?.color}>{difficultyOptions.find((d) => d.value === difficulty)?.label}</Badge>
                            </div>
                            <Dialog open={openGame} onOpenChange={setOpenGame}>
                                <DialogTrigger>
                                    <Button size="lg" variant="outline" className={`flex`}>
                                        <Gamepad2 className="mr-2 h-4 w-4" />
                                        Chơi game 2048
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xs sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-5">Giải trí trong lúc đợi AI {!generatedQuiz ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-500" />}</DialogTitle>
                                        {!generatedQuiz ? (
                                            <DialogDescription>
                                                <p className="mb-2 hidden md:block">Hệ thống AI đang tổng hợp các câu hỏi cho bạn.</p>
                                                <p className="mb-4">Quá trình này có thể mất chút thời gian tùy thuộc vào số lượng câu hỏi</p>
                                            </DialogDescription>
                                        ) : (
                                            <DialogDescription>
                                                <p className="mb-2 text-green-300">AI đã tạo xong quiz cho bạn!</p>
                                                <p className="mb-4 text-green-300">Bạn có thể xem trước kết quả hoặc lưu vào nháp để chỉnh sửa sau.</p>
                                            </DialogDescription>
                                        )}
                                    </DialogHeader>

                                    <div className="flex justify-center">
                                        <Game2048Smooth />
                                    </div>

                                    <DialogFooter>
                                        <p className=" hidden md:block text-xs text-muted-foreground text-center w-full">Chơi game để thời gian chờ trở nên thú vị hơn!</p>
                                        <DialogClose asChild className="hidden md:block">
                                            <Button variant="outline">Đóng</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center flex-col gap-5  mt-10">
                <div className={`flex items-center gap-3 flex-col md:flex-row `}>
                    {generatedQuiz && (
                        <div className="space-y-4">
                            <div className="flex justify-center gap-3 flex-col md:flex-row">
                                <Button size="lg" variant="outline" onClick={() => handleAddToDraft()}>
                                    <File className="mr-2 h-4 w-4" />
                                    Lưu vào nháp
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => setShowPreview(true)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem trước kết quả
                                </Button>
                                <DialogAddMoreInfoQuiz generatedQuiz={generatedQuiz} openAddMoreInfo={openAddMoreInfo} setOpenAddMoreInfo={setOpenAddMoreInfo}>
                                    <Button size="lg" className="w-full md:w-auto text-white bg-gradient-to-r from-blue-500 to-cyan-500">
                                        <Save className="mr-2 h-4 w-4" />
                                        Lưu và xuất bản
                                    </Button>
                                </DialogAddMoreInfoQuiz>
                            </div>
                        </div>
                    )}
                    <Button size="lg" className="dark:text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" onClick={handleGenerate} disabled={!topic.trim() || isGenerating}>
                        {isGenerating ? (
                            <>
                                <Bot className="mr-2 h-4 w-4 animate-spin" />
                                Đang tạo quiz ...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {generatedQuiz ? "Tạo lại quiz" : "Tạo quiz bằng AI"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
            {generatedQuiz && <AIResultPreview open={showPreview} onOpenChange={setShowPreview} quiz={generatedQuiz} setGeneratedQuiz={setGeneratedQuiz} setOpenAddMoreInfo={setOpenAddMoreInfo} />}
        </div>
    )
}
