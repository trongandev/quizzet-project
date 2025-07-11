"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { BsFiletypeDocx, BsFiletypePdf, BsFiletypeTxt, BsFiletypeXlsx } from "react-icons/bs";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import Loading from "../ui/loading";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Cookies from "js-cookie";
import { POST_API } from "@/lib/fetchAPI";
import { revalidateCache } from "@/lib/revalidate";
export function UploadFileDeCuong() {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const defaultSO = {
        title: "",
        content: "",
    };
    const [tempSO, setTempSO] = useState(defaultSO);
    const token = Cookies.get("token") || "";
    const router = useRouter();
    const supportedFormats = [
        {
            ext: ".docx",
            desc: "Microsoft Word",
            icon: <BsFiletypeDocx size={20} />,
        },
        { ext: ".xlsx", desc: "Microsoft Excel", icon: <BsFiletypeXlsx size={20} /> },
        { ext: ".pdf", desc: "PDF Document", icon: <BsFiletypePdf size={20} /> },
        { ext: ".txt", desc: "Text File", icon: <BsFiletypeTxt size={20} /> },
    ];

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/pdf", // .pdf
            "text/plain", // .txt
        ];
        if (!allowedTypes.includes(file.type)) {
            alert("Vui lòng chọn đuôi file là: docx, xlsx, pdf, txt file.");
            return;
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert("Kích thước tập tin phải nhỏ hơn 3MB.");
            return;
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const removeVietnameseDiacritics = (str: string): string => {
        if (!str) return str;

        return str
            .normalize("NFD") // Normalize to NFD form to separate base characters and diacritics
            .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
            .replace(/đ/g, "d") // Replace lowercase 'đ'
            .replace(/Đ/g, "D"); // Replace uppercase 'Đ'
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
            const originalName = file.name;
            const newName = removeVietnameseDiacritics(originalName);

            // Tạo một File object mới với tên đã được đổi
            const newFile = new File([file], newName, {
                type: file.type,
                lastModified: file.lastModified,
            });
            setSelectedFile(newFile);
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

    const handleGetTypeFile = (file?: string) => {
        if (!file) return "";
        if (file.includes("word") || file.includes("msword")) {
            return "docx";
        } else if (file.includes("excel") || file.includes("sheet")) {
            return "xlsx";
        } else if (file.includes("pdf")) {
            return "pdf";
        } else if (file.includes("text") || file.includes("plain")) {
            return "txt";
        }
        return "";
    };

    const handleUploadFileDeCuong = async () => {
        try {
            setIsGenerating(true);
            const result = await axios.post(
                `${process.env.API_ENDPOINT}/upload/file`,
                {
                    file: selectedFile,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newData = {
                title: tempSO.title,
                content: tempSO.content,
                link: result.data.url,
                file_size: selectedFile?.size || 0,
                type: handleGetTypeFile(selectedFile?.type),
            };
            const req = await POST_API("/so", newData, "POST", token);
            const res = await req?.json();
            if (res.ok) {
                toast.success("Tải đề cương lên thành công", {
                    duration: 10000,
                    position: "top-center",
                    action: {
                        label: "Xem đề cương",
                        onClick: () => {
                            router.push(`/decuong`);
                        },
                    },
                });
                setTempSO(defaultSO);
                removeFile();
                await revalidateCache({
                    tag: [`de_cuong`],
                });
            } else {
                toast.error(res.message || "Lỗi khi tải đề cương lên", {
                    duration: 10000,
                    position: "top-center",
                });
            }
        } catch (error: any) {
            console.error("Error generating quiz:", error.message);
            toast.error(error.message, { duration: 10000, position: "top-center" });
        } finally {
            setIsGenerating(false);
        }
    };
    const handleSetValueTempSO = (field: keyof typeof tempSO, value: string) => {
        setTempSO((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Chia sẻ đề cương</h1>
                </div>
                <p className="text-muted-foreground">Tải lên file docx, xlsx, pdf để chia sẻ cho cộng đồng các tài liệu, đề cương</p>
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
                                            <p className="text-sm font-medium">Tải lên tệp hoặc kéo và thả</p>
                                            <p className="text-xs text-muted-foreground">DOCX, XLSX, PDF, TXT tới 3MB</p>
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

                                <input ref={fileInputRef} type="file" accept=".docx,.doc,.xlsx,.pdf,.txt" onChange={handleFileChange} className="hidden" />
                            </div>
                            <div className="mt-10">
                                <Label htmlFor="title" className="mb-2 block">
                                    Tên bài quiz*
                                </Label>

                                <Input id="title" name="name" placeholder="Nhập tên bài quiz" value={tempSO.title} onChange={(e) => handleSetValueTempSO("title", e.target.value)} required />
                            </div>
                            <div className=" mt-3">
                                <Label htmlFor="content" className="mb-2 block">
                                    Nội dung
                                </Label>
                                <Textarea
                                    className="h-12"
                                    id="content"
                                    name="username"
                                    placeholder="Nhập nội dung"
                                    value={tempSO.content}
                                    maxLength={200}
                                    onChange={(e) => handleSetValueTempSO("content", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        size="lg"
                        className="dark:text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                        onClick={handleUploadFileDeCuong}
                        disabled={!selectedFile || isGenerating || !tempSO.title}>
                        {isGenerating ? <Loading /> : <Upload className="mr-2 h-4 w-4" />}
                        Đẩy file lên server để lưu trữ
                    </Button>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Định dạng hỗ trợ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {supportedFormats.map((format) => (
                                <div key={format.ext} className={`flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <div>{format.icon}</div>
                                        <span className="text-sm">{format.desc}</span>
                                    </div>
                                    <Badge variant="outline">{format.ext}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
