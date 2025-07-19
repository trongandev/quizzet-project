"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, BookOpen, Plus, Trophy, MessageSquare, Lock, LockOpen } from "lucide-react"
import { IGamification } from "@/types/type"
import { TASKS_DEFINITION } from "@/app/config/task-gamification.config"

interface DailyTask {
    id: string
    name: string
    xpReward: number
    dailyLimit: number
    requiredLevel: number
    icon: React.ReactNode
    currentProgress: number
    maxProgress: number
    isUnlocked: boolean
}
export default function InstructionEarnLevel({ gamificationProfile }: { gamificationProfile: IGamification }) {
    console.log("gamificationProfile", gamificationProfile)
    const [currentLevel] = useState(8) // Giả sử người dùng đang ở cấp 8
    const [timeUntilReset, setTimeUntilReset] = useState("")
    const [tasks, setTasks] = useState<DailyTask[]>([])

    useEffect(() => {
        const processedTasks = Object.keys(TASKS_DEFINITION).map((taskId) => {
            const definition = TASKS_DEFINITION[taskId as keyof typeof TASKS_DEFINITION]
            const progress = gamificationProfile.dailyProgress.tasks.find((p) => p.taskId === taskId)

            const currentCount = progress ? progress.count : 0
            const maxCount = definition.dailyLimitCount

            return {
                id: taskId,
                name: definition.name,
                xpReward: definition.xpPerAction,
                dailyLimit: maxCount * definition.xpPerAction,
                requiredLevel: definition.unlockLevel,
                icon: <definition.icon className="w-5 h-5" />,
                currentProgress: currentCount * definition.xpPerAction,
                maxProgress: maxCount * definition.xpPerAction,
                isUnlocked: gamificationProfile.level >= definition.unlockLevel,
            }
        })

        setTasks(processedTasks)
    }, [gamificationProfile, tasks])

    useEffect(() => {
        const calculateTimeUntilReset = () => {
            const now = new Date()
            const vietnam = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }))
            const tomorrow = new Date(vietnam)
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(7, 0, 0, 0)

            const diff = tomorrow.getTime() - vietnam.getTime()
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`)
        }

        calculateTimeUntilReset()
        const interval = setInterval(calculateTimeUntilReset, 60000)

        return () => clearInterval(interval)
    }, [])

    const getProgressPercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100)
    }

    const getCompletionCount = (current: number, xpReward: number) => {
        return Math.floor(current / xpReward)
    }
    return (
        <div className="">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-400" />
                        <h1 className="text-2xl font-bold">Nhiệm vụ làm mới mỗi ngày</h1>
                    </div>
                    <Badge variant="outline" className="text-indigo-400 border-indigo-400">
                        Làm mới sau: {timeUntilReset}
                    </Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => {
                    return (
                        <Card key={task.id} className={`bg-slate-800 border-slate-700 transition-all hover:bg-slate-750 ${!task.isUnlocked ? "opacity-60" : ""}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between ">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${task.isUnlocked ? "bg-blue-600" : "bg-slate-600"}`}>{task.isUnlocked ? task.icon : <Lock className="w-5 h-5" />}</div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{task.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <span>+{task.xpReward.toLocaleString()} XP mỗi lần</span>
                                                <span>•</span>
                                                <span className="flex gap-1 items-center">
                                                    <LockOpen size={14} /> Cấp {task.requiredLevel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {task.isUnlocked && (
                                        <div className="text-right mt-4">
                                            <div className="text-2xl font-bold text-green-400">+{task.currentProgress.toLocaleString()} XP</div>
                                            <div className="text-s text-slate-400">{getCompletionCount(task.currentProgress, task.xpReward)} lần</div>
                                        </div>
                                    )}

                                    {!task.isUnlocked && (
                                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                                            Cần cấp {task.requiredLevel}
                                        </Badge>
                                    )}
                                </div>

                                {task.isUnlocked && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Tiến độ hôm nay</span>
                                            <span className="text-slate-300">
                                                {task.currentProgress.toLocaleString()} / {task.dailyLimit.toLocaleString()} XP
                                            </span>
                                        </div>
                                        <Progress value={getProgressPercentage(task.currentProgress, task.dailyLimit)} className="h-2 bg-slate-700" />
                                        {task.currentProgress >= task.dailyLimit && <Badge className="bg-green-600 hover:bg-green-700">Đã hoàn thành tối đa</Badge>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {/* Summary */}
            <Card className="mt-8 bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Tổng kết hôm nay
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">+{tasks.reduce((sum, task) => sum + (task.isUnlocked ? task.currentProgress : 0), 0).toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Tổng XP kiếm được</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                {tasks.filter((task) => task.isUnlocked && task.currentProgress > 0).length}/{tasks.filter((task) => task.isUnlocked).length}
                            </div>
                            <div className="text-sm text-slate-400">Nhiệm vụ đã tham gia</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{tasks.filter((task) => task.isUnlocked && task.currentProgress >= task.dailyLimit).length}</div>
                            <div className="text-sm text-slate-400">Nhiệm vụ hoàn thành</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
