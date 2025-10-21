import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Save, Sparkle, Upload, X } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { POST_API } from "@/lib/fetchAPI";
import { useRouter } from "next/navigation";
import Loading from "../ui/loading";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { optimizedPromptGenerateTitle } from "@/lib/optimizedPrompt";
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

interface Props {
    children: React.ReactNode;
    openAddMoreInfo: boolean;
    setOpenAddMoreInfo: (open: boolean) => void;
    generatedQuiz?: QuizQuestion;
}

export default function DialogAddMoreInfoDeCuong({ children, generatedQuiz, openAddMoreInfo, setOpenAddMoreInfo }: Props) {
    const defaultGeneratedQuiz = {
        title: "",
        subject: "",
        content: "",
    };
    const [tempQuiz, setTempQuiz] = useState(defaultGeneratedQuiz);

    const [loading, setLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState(false);
    const token = Cookies.get("token") || "";
    const router = useRouter();
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        // Nếu generatedQuiz có giá trị, cập nhật tempQuiz
        if (generatedQuiz) {
            setTempQuiz({
                title: generatedQuiz.title || "",
                subject: generatedQuiz.subject || "",
                content: generatedQuiz.content || "",
            });
        } else {
            // Nếu không có generatedQuiz, đặt tempQuiz về giá trị mặc định
            setTempQuiz(defaultGeneratedQuiz);
        }
    }, [generatedQuiz]);
    const handleSetValueTempQuiz = (field: keyof typeof tempQuiz, value: string) => {
        setTempQuiz((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSubmit = async (e: any) => {
        try {
            setLoading(true);
            e.preventDefault();
            // nếu nó không bắt đầu là http hoặc https thì upload hình lên cloudinary
            let imageUrl = "";
            if (selectedFile) {
                const formData = new FormData();

                formData.append("image", selectedFile);
                const uploadResponse = await axios.post(`${process.env.API_ENDPOINT}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                imageUrl = uploadResponse?.data?.url;
            }
            const newQuiz = {
                title: tempQuiz.title,
                subject: tempQuiz.subject,
                content: tempQuiz.content,
                img: imageUrl,
                questions: generatedQuiz?.questions,
            };

            const req = await POST_API("/quiz", newQuiz, "POST", token);
            const data = await req?.json();
            if (data.ok) {
                toast.success("Đã lưu và xuất bản bài quiz", {
                    description: "Chúng tôi đang xem xét bài quiz của bạn, chờ cho đến khi được phê duyệt trước khi nó xuất hiện công khai.",
                    position: "top-center",
                    id: "upload-image",
                    duration: 3000,
                });
                setOpenAddMoreInfo(false);
                router.push(`/quiz/detail/${data?.quiz?.slug}`);
            } else {
                toast.error("Đã có lỗi xảy ra", {
                    description: data?.message || "Lỗi không xác định",
                    position: "top-center",
                    duration: 10000,
                });
            }
        } catch (error: any) {
            console.error("Error uploading image:", error);
            toast.error("Đã có lỗi xảy ra", {
                description: error.response.data.message || "Lỗi không xác định",
                position: "top-center",
                duration: 5000,
                id: "upload-image",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Please select a PNG, JPG, or GIF file.");
            return;
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert("Kích thước tập tin phải nhỏ hơn 3MB.");
            return;
        }

        setSelectedFile(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
            const reader = new FileReader();
            reader.onload = () => {
                setIsDragOver(false); // Reset drag over state
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const genAI = useMemo(() => new GoogleGenerativeAI(process.env.API_KEY_AI || ""), []);
    const handleGenerateTitle = async () => {
        if (loadingTitle) return; // Prevent multiple clicks
        setLoadingTitle(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const shuffledQuestions = generatedQuiz?.questions ? [...generatedQuiz.questions].sort(() => Math.random() - 0.5) : [];
            const sliceQuiz = shuffledQuestions.slice(0, 10);
            const prompt = optimizedPromptGenerateTitle(sliceQuiz);
            const result = await model.generateContent(prompt);

            const responseText = result?.response
                .text()
                // ✅ Chỉ xóa wrapper markdown, giữ lại code blocks bên trong content
                .replace(/^```json\s*/, "") // Xóa ```json ở đầu
                .replace(/^```html\s*/, "") // Xóa ```html ở đầu
                .replace(/```\s*$/, ""); // Xóa ``` ở cuối
            const jsonOutput = JSON.parse(responseText || "");
            setTempQuiz({
                title: jsonOutput.title,
                subject: jsonOutput.subject,
                content: jsonOutput.content,
            });
        } catch (error: any) {
            toast.error("Đã có lỗi xảy ra khi tạo tiêu đề", { description: error, duration: 5000, position: "top-center" });
        } finally {
            setLoadingTitle(false);
        }
    };
    return (
        <Dialog open={openAddMoreInfo} onOpenChange={setOpenAddMoreInfo}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <div>
                    <DialogHeader>
                        <DialogTitle>Nhập thêm thông tin bài quiz </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 my-5">
                        <div className="">
                            <div
                                autoFocus
                                className={`cursor-pointer hover:border-primary/50 hover:bg-primary/5 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={handleButtonClick}
                                onDrop={handleDrop}>
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="p-3 bg-muted rounded-full">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Tải lên hình - kéo vào hoặc bỏ qua</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF tới 3MB</p>
                                    </div>
                                </div>
                            </div>

                            {selectedFile && (
                                <div className="mt-3 flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 relative h-20 w-36">
                                            <Image src={URL.createObjectURL(selectedFile)} alt="Selected file preview" fill className="rounded-md object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate max-w-[255px]">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif" onChange={handleFileChange} className="hidden" />
                        </div>

                        <div className="">
                            <Label htmlFor="name-1">Tên bài quiz</Label>
                            <div className="flex items-center justify-between gap-5">
                                <Input id="name-1" name="name" placeholder="Nhập tên bài quiz" value={tempQuiz.title} onChange={(e) => handleSetValueTempQuiz("title", e.target.value)} required />
                                <Button
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                    disabled={loadingTitle}
                                    onClick={handleGenerateTitle}>
                                    {loadingTitle ? <Loading /> : <Sparkle className="mr-2 h-4 w-4" />}

                                    <span className="hidden md:inline">Tạo tiêu đề</span>
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Nội dung</Label>
                            <Textarea
                                className="h-12"
                                id="username-1"
                                name="username"
                                placeholder="Nhập nội dung"
                                value={tempQuiz.content}
                                onChange={(e) => handleSetValueTempQuiz("content", e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="subject">Môn học</Label>
                            <Input id="subject" name="subject" placeholder="Nhập môn học" value={tempQuiz.subject} onChange={(e) => handleSetValueTempQuiz("subject", e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" size="lg">
                                Đóng
                            </Button>
                        </DialogClose>
                        <Button size="lg" className="text-white bg-gradient-to-r from-blue-500 to-cyan-500" onClick={handleSubmit} disabled={loading}>
                            {loading ? <Loading /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu và xuất bản
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
