"use client"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { IListFlashcard, IQuiz, IUser } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import { useUser } from "@/context/userContext"
import { Flame, BookOpen, Calendar, Crown, Zap, Mail } from "lucide-react"
import { Progress } from "../ui/progress"
import UserFC from "../flashcard/UserFC"
import Achievement from "@/components/profile/Achievement"
import LevelProfile from "@/components/profile/LevelProfile"
import OverViewProfile from "@/components/profile/OverViewProfile"
import UpdateProfile from "@/components/profile/UpdateProfile"
import QuizInProfile from "@/components/profile/QuizInProfile"

// Level configuration with unique designs

interface PropsProfile {
    profile: IUser
    quiz: IQuiz[]
    flashcard: IListFlashcard[]
}
export default function UserProfile({ profile, quiz, flashcard }: PropsProfile) {
    const { user, refetchUser } = useUser() || {
        user: null,
        refetchUser: () => {},
    }
    const [userProfile, setUserProfile] = useState<IUser | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [currentLevel] = useState(1)
    const [currentXP] = useState(10)
    const [dailyStreak] = useState(1)

    const nextLevel = currentLevel + 1
    const xpForNextLevel = nextLevel * 100
    const xpProgress = (currentXP / xpForNextLevel) * 100
    useEffect(() => {
        const tempUser = user?._id === profile._id ? user : profile
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
                                        <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            Cấp {currentLevel}
                                        </Badge>
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
                                            <span>{currentXP} XP</span>
                                            <span>{xpForNextLevel} XP</span>
                                        </div>
                                        <Progress value={xpProgress} className="h-2" />
                                        <p className="text-xs text-slate-400">
                                            Còn {xpForNextLevel - currentXP} XP để lên cấp {nextLevel}
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
                                                <span className="font-bold">{dailyStreak}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">Ngày liên tiếp</p>
                                        </div>
                                        <div>
                                            <div className="text-yellow-400 font-bold">{currentXP}</div>
                                            <p className="text-xs text-slate-400">Tổng XP</p>
                                        </div>
                                        <div>
                                            <div className="text-green-400 font-bold">156</div>
                                            <p className="text-xs text-slate-400">Thẻ đã học</p>
                                        </div>
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
                                {userProfile?._id === userProfile?._id && (
                                    <TabsTrigger value="guide" className="dark:data-[state=active]:bg-slate-700">
                                        Hướng dẫn
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            <OverViewProfile />
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-6">
                            <Achievement />
                        </TabsContent>

                        <TabsContent value="levels" className="space-y-6">
                            <LevelProfile />
                        </TabsContent>

                        <TabsContent value="guide" className="space-y-6">
                            <h2 className="text-2xl font-bold">Hướng dẫn kiếm XP</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="dark:bg-slate-800 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-yellow-400" />
                                            Cách kiếm điểm kinh nghiệm
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span>Hoàn thành ôn tập một thẻ</span>
                                                <Badge className="bg-green-600">+10 XP</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Đánh giá thẻ &apos;Hoàn hảo&apos; (5/5)</span>
                                                <Badge className="bg-blue-600">+5 XP</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Hoàn thành một bộ thẻ</span>
                                                <Badge className="bg-purple-600">+50 XP</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Thêm thẻ mới</span>
                                                <Badge className="bg-orange-600">+5 XP</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Duy trì chuỗi ngày học</span>
                                                <Badge className="bg-red-600">+20 XP</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-slate-800 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Crown className="w-5 h-5 text-purple-400" />
                                            Hệ thống cấp độ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3 dark:text-slate-300">
                                            <div className="p-3 dark:bg-slate-700 rounded-lg">
                                                <h4 className="font-semibold text-green-400 mb-2">Người mới (Cấp 1-5)</h4>
                                                <p className="text-sm dark:text-slate-300">Học viên tập sự, Người khám phá từ vựng, Người làm chủ chữ cái...</p>
                                            </div>
                                            <div className="p-3 dark:bg-slate-700 rounded-lg">
                                                <h4 className="font-semibold text-blue-400 mb-2">Trung cấp (Cấp 6-15)</h4>
                                                <p className="text-sm dark:text-slate-300">Thợ rèn từ, Người kể chuyện, Đàm phán viên ngôn ngữ...</p>
                                            </div>
                                            <div className="p-3 dark:bg-slate-700 rounded-lg">
                                                <h4 className="font-semibold text-purple-400 mb-2">Cao cấp (Cấp 16-25)</h4>
                                                <p className="text-sm dark:text-slate-300">Người bạn của từ, Nhà thông thái ngôn ngữ, Nghệ sĩ từ vựng...</p>
                                            </div>
                                            <div className="p-3 dark:bg-slate-700 rounded-lg">
                                                <h4 className="font-semibold text-yellow-400 mb-2">Bậc thầy (Cấp 26+)</h4>
                                                <p className="text-sm dark:text-slate-300">Bậc thầy ngôn ngữ, Ngôn sứ từ vựng, Huyền thoại ngôn ngữ...</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold">Bộ Quiz của {userProfile?._id === userProfile?._id ? "bạn" : userProfile?.displayName}</h2>
                            <Badge variant="secondary" className="bg-slate-700">
                                {quiz?.length || 0} bộ quiz
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto">{quiz && quiz.map((post, index) => <QuizInProfile key={index} post={post} />)}</div>
                    </div>
                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold">Bộ Flashcard của {userProfile?._id === userProfile?._id ? "bạn" : userProfile?.displayName}</h2>
                            <Badge variant="secondary" className="bg-slate-700">
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
