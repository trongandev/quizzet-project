"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, BookOpen, Plus, Trophy, MessageSquare, Lock, LockOpen, ClipboardList, RotateCw } from "lucide-react"
import { IGamification, TASKS } from "@/types/type"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { GET_API } from "@/lib/fetchAPI"
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
export default function DailyTask({ gamificationProfile, setGamificationProfile, tasks }: { gamificationProfile: IGamification; setGamificationProfile: any; tasks: TASKS }) {
    const [timeUntilReset, setTimeUntilReset] = useState("")
    const [taskDaily, setTaskDaily] = useState<DailyTask[]>([])
    const [countTask, setCountTask] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const IComponent: any = {
            BookOpen: BookOpen,
            Plus: Plus,
            Trophy: Trophy,
            Star: Star,
            MessageSquare: MessageSquare,
        }
        let count = 0
        const processedTasks = Object.keys(tasks).map((taskId) => {
            const definition = tasks[taskId as keyof typeof tasks]
            const progress = gamificationProfile?.dailyProgress?.tasks?.find((p) => p.taskId === taskId)

            const currentCount = progress ? progress.count : 0
            const maxCount = definition.dailyLimitCount
            const IconComponent = IComponent[definition.icon] || BookOpen
            // đếm số lượng nhiệm vụ đang có sẵn
            if (gamificationProfile.level >= definition.unlockLevel) {
                count++
            }

            return {
                id: taskId,
                name: definition.name,
                xpReward: definition.xpPerAction,
                dailyLimit: maxCount * definition.xpPerAction,
                requiredLevel: definition.unlockLevel,
                icon: <IconComponent className="w-5 h-5" />,
                currentProgress: currentCount * definition.xpPerAction,
                maxProgress: maxCount * definition.xpPerAction,
                isUnlocked: gamificationProfile.level >= definition.unlockLevel,
            }
        })
        setCountTask(count)
        setTaskDaily(processedTasks)
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

    const handleReloadDailyTasks = async () => {
        try {
            setLoading(true)
            const token = Cookies.get("token") || ""
            const res = await GET_API("/gamification", token)
            if (res.ok) {
                setGamificationProfile(res.gamificationProfile)
                toast.success("Đã làm mới nhiệm vụ", { position: "top-center" })
            } else {
                toast.error("Lỗi khi làm mới nhiệm vụ", { description: res.message, position: "top-center" })
            }
        } catch (error: any) {
            console.error("Error reloading daily tasks:", error)
            toast.error("Lỗi khi làm mới nhiệm vụ", { description: error.message, position: "top-center" })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white relative">
                    {countTask > 0 && <div className="absolute -top-1 -right-1 h-[14px] w-[14px] text-[8px] rounded-full bg-red-500 text-white flex items-center justify-center font-mono tabular-nums">{countTask}</div>}
                    <ClipboardList size={18} />
                </div>
            </PopoverTrigger>
            <PopoverContent className="md:w-[400px] max-h-[400px] md:max-h-[600px] overflow-y-scroll dark:text-white">
                <div className="">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-4 mb-4 flex-col">
                            <div className="flex items-center gap-2">
                                <Zap className="w-6 h-6 text-indigo-400" />
                                <h1 className="text-2xl font-bold">Nhiệm vụ làm mới mỗi ngày</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-indigo-400 border-indigo-400">
                                    Làm mới sau: {timeUntilReset}
                                </Badge>
                                <Button size="sm" variant="secondary" onClick={handleReloadDailyTasks} disabled={loading}>
                                    <RotateCw className={`${loading && "animate-spin"} `} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {taskDaily.map((task) => {
                            return (
                                <Card key={task.id} className={`dark:bg-slate-800 dark:border-white/10 transition-all hover:bg-slate-750 ${!task.isUnlocked ? "opacity-60" : ""}`}>
                                    <CardContent className="px-4 !p-4">
                                        <div className="flex items-center justify-between ">
                                            <div className="flex items-center gap-3">
                                                <div className={`hidden md:block p-2 rounded-lg ${task.isUnlocked ? "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-blue-200" : "bg-slate-300 text-slate-600 dark:text-slate-200 dark:bg-slate-600 "}`}>{task.isUnlocked ? task.icon : <Lock className="w-5 h-5" />}</div>
                                                <div className="text-slate-800 dark:text-slate-400">
                                                    <h3 className="font-semibold text-md md:text-lg">{task.name}</h3>
                                                    <div className="flex flex-col  md:flex-row md:items-center gap-2 text-sm ">
                                                        <span>+{task.xpReward.toLocaleString()} XP/lần</span>
                                                        <span className="flex gap-1 items-center">
                                                            <LockOpen size={14} />
                                                            Cấp {task.requiredLevel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {task.isUnlocked && (
                                                <div className="text-right mt-4">
                                                    <div className="text-xl font-bold text-green-600 dark:text-green-400">+{task.currentProgress.toLocaleString()} XP</div>
                                                    <div className="text-sm text-slate-800 dark:text-slate-400">{getCompletionCount(task.currentProgress, task.xpReward)} lần</div>
                                                </div>
                                            )}

                                            {!task.isUnlocked && (
                                                <Badge variant="secondary" className="bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                    Cần cấp {task.requiredLevel}
                                                </Badge>
                                            )}
                                        </div>

                                        {task.isUnlocked && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-600 dark:text-slate-400">Tiến độ hôm nay</span>
                                                    <span className="text-slate-500 dark:text-slate-300">
                                                        {task.currentProgress.toLocaleString()} / {task.dailyLimit.toLocaleString()} XP
                                                    </span>
                                                </div>
                                                <Progress value={getProgressPercentage(task.currentProgress, task.dailyLimit)} className="h-2 dark:bg-slate-700" />
                                                {task.currentProgress >= task.dailyLimit && <Badge className="bg-green-600 hover:bg-green-700 text-white">Đã hoàn thành tối đa</Badge>}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                    {/* Summary */}
                    <Card className="mt-8 dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-blue-400" />
                                Tổng kết hôm nay
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{taskDaily.reduce((sum, task) => sum + (task.isUnlocked ? task.currentProgress : 0), 0).toLocaleString()}</div>
                                    <div className="text-sm text-slate-400">Tổng XP kiếm được</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {taskDaily.filter((task) => task.isUnlocked && task.currentProgress > 0).length}/{taskDaily.filter((task) => task.isUnlocked).length}
                                    </div>
                                    <div className="text-sm text-slate-400">Nhiệm vụ đã tham gia</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{taskDaily.filter((task) => task.isUnlocked && task.currentProgress >= task.dailyLimit).length}</div>
                                    <div className="text-sm text-slate-400">Nhiệm vụ hoàn thành</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PopoverContent>
        </Popover>
    )
}
