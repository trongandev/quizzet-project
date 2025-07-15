"use client";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BookOpen, Brain, Target, Award, Crown, Gem, Zap, Shield, Sparkles } from "lucide-react";
export default function LevelProfile() {
    const levelConfig: Record<number, { name: string; icon: any; color: string; bgColor: string }> = {
        1: { name: "Học viên tập sự", icon: BookOpen, color: "from-gray-400 to-gray-600", bgColor: "bg-gray-100" },
        2: { name: "Người khám phá từ vựng", icon: Target, color: "from-green-400 to-green-600", bgColor: "bg-green-100" },
        3: { name: "Người làm chủ chữ cái", icon: Brain, color: "from-blue-400 to-blue-600", bgColor: "bg-blue-100" },
        4: {
            name: "Kiến trúc sư ngôn ngữ sơ cấp",
            icon: Star,
            color: "from-purple-400 to-purple-600",
            bgColor: "bg-purple-100",
        },
        5: { name: "Nhà xây dựng từ ngữ", icon: Award, color: "from-orange-400 to-orange-600", bgColor: "bg-orange-100" },
        8: { name: "Thợ rèn từ", icon: Zap, color: "from-yellow-400 to-yellow-600", bgColor: "bg-yellow-100" },
        12: { name: "Người kể chuyện", icon: Sparkles, color: "from-pink-400 to-pink-600", bgColor: "bg-pink-100" },
        18: { name: "Chuyên gia giao tiếp", icon: Shield, color: "from-indigo-400 to-indigo-600", bgColor: "bg-indigo-100" },
        25: { name: "Bậc thầy ngôn ngữ", icon: Crown, color: "from-red-400 to-red-600", bgColor: "bg-red-100" },
        30: { name: "Huyền thoại ngôn ngữ", icon: Gem, color: "from-violet-400 to-violet-600", bgColor: "bg-violet-100" },
    };
    const [currentLevel] = useState(1);
    const [currentXP] = useState(10);
    const nextLevel = currentLevel + 1;
    const xpForNextLevel = nextLevel * 100;

    return (
        <div>
            {" "}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tất cả cấp độ</h2>
                <Badge variant="secondary" className="dark:bg-slate-700">
                    {Object.keys(levelConfig).length} cấp độ
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(levelConfig).map(([level, config]) => {
                    const LevelIconComponent = config.icon;
                    const isCurrentLevel = Number.parseInt(level) === currentLevel;
                    const isUnlocked = Number.parseInt(level) <= currentLevel;

                    return (
                        <Card
                            key={level}
                            className={`dark:border-slate-700 ${
                                isCurrentLevel
                                    ? "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-600/50"
                                    : isUnlocked
                                    ? "dark:bg-slate-800"
                                    : "dark:bg-slate-800/50"
                            }`}>
                            <CardContent className="p-6 text-center">
                                <div
                                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isUnlocked ? `bg-gradient-to-br ${config.color}` : "dark:bg-slate-700"} ${
                                        isCurrentLevel ? "ring-4 ring-blue-500/50" : ""
                                    }`}>
                                    <LevelIconComponent className={`w-10 h-10 ${isUnlocked ? "text-white" : "text-slate-500"}`} />
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h3 className={`font-bold text-lg ${isCurrentLevel ? "text-blue-400" : isUnlocked ? "text-white" : "text-slate-400"}`}>Cấp {level}</h3>
                                    {isCurrentLevel && <Badge className="bg-blue-600 text-white text-xs">Hiện tại</Badge>}
                                </div>

                                <p className={`text-sm mb-3 ${isUnlocked ? "text-blue-800 dark:text-slate-300" : "text-slate-500"}`}>{config.name}</p>

                                <div className="text-xs text-slate-400">
                                    {isUnlocked ? (
                                        Number.parseInt(level) < currentLevel ? (
                                            <span className="text-green-400">✓ Đã mở khóa</span>
                                        ) : Number.parseInt(level) === currentLevel ? (
                                            <span className="text-blue-400">Cấp độ hiện tại</span>
                                        ) : null
                                    ) : (
                                        <span>Cần {Number.parseInt(level) * 100} XP</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Card className="dark:bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        Thông tin cấp độ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-green-400 mb-2">Cách tính XP cho cấp độ</h4>
                            <p className="text-sm text-slate-300">
                                Mỗi cấp độ cần <strong>Cấp × 100 XP</strong> để mở khóa
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Ví dụ: Cấp 10 cần 1,000 XP</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-400 mb-2">Tiến trình của bạn</h4>
                            <p className="text-sm text-slate-300">
                                Bạn đang ở <strong>Cấp {currentLevel}</strong> với <strong>{currentXP} XP</strong>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Còn {xpForNextLevel - currentXP} XP để lên cấp tiếp theo</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
