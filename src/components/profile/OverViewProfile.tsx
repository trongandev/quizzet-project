import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Calendar, Crown } from "lucide-react"
import Image from "next/image"
import { IGamification, ILevel } from "@/types/type"

export default function OverViewProfile({ gamificationProfile, levels }: { gamificationProfile: IGamification; levels: ILevel[] }) {
    const currentLevel = levels[gamificationProfile.level]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Hoạt động gần đây
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* <div className="flex items-center gap-3 text-sm">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span>Hoàn thành 15 thẻ Văn học</span>
                                            <span className="text-slate-400 ml-auto">2h</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span>Thêm 5 thẻ mới</span>
                                            <span className="text-slate-400 ml-auto">1d</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span>Đạt chuỗi 12 ngày</span>
                                            <span className="text-slate-400 ml-auto">1d</span>
                                        </div> */}
                    <div className="text-sm">Chưa có hoạt động nào...</div>
                </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Thống kê tuần
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Thẻ đã học</span>
                        <span className="font-bold text-green-400">1</span>
                    </div>
                    <div className="flex justify-between">
                        <span>XP kiếm được</span>
                        <span className="font-bold text-yellow-400">10</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Độ chính xác</span>
                        <span className="font-bold text-blue-400">87%</span>
                    </div>
                </CardContent>
            </Card>

            {/* Next Level Preview */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-400" />
                        Cấp độ tiếp theo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center  bg-gradient-to-br from-indigo-400 to-indigo-600 ring-4 ring-indigo-500/50`}>
                            <Image src={currentLevel.levelIcon} alt="" width={40} height={40} />
                        </div>

                        <h3 className="font-bold">Cấp {gamificationProfile.level + 1}</h3>
                        <p className="text-sm text-slate-400">{currentLevel.name}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-400">Còn {currentLevel.xpRequired - gamificationProfile.xp} XP</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
