"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Upload, Sparkles } from "lucide-react";

interface HomeViewProps {
    onViewChange: (view: string) => void;
}

export function HomeView({ onViewChange }: HomeViewProps) {
    const options = [
        {
            id: "ai-create",
            title: "Tạo bằng AI",
            description: "Ra lệnh cho AI thực hiện",
            icon: Bot,
            gradient: "from-purple-500 to-pink-500",
            features: ["Tạo nhanh chóng", "Đa dạng chủ đề", "Tự động tối ưu"],
        },
        {
            id: "manual-create",
            title: "Nhập tạo từ đầu",
            description: "Nhập tay tất cả thông tin",
            icon: FileText,
            gradient: "from-blue-500 to-cyan-500",
            features: ["Kiểm soát hoàn toàn", "Tùy chỉnh chi tiết", "Linh hoạt"],
        },
        {
            id: "file-import",
            title: "Nhập từ file docx, xlsx",
            description: "Từ đề cương, biểu mẫu google, bảng tính,...",
            icon: Upload,
            gradient: "from-green-500 to-emerald-500",
            features: ["Tiết kiệm thời gian", "Hỗ trợ nhiều định dạng", "Chuyển đổi tự động"],
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold">Tạo một bài Quiz mới</h1>
                </div>
                <p className="text-muted-foreground text-lg">Chọn phương thức tạo quiz phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {options.map((option) => (
                    <Card key={option.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => onViewChange(option.id)}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                        <CardHeader className="text-center space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                                <option.icon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{option.title}</CardTitle>
                                <CardDescription className="mt-2">{option.description}</CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <ul className="space-y-2">
                                {option.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient} mr-2`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full bg-gradient-to-r dark:text-white ${option.gradient} hover:opacity-90 transition-opacity`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewChange(option.id);
                                }}>
                                Bắt đầu tạo
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Không chắc chắn phương thức nào phù hợp? Hãy thử{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => onViewChange("ai-create")}>
                        tạo bằng AI
                    </Button>{" "}
                    để bắt đầu nhanh chóng!
                </p>
            </div>
        </div>
    );
}
