"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Bot, Sparkles, Wand2, Clock, Users, BookOpen, Eye, CheckCircle, Save, Gamepad2, File } from "lucide-react";
import { AIResultPreview } from "./AIResuiltPreview";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { optimizedPromptQuiz } from "@/lib/optimizedPrompt";

import DialogAddMoreInfoQuiz from "./DialogAddMoreInfoQuiz";
import { Game2048Smooth } from "./Game2048Smooth";
interface QuizQuestion {
    title: string;
    subject: string;
    content: string;
    questions: Quiz[];
}

interface Quiz {
    id: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    question: string;
    answers?: string[];
    correct: string;
    points: number;
}

interface HomeViewProps {
    onViewChange: (view: string) => void;
}

export function AICreateView({ onViewChange }: HomeViewProps) {
    const [topic, setTopic] = useState("");
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false);
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [questionCount, setQuestionCount] = useState([10]);
    const [questionTypes, setQuestionTypes] = useState<string[]>(["multiple-choice"]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [openGame, setOpenGame] = useState(false);

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
    ];

    const questionTypeOptions = [
        { value: "multiple-choice", label: "Trắc nghiệm" },
        { value: "true-false", label: "Đúng/Sai" },
        { value: "short-answer", label: "Câu trả lời ngắn" },
        { value: "essay", label: "Tự luận" },
    ];

    const topicSuggestions = ["Toán học cơ bản", "Lịch sử Việt Nam", "Tiếng Anh giao tiếp", "Khoa học tự nhiên", "Công nghệ thông tin", "Kinh tế học", "Văn học Việt Nam", "Địa lý thế giới"];

    const handleQuestionTypeToggle = (type: string) => {
        setQuestionTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
    };
    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.API_KEY_AI || ""), []);
    const handleGenerate = async () => {
        try {
            setGeneratedQuiz(null);
            setIsGenerating(true);
            setOpenGame(true);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = optimizedPromptQuiz(topic, description, questionCount[0], difficulty);
            const result = await model.generateContent(prompt);

            const responseText = result?.response
                .text()
                // ✅ Chỉ xóa wrapper markdown, giữ lại code blocks bên trong content
                .replace(/^```json\s*/, "") // Xóa ```json ở đầu
                .replace(/^```html\s*/, "") // Xóa ```html ở đầu
                .replace(/```\s*$/, ""); // Xóa ``` ở cuối
            const jsonOutput = JSON.parse(responseText || "");
            setIsGenerating(false);
            setGeneratedQuiz(jsonOutput);
            toast.success("Quiz đã được tạo thành công!", {
                description: `Đã tạo ${jsonOutput.length} câu hỏi cho chủ đề "${topic}" với độ khó "${difficulty}".`,
                position: "top-center",
                duration: 5000,
                action: {
                    label: "Xem trước",
                    onClick: () => setShowPreview(true),
                },
            });
        } catch (error) {
            console.error("Error generating quiz:", error);
            toast.error("Đã xảy ra lỗi khi tạo quiz.", { description: error instanceof Error ? error.message : "Lỗi không xác định", position: "top-center", duration: 5000 });
            return;
        } finally {
            setIsGenerating(false);
        }
    };
    const handleQuizUpdate = (updatedQuiz: typeof generatedQuiz) => {
        setGeneratedQuiz(updatedQuiz);
    };

    const handleAddToDraft = () => {
        const draftStorage = localStorage.getItem("draftQuiz");
        const draft = {
            ...generatedQuiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            createdBy: "ai",
            status: "draft",
            difficulty: difficulty,
        };

        if (draftStorage) {
            const existingDrafts = JSON.parse(draftStorage);
            localStorage.setItem("draftQuiz", JSON.stringify([...existingDrafts, draft]));
        } else {
            localStorage.setItem("draftQuiz", JSON.stringify([draft]));
        }

        toast.success("Quiz đã được lưu vào nháp", { description: "Bạn có thể xem lại trong phần Draft", duration: 5000, action: { label: "Xem nháp", onClick: () => onViewChange("drafts") } });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <Bot className="h-8 w-8 text-purple-500" />
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
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả thêm về nội dung, phạm vi, yêu cầu đặc biệt..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
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
                                <Label>Lựa chọn độ khó</Label>
                                <div className="flex gap-2">
                                    {difficultyOptions.map((option) => (
                                        <Card
                                            key={option.value}
                                            className={`relative !ml-0 flex-1 p-3 rounded-lg cursor-pointer dark:border-white/10 ${
                                                difficulty === option.value ? option.color : "bg-white dark:bg-gray-800"
                                            } hover:shadow-md transition-shadow ml-2`}
                                            onClick={() => setDifficulty(option.value)}>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={`${option.color} dark:border-white/10 hidden md:block`}>{option.badge}</Badge>
                                                <span className="text-sm">{option.label}</span>
                                                <div
                                                    className={`absolute top-1 right-1 w-3 h-3  rounded-full dark:border-white/50 ${
                                                        difficulty === option.value ? option.color + " border-2" : ""
                                                    }`}></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2"> {option.desc}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label>Số lượng câu hỏi: {questionCount[0]}</Label>
                                <Slider value={questionCount} onValueChange={setQuestionCount} max={50} min={5} step={5} className="mt-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>5 câu</span>
                                    <span>50 câu</span>
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Loại câu hỏi <span className="text-xs ml-3 text-gray-400">(*Mặc định trắc nghiệm)</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {questionTypeOptions.map((type) => (
                                        <Button
                                            key={type.value}
                                            variant={questionTypes.includes(type.value) ? "default" : "outline"}
                                            className="dark:text-white"
                                            onClick={() => handleQuestionTypeToggle(type.value)}
                                            disabled>
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview/Stats */}
                <div className="space-y-6">
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
                                    <span className="text-sm">Thời gian ước tính:</span>
                                </div>
                                <p className="text-sm font-medium">{Math.ceil(questionCount[0] * 1.5)} phút</p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm mr-2">Độ khó:</span>
                                <Badge className={difficultyOptions.find((d) => d.value === difficulty)?.color}>{difficultyOptions.find((d) => d.value === difficulty)?.label}</Badge>
                            </div>
                        </CardContent>
                    </Card>

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
                </div>
            </div>

            <div className="flex justify-center flex-col gap-5">
                <div className={`flex items-center gap-5 flex-col md:flex-row `}>
                    <Dialog open={openGame} onOpenChange={setOpenGame}>
                        <DialogTrigger>
                            <Button size="lg" variant="outline" className={`flex`}>
                                <Gamepad2 className="mr-2 h-4 w-4" />
                                Chơi game 2048
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-5">
                                    Giải trí trong lúc đợi AI {!generatedQuiz ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                                </DialogTitle>
                                {!generatedQuiz ? (
                                    <DialogDescription>
                                        <p className="mb-2 hidden md:block">Hệ thống AI đang tổng hợp các câu hỏi cho bạn.</p>
                                        <p className="mb-4">Quá trình này có thể mất chút thời gian tùy thuộc vào số lượng câu hỏi, thường là khoảng 30 giây.</p>
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
                {generatedQuiz && (
                    <div className="space-y-4 mt-10">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                <span className="text-lg font-medium text-green-700 dark:text-gray-400">Quiz đã được tạo thành công!</span>
                            </div>
                            <p className="text-muted-foreground dark:text-gray-400">
                                AI đã tạo {generatedQuiz?.questions?.length} câu hỏi cho chủ đề &quot;{topic}&quot;
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 flex-col md:flex-row">
                            <Button size="lg" variant="outline" onClick={() => setShowPreview(true)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem trước kết quả
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => handleAddToDraft()}>
                                <File className="mr-2 h-4 w-4" />
                                Lưu vào nháp
                            </Button>
                            <DialogAddMoreInfoQuiz generatedQuiz={generatedQuiz} openAddMoreInfo={openAddMoreInfo} setOpenAddMoreInfo={setOpenAddMoreInfo}>
                                <Button size="lg" className="text-white bg-gradient-to-r from-blue-500 to-cyan-500">
                                    <Save className="mr-2 h-4 w-4" />
                                    Lưu và xuất bản
                                </Button>
                            </DialogAddMoreInfoQuiz>
                        </div>
                    </div>
                )}
            </div>
            {generatedQuiz && <AIResultPreview open={showPreview} onOpenChange={setShowPreview} quiz={generatedQuiz} onQuizUpdate={handleQuizUpdate} setOpenAddMoreInfo={setOpenAddMoreInfo} />}
        </div>
    );
}
