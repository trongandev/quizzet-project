"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, X, Bot, Sparkles, CheckCircle, Eye, Save, File } from "lucide-react"
import { BsFiletypeDocx, BsFiletypePdf, BsFiletypeTxt, BsFiletypeXlsx } from "react-icons/bs"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
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

export function CManualQuizFileImport() {
    const [isDragOver, setIsDragOver] = useState(false)
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()
    const supportedFormats = [
        {
            ext: ".docx",
            disable: false,
            link: "https://docs.google.com/document/d/1WMmvLP-vBCyMZroB-jhzq-BNkVooBt-KDRA_vGdEyZQ/edit?usp=sharing",
            desc: "Microsoft Word",
            icon: <BsFiletypeDocx size={20} />,
        },
        // { ext: ".xlsx", disable: true, desc: "Microsoft Excel", icon: <BsFiletypeXlsx size={20} /> },
        // { ext: ".pdf", disable: true, desc: "PDF Document", icon: <BsFiletypePdf size={20} /> },
        // { ext: ".txt", disable: true, desc: "Text File", icon: <BsFiletypeTxt size={20} /> },
    ]

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/pdf", // .pdf
            "text/plain", // .txt
        ]
        if (!allowedTypes.includes(file.type)) {
            // alert("Please select a docx, xlsx, pdf, txt file.");
            alert("Please select a docx file.")
            return
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024 // 10MB in bytes
        if (file.size > maxSize) {
            alert("Kích thước tập tin phải nhỏ hơn 3MB.")
            return
        }

        setSelectedFile(file)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
            const reader = new FileReader()
            reader.onload = () => {
                setIsDragOver(false) // Reset drag over state
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(false)

        const file = event.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const downloadTemplate = (link: string) => {
        // In a real app, this would download actual template files
        if (link) {
            window.open(link, "_blank")
        }
    }

    const handleGenerate = async () => {
        try {
            setGeneratedQuiz(null)
            setIsGenerating(true)
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_PYTHON}/quiz`,
                {
                    file: selectedFile,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            toast.success("Quiz đã được tạo thành công!", {
                description: "Bạn có thể xem trước và chỉnh sửa quiz trước khi lưu.",
                duration: 10000,
                position: "top-center",
                action: {
                    label: "Xem trước",
                    onClick: () => setShowPreview(true),
                },
            })
            setGeneratedQuiz({
                title: "",
                subject: "",
                content: "",
                questions: res.data,
            })
        } catch (error: any) {
            console.error("Error generating quiz:", error.message)
            toast.error(error.message || "Đã xảy ra lỗi khi tạo quiz. Vui lòng thử lại sau.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleAddToDraft = () => {
        const draftStorage = localStorage.getItem("draftQuiz")
        const draft = {
            ...generatedQuiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            createdBy: "file",
            status: "draft",
            difficulty: "easy",
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
            action: { label: "Xem nháp", onClick: () => router.push("/quiz/themcauhoi/drafts") },
        })
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Nhập Quiz từ File</h1>
                </div>
                <p className="text-muted-foreground">Tải lên file docx, xlsx, pdf để tự động tạo quiz</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tải lên file</CardTitle>
                            <CardDescription>Kéo thả file hoặc click để chọn file từ máy tính</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="">
                                <div autoFocus className={`cursor-pointer hover:border-primary/50 hover:bg-primary/5 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={handleButtonClick} onDrop={handleDrop}>
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="p-3 bg-muted rounded-full">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Tải lên tệp hoặc kéo và thả</p>
                                            {/* <p className="text-xs text-muted-foreground">DOCX, XLSX, PDF, TXT tới 3MB</p> */}
                                            <p className="text-xs text-muted-foreground">DOCX tới 3MB</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedFile && (
                                    <div className="mt-3 flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-8 w-8 text-blue-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate max-w-[365px]">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {/* <input ref={fileInputRef} type="file" accept=".docx,.doc,.xlsx,.pdf,.txt" onChange={handleFileChange} className="hidden" /> */}
                                <input ref={fileInputRef} type="file" accept=".docx" onChange={handleFileChange} className="hidden" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mẫu file hỗ trợ</CardTitle>
                            <CardDescription>Tải xuống mẫu file để tạo quiz theo đúng định dạng</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-3">
                                {supportedFormats.map((format) => (
                                    <Button key={format.ext} variant="outline" disabled={format.disable} className="justify-start h-auto p-3" onClick={() => downloadTemplate(format.link || "")}>
                                        <div className="flex items-center space-x-3">
                                            <div className="">{format.icon}</div>
                                            <div className="text-left">
                                                <p className="font-medium">{format.desc}</p>
                                                <p className="text-xs text-muted-foreground">{format.ext}</p>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Button size="lg" className="dark:text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" onClick={handleGenerate} disabled={!selectedFile || isGenerating}>
                        {isGenerating ? (
                            <>
                                <Bot className="mr-2 h-4 w-4 animate-spin" />
                                Đang tạo quiz ...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {generatedQuiz ? "Tạo lại quiz" : "Tạo quiz từ file"}
                            </>
                        )}
                    </Button>
                    {generatedQuiz && (
                        <div className="space-y-4 mt-10">
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                    <span className="text-lg font-medium text-green-700 dark:text-gray-400">Quiz đã được tạo thành công!</span>
                                </div>
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
                    {generatedQuiz && <AIResultPreview open={showPreview} onOpenChange={setShowPreview} quiz={generatedQuiz} setOpenAddMoreInfo={setOpenAddMoreInfo} setGeneratedQuiz={setGeneratedQuiz} />}
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Định dạng hỗ trợ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {supportedFormats.map((format) => (
                                <div key={format.ext} className={`flex items-center justify-between ${format.disable ? "opacity-50 cursor-not-allowed" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        <div>{format.icon}</div>
                                        <span className="text-sm">{format.desc}</span>
                                    </div>
                                    <Badge variant="outline">{format.ext}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-800/50 dark:to-emerald-800/50 dark:border-green-700">
                        <CardContent className="p-4">
                            <div className="text-center space-y-3">
                                <Download className="h-8 w-8 text-green-500 mx-auto" />
                                <div>
                                    <p className="font-medium text-sm">Hướng dẫn tạo file</p>
                                    <p className="text-xs text-muted-foreground mt-1">Tải xuống mẫu file để tạo quiz theo đúng cấu trúc</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Lưu ý quan trọng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-xs space-y-2 text-muted-foreground">
                                <li>• File không được vượt quá 3MB</li>
                                <li>• Sử dụng mẫu file để đảm bảo định dạng đúng</li>
                                <li>• Câu hỏi và đáp án phải rõ ràng</li>
                                {/* <li>• Đánh dấu đáp án đúng bằng dấu *</li> */}
                                <li>• Hỗ trợ tiếng Việt có dấu</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
