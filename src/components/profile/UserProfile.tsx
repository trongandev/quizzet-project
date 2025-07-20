"use client"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { IAchievement, IGamification, ILevel, IListFlashcard, IQuiz, IUser } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import { useUser } from "@/context/userContext"
import { Flame, Calendar, Mail } from "lucide-react"
import { Progress } from "../ui/progress"
import UserFC from "../flashcard/UserFC"
import Achievement from "@/components/profile/Achievement"
import LevelProfile from "@/components/profile/LevelProfile"
import OverViewProfile from "@/components/profile/OverViewProfile"
import UpdateProfile from "@/components/profile/UpdateProfile"
import QuizInProfile from "@/components/profile/QuizInProfile"
import Image from "next/image"

// Level configuration with unique designs

interface PropsProfile {
    profile: IUser
    quiz: IQuiz[]
    flashcard: IListFlashcard[]
    achievements: IAchievement[]
    gamificationProfile: IGamification
    levels: ILevel[]
}
export default function UserProfile({ profile, quiz, flashcard, gamificationProfile, achievements, levels }: PropsProfile) {
    const { user, refetchUser } = useUser() || {
        user: null,
        refetchUser: () => {},
    }
    const [userProfile, setUserProfile] = useState<IUser | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    useEffect(() => {
        const tempUser = user?._id === profile?._id ? user : profile
        setUserProfile(tempUser)
    }, [user, profile, refetchUser, setUserProfile])
    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-3">
                <div className="text-gray-500 dark:text-gray-300">Không tìm thấy hồ sơ người dùng.</div>
                <Button className="text-white">Vui lòng đăng nhập lại</Button>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center dark:text-white/80 text-gray-400">
            <div className="w-full md:w-[1000px] xl:w-[1200px] ">
                <div className="p-2 md:px-5 py-20 flex flex-col gap-5 min-h-screen">
                    <Card className="mb-8 dark:border-white/10 dark:bg-slate-800/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg dark:border-white/10">
                                    <AvatarImage src={userProfile?.profilePicture} alt={userProfile?.displayName} className="object-cover" />
                                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {userProfile?.displayName
                                            ? userProfile?.displayName
                                                  .split(" ")
                                                  .map((n) => n[0])
                                                  .join("")
                                            : "N/A"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 ">{userProfile?.displayName || "N/A"}</h1>
                                        {levels && gamificationProfile && gamificationProfile.level && levels[gamificationProfile.level] && (
                                            <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1">
                                                <Image src={levels[gamificationProfile.level].levelIcon} width={16} height={16} alt="" />
                                                Cấp {gamificationProfile.level + 1}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-slate-400 mb-1">Học viên tập sự</p>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-600 dark:text-white/60">
                                        <Mail className="w-4 h-4" />
                                        <span>{userProfile?.email}</span>
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-500 mb-4 dark:text-white/60">
                                        <Calendar className="w-4 h-4" />
                                        {userProfile?.created_at && <span>Tham gia {handleCompareDate(userProfile?.created_at)}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{gamificationProfile?.xp || 0} XP</span>
                                            <span>{achievements[gamificationProfile?.level - 1]?.xpReward || 0} XP</span>
                                        </div>
                                        <Progress value={(gamificationProfile?.xp / achievements[gamificationProfile?.level - 1]?.xpReward) * 100 || 0} className="h-2" />
                                        <p className="text-xs text-slate-400">
                                            Còn {achievements[gamificationProfile?.level - 1]?.xpReward - gamificationProfile?.xp || 0} XP để lên cấp {gamificationProfile?.level + 1 || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    {user?._id == userProfile?._id && <UpdateProfile isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} user={userProfile} refetchUser={refetchUser} />}
                                    {/* Stats */}
                                    <div className="flex justify-center md:justify-end  gap-6 text-center">
                                        <div>
                                            <div className="flex items-center gap-1 text-orange-400">
                                                <Flame className="w-4 h-4" />
                                                <span className="font-bold">{gamificationProfile?.dailyStreak?.current || 0}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">Ngày liên tiếp</p>
                                        </div>
                                        <div>
                                            <div className="text-yellow-400 font-bold">{gamificationProfile?.xp || 0}</div>
                                            <p className="text-xs text-slate-400">Tổng XP</p>
                                        </div>
                                        {/* <div>
                                            <div className="text-green-400 font-bold">156</div>
                                            <p className="text-xs text-slate-400">Thẻ đã học</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <div className="w-full overflow-x-scroll">
                            <TabsList className="dark:bg-slate-800 dark:border-slate-700">
                                <TabsTrigger value="overview" className="dark:data-[state=active]:bg-slate-700">
                                    Tổng quan
                                </TabsTrigger>

                                <TabsTrigger value="achievements" className="dark:data-[state=active]:bg-slate-700">
                                    Thành tựu
                                </TabsTrigger>
                                <TabsTrigger value="levels" className="dark:data-[state=active]:bg-slate-700">
                                    Cấp độ
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            {gamificationProfile && <OverViewProfile gamificationProfile={gamificationProfile} levels={levels} />}
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-6">
                            {gamificationProfile && <Achievement gamificationProfile={gamificationProfile} achievements={achievements} />}
                        </TabsContent>

                        <TabsContent value="levels" className="space-y-6">
                            {gamificationProfile && <LevelProfile gamificationProfile={gamificationProfile} levels={levels} />}
                        </TabsContent>
                    </Tabs>
                    <div className="">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bộ Quiz của {userProfile?._id === userProfile?._id ? "bạn" : userProfile?.displayName}</h2>
                            <Badge variant="secondary" className="dark:bg-slate-700">
                                {quiz?.length || 0} bộ quiz
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto">{quiz && quiz.map((post, index) => <QuizInProfile key={index} post={post} />)}</div>
                    </div>
                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bộ Flashcard của {userProfile?._id === userProfile?._id ? "bạn" : userProfile?.displayName}</h2>
                            <Badge variant="secondary" className="dark:bg-slate-700">
                                {(flashcard && flashcard?.length) || 0} flashcard
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
                            {flashcard && flashcard.map((item) => <UserFC item={item} key={item._id} />)}

                            {flashcard && flashcard?.length === 0 && <div className="h-[350px] col-span-12 flex items-center justify-center text-gray-700">Không có dữ liệu...</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
