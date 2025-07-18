import React, { useEffect, useState } from "react"
import { Trophy, Star, Flame, BookOpen, Target, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IAchievement, IGamification } from "@/types/type"

export default function Achievement({ gamificationProfile, achievements }: { gamificationProfile: IGamification[]; achievements: IAchievement[] }) {
    const achievement = [
        { id: 1, name: "Học giả mới", description: "Hoàn thành ôn tập 10 thẻ đầu tiên", icon: BookOpen, earned: true },
        { id: 2, name: "Người sưu tầm từ vựng", description: "Thêm 20 thẻ mới", icon: Star, earned: true },
        { id: 3, name: "Chuỗi liên tiếp 7 ngày", description: "Học liên tiếp 7 ngày", icon: Flame, earned: true },
        { id: 4, name: "Chiến binh từ vựng", description: "Ôn tập 100 thẻ", icon: Trophy, earned: false },
        { id: 5, name: "Hoàn hảo", description: "Đánh giá 20 thẻ là 'Hoàn hảo' (5/5)", icon: Target, earned: false },
        { id: 6, name: "Dậy sớm học bài", description: "Hoàn thành phiên ôn tập trước 7h sáng", icon: Award, earned: false },
    ]

    // const [unlockedAchievementIds, setUnlockedAchievementIds] = useState(new Set())
    // useEffect(() => {
    //     const unlockedIds = new Set(gamificationProfile.map((item) => item._id))
    //     setUnlockedAchievementIds(unlockedIds)
    // }, [gamificationProfile])
    console.log("gamificationProfile:", gamificationProfile)
    return (
        <div>
            {" "}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Thành tựu</h2>
                {/* <Badge variant="secondary" className="dark:bg-slate-700">
                    {achievements.filter((a) => a.earned).length}/{achievements.length} đã đạt
                </Badge> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievement.map((achievement) => {
                    const AchievementIcon = achievement.icon
                    return (
                        <Card key={achievement.id} className={`dark:border-slate-700 ${achievement.earned ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-600/30" : "dark:bg-slate-800"}`}>
                            <CardContent className="p-6 text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${achievement.earned ? "bg-gradient-to-br from-yellow-500 to-orange-600 dark:from-yellow-800 dark:to-orange-900" : "dark:bg-slate-700"}`}>
                                    <AchievementIcon className={`w-8 h-8 ${achievement.earned ? "text-white" : "text-slate-400"}`} />
                                </div>
                                <h3 className={`font-bold mb-2 ${achievement.earned ? "text-yellow-400" : "text-slate-300"}`}>{achievement.name}</h3>
                                <p className="text-sm text-slate-400">{achievement.description}</p>
                                {achievement.earned && <Badge className="mt-3 bg-yellow-600 text-white">Đã đạt được</Badge>}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
