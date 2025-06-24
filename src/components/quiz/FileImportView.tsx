"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Eye } from "lucide-react";

export function FileImportView() {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processResult, setProcessResult] = useState<{
        success: boolean;
        questionsFound: number;
        errors: string[];
    } | null>(null);

    const supportedFormats = [
        { ext: ".docx", desc: "Microsoft Word", icon: "📄" },
        { ext: ".xlsx", desc: "Microsoft Excel", icon: "📊" },
        { ext: ".pdf", desc: "PDF Document", icon: "📋" },
        { ext: ".txt", desc: "Text File", icon: "📝" },
    ];

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setUploadedFile(file);
        setUploadProgress(0);
        setIsProcessing(true);
        setProcessResult(null);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            // Simulate processing result
            const isSuccess = Math.random() > 0.3;
            setProcessResult({
                success: isSuccess,
                questionsFound: isSuccess ? Math.floor(Math.random() * 20) + 5 : 0,
                errors: isSuccess ? [] : ["Không thể đọc được định dạng file", "File có thể bị hỏng hoặc mã hóa"],
            });
        }, 3000);
    };

    const downloadTemplate = (format: string) => {
        // In a real app, this would download actual template files
        console.log(`Downloading ${format} template`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-8 w-8 text-green-500" />
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
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}>
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Kéo thả file vào đây</p>
                                    <p className="text-sm text-muted-foreground">hoặc</p>
                                    <Label htmlFor="file-upload">
                                        <Button variant="outline" className="cursor-pointer">
                                            Chọn file từ máy tính
                                        </Button>
                                    </Label>
                                    <Input id="file-upload" type="file" className="hidden" accept=".docx,.xlsx,.pdf,.txt" onChange={handleFileInput} />
                                </div>
                            </div>

                            {uploadedFile && (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                        <FileText className="h-8 w-8 text-blue-500" />
                                        <div className="flex-1">
                                            <p className="font-medium">{uploadedFile.name}</p>
                                            <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>

                                    {isProcessing && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Đang xử lý file...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <Progress value={uploadProgress} />
                                        </div>
                                    )}

                                    {processResult && (
                                        <Alert className={processResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                                            <div className="flex items-center space-x-2">
                                                {processResult.success ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                                                <AlertDescription>
                                                    {processResult.success ? (
                                                        <div>
                                                            <p className="font-medium text-green-800">Xử lý thành công! Tìm thấy {processResult.questionsFound} câu hỏi.</p>
                                                            <div className="mt-2 space-x-2">
                                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                                    <Eye className="mr-1 h-3 w-3" />
                                                                    Xem trước
                                                                </Button>
                                                                <Button size="sm" variant="outline">
                                                                    Chỉnh sửa
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-medium text-red-800">Có lỗi xảy ra:</p>
                                                            <ul className="mt-1 text-sm">
                                                                {processResult.errors.map((error, index) => (
                                                                    <li key={index}>• {error}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </AlertDescription>
                                            </div>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mẫu file hỗ trợ</CardTitle>
                            <CardDescription>Tải xuống mẫu file để tạo quiz theo đúng định dạng</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {supportedFormats.map((format) => (
                                    <Button key={format.ext} variant="outline" className="justify-start h-auto p-3" onClick={() => downloadTemplate(format.ext)}>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{format.icon}</span>
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
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Định dạng hỗ trợ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {supportedFormats.map((format) => (
                                <div key={format.ext} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span>{format.icon}</span>
                                        <span className="text-sm">{format.desc}</span>
                                    </div>
                                    <Badge variant="outline">{format.ext}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
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
                                <li>• File không được vượt quá 10MB</li>
                                <li>• Sử dụng mẫu file để đảm bảo định dạng đúng</li>
                                <li>• Câu hỏi và đáp án phải rõ ràng</li>
                                <li>• Đánh dấu đáp án đúng bằng dấu *</li>
                                <li>• Hỗ trợ tiếng Việt có dấu</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
