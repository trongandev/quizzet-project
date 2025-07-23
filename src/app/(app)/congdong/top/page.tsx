"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Medal, Award, Trophy, Flame, Eye, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { IPodiumUser } from "@/types/type"
import { useSocket } from "@/context/socketContext"
import { useUser } from "@/context/userContext"
import Link from "next/link"

import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Loading from "@/components/ui/loading"
import { useRouter } from "next/navigation"

export default function TopUserPage() {
    const [podiumUsers, setPodiumUsers] = useState<IPodiumUser[]>([])
    const [currentUser, setCurrentUser] = useState<IPodiumUser | null>(null)
    const [limit] = useState(10)
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const { onlineUsers } = useSocket()
    const { user } = useUser() || {}
    console.log(user)
    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const res = await GET_API_WITHOUT_COOKIE(`/gamification/top?limit=${limit}&skip=${skip}&user_id=${user?._id}`)
            if (res?.ok) {
                console.log(res)
                setPodiumUsers(res?.topUsers || [])
                setCurrentUser(res?.currentUser || null)
                setHasMore(res?.hasMore)
                setSkip(skip + limit)
            }
            setLoading(false)
        }
        fetchAPI()
    }, [limit, user?._id])

    const handleLoadMore = async () => {
        if (loadingMore) return
        setLoadingMore(true)
        const res = await GET_API_WITHOUT_COOKIE(`/gamification/top?limit=${limit}&skip=${skip}&user_id=${user?._id}`)
        if (res?.ok) {
            setPodiumUsers((prev) => [...prev, ...(res?.topUsers || [])])
            setCurrentUser(res?.currentUser || null)
            setSkip(skip + limit)
        }
        setLoadingMore(false)
    }
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />
            default:
                return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
        }
    }

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold">
                        <Crown className="h-3 w-3 mr-1" />
                        Vua Quiz
                    </Badge>
                )
            case 2:
                return (
                    <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-black font-bold">
                        <Medal className="h-3 w-3 mr-1" />Á Vương
                    </Badge>
                )
            case 3:
                return (
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold">
                        <Award className="h-3 w-3 mr-1" />
                        Hạng Ba
                    </Badge>
                )
            default:
                return null
        }
    }

    const checkOnline = (userId: string) => {
        return onlineUsers?.find((item: any) => item?._id === userId)
    }
    const router = useRouter()
    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] min-h-screen py-5 pt-16 px-2 md:px-0">
                <div className="lg:col-span-2 mt-5">
                    <Button onClick={() => router.back()} variant="secondary">
                        <ChevronLeft /> Quay về
                    </Button>
                    <Card className="dark:bg-slate-700 mt-2 ">
                        <CardHeader className="p-3 md:p-6">
                            <CardTitle className="dark:text-white flex items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-800/50">
                                    <Trophy size={20} className=" text-yellow-500" />
                                </div>
                                <div className="">
                                    <p className="dark:text-white/80 mb-1">Bảng Xếp Hạng TOP 10 </p>
                                    <p className="text-xs dark:text-slate-400 text-slate-500">Thành tích của các thành viên xuất sắc nhất</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className=" p-3 md:p-6">
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {podiumUsers.map((us, index) => (
                                    <Link href={`/profile/${us.user_id._id}`} key={index} className={cn("flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-lg transition-all dark:hover:bg-slate-600/50", index <= 2 ? "dark:bg-slate-600/30 border dark:border-slate-500" : "dark:bg-slate-600/20", us?.user_id?._id == user?._id && "bg-green-500/20 dark:bg-green-700/20")}>
                                        {/* Rank */}
                                        <div className="flex items-center justify-center w-8">{getRankIcon(index + 1)}</div>

                                        {/* Avatar with online status */}
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={us.user_id.profilePicture} alt={us.user_id.displayName} className="object-cover" />
                                                <AvatarFallback className="dark:bg-slate-500 dark:text-white">
                                                    {us.user_id.displayName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            {checkOnline(us.user_id._id) && <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold  dark:text-white truncate">{us.user_id.displayName}</h3>
                                                {checkOnline(us.user_id._id) && (
                                                    <Badge variant="secondary" className="hidden md:block bg-green-500/20 text-green-400 text-xs">
                                                        Đang online
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-slate-400">
                                                <span>Level {us.level}</span>
                                                <span className="hidden md:block">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Flame size={14} className=" stroke-yellow-500" />
                                                    {us.dailyStreak.current} ngày
                                                </span>
                                            </div>
                                            {/* {us.badges && us.badges.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {us.badges.slice(0, 2).map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-slate-500 text-slate-300">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )} */}
                                        </div>

                                        {/* Rank Badge */}
                                        <div className="flex flex-col items-end gap-1">
                                            {getRankBadge(index + 1)}
                                            <div className="text-right">
                                                <div className="text-lg font-bold dark:text-white">{us.xp.toLocaleString()}</div>
                                                <div className="text-xs text-slate-400">XP</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <div className="w-full text-center">
                                    {!loading && (
                                        <Button variant="secondary" onClick={handleLoadMore} disabled={loadingMore && hasMore} className="w-full">
                                            {loadingMore ? <Loading /> : <Eye />}
                                            Xem thêm
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {user && currentUser && (
                                <Link href={`/profile/${currentUser.user_id._id}`} key={currentUser.user_id._id} className={cn("flex items-center gap-2 p-2 md:gap-4 md:p-4 mt-3 rounded-lg transition-all dark:hover:bg-slate-600/50 bg-green-500/20 dark:bg-green-700/20")}>
                                    {/* Rank */}
                                    <div className="flex items-center justify-center w-8">{getRankIcon(currentUser.rank)}</div>

                                    {/* Avatar with online status */}
                                    <div className="relative">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={currentUser.user_id.profilePicture} alt={currentUser.user_id.displayName} className="object-cover" />
                                            <AvatarFallback className="dark:bg-slate-500 dark:text-white">
                                                {currentUser.user_id.displayName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        {checkOnline(currentUser.user_id._id) && <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold dark:text-white truncate">{currentUser.user_id.displayName}</h3>
                                            {checkOnline(currentUser.user_id._id) && (
                                                <Badge variant="secondary" className="hidden md:block bg-green-500/20 text-green-400 text-xs">
                                                    Đang online
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-slate-400">
                                            <span>Level {currentUser.level}</span>
                                            <span className="hidden md:block">•</span>
                                            <span className="flex items-center gap-1">
                                                <Flame size={14} className=" stroke-yellow-500" />
                                                {currentUser.dailyStreak.current} ngày
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rank Badge */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-right">
                                            <div className="text-lg font-bold dark:text-white">{currentUser.xp.toLocaleString()}</div>
                                            <div className="text-xs text-slate-400">XP</div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {loading && (
                                <div className="flex items-center justify-center h-[500px]">
                                    <Loading className="w-10 h-10" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
