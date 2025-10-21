"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, Plus, Settings, Eye } from "lucide-react";
import { SidebarTrigger } from "../../ui/sidebar";

export function ManualCreateView() {
    const [quizInfo, setQuizInfo] = useState({
        title: "",
        description: "",
        category: "",
        timeLimit: "",
        passingScore: "",
        shuffleQuestions: false,
        showResults: true,
        allowRetake: true,
    });

    const categories = ["Giáo dục", "Kinh doanh", "Công nghệ", "Khoa học", "Nghệ thuật", "Thể thao", "Giải trí", "Khác"];

    const handleInfoChange = (field: string, value: string | boolean) => {
        setQuizInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateQuiz = () => {
        // Navigate to quiz editor
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Tạo Quiz từ đầu</h1>
                </div>
                <p className="text-muted-foreground">Tạo quiz hoàn toàn tùy chỉnh theo ý muốn của bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>Nhập thông tin chính về quiz của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Tiêu đề quiz *</Label>
                                <Input
                                    id="title"
                                    placeholder="VD: Kiểm tra kiến thức Toán học lớp 10"
                                    value={quizInfo.title}
                                    onChange={(e) => handleInfoChange("title", e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả ngắn gọn về nội dung và mục đích của quiz..."
                                    value={quizInfo.description}
                                    onChange={(e) => handleInfoChange("description", e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Danh mục</Label>
                                <Select value={quizInfo.category} onValueChange={(value) => handleInfoChange("category", value)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5" />
                                <span>Cài đặt quiz</span>
                            </CardTitle>
                            <CardDescription>Cấu hình các tùy chọn cho quiz</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="timeLimit">Thời gian giới hạn (phút)</Label>
                                    <Input
                                        id="timeLimit"
                                        type="number"
                                        placeholder="VD: 30"
                                        value={quizInfo.timeLimit}
                                        onChange={(e) => handleInfoChange("timeLimit", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="passingScore">Điểm đạt (%)</Label>
                                    <Input
                                        id="passingScore"
                                        type="number"
                                        placeholder="VD: 70"
                                        value={quizInfo.passingScore}
                                        onChange={(e) => handleInfoChange("passingScore", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Trộn câu hỏi</Label>
                                        <p className="text-sm text-muted-foreground">Hiển thị câu hỏi theo thứ tự ngẫu nhiên</p>
                                    </div>
                                    <Switch checked={quizInfo.shuffleQuestions} onCheckedChange={(checked: any) => handleInfoChange("shuffleQuestions", checked)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hiển thị kết quả</Label>
                                        <p className="text-sm text-muted-foreground">Cho phép người dùng xem kết quả sau khi hoàn thành</p>
                                    </div>
                                    <Switch checked={quizInfo.showResults} onCheckedChange={(checked: any) => handleInfoChange("showResults", checked)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Cho phép làm lại</Label>
                                        <p className="text-sm text-muted-foreground">Người dùng có thể làm quiz nhiều lần</p>
                                    </div>
                                    <Switch checked={quizInfo.allowRetake} onCheckedChange={(checked: any) => handleInfoChange("allowRetake", checked)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview/Next Steps */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Eye className="h-5 w-5" />
                                <span>Xem trước</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tiêu đề:</p>
                                <p className="font-medium">{quizInfo.title || "Chưa có tiêu đề"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Danh mục:</p>
                                <p className="font-medium">{quizInfo.category || "Chưa chọn"}</p>
                            </div>

                            {quizInfo.timeLimit && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Thời gian:</p>
                                    <p className="font-medium">{quizInfo.timeLimit} phút</p>
                                </div>
                            )}

                            {quizInfo.passingScore && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Điểm đạt:</p>
                                    <p className="font-medium">{quizInfo.passingScore}%</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-800/50 to:cyan-800/50">
                        <CardContent className="p-4">
                            <div className="text-center space-y-3">
                                <Plus className="h-8 w-8 text-blue-500 mx-auto" />
                                <div>
                                    <p className="font-medium text-sm">Bước tiếp theo</p>
                                    <p className="text-xs text-muted-foreground mt-1">Sau khi tạo quiz, bạn sẽ có thể thêm câu hỏi và tùy chỉnh chi tiết</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Mẹo tạo quiz hiệu quả</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-xs space-y-2 text-muted-foreground">
                                <li>• Đặt tiêu đề rõ ràng, dễ hiểu</li>
                                <li>• Mô tả ngắn gọn về nội dung</li>
                                <li>• Chọn thời gian phù hợp với độ khó</li>
                                <li>• Điểm đạt nên từ 60-80%</li>
                                <li>• Trộn câu hỏi để tránh gian lận</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center gap-4 flex-col md:flex-row">
                <Button variant="outline" size="lg">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90" onClick={handleCreateQuiz} disabled={!quizInfo.title.trim()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo quiz và thêm câu hỏi
                </Button>
            </div>
        </div>
    );
}
