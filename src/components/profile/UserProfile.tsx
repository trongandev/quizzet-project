"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IListFlashcard, IQuiz, IUser } from "@/types/type";
import handleCompareDate from "@/lib/CompareDate";
import { useUser } from "@/context/userContext";
import {
    Trophy,
    Star,
    Flame,
    BookOpen,
    Brain,
    Target,
    Award,
    Calendar,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Settings,
    Crown,
    Gem,
    Zap,
    Shield,
    Sparkles,
    Mail,
    Upload,
    LinkIcon,
    ArrowRight,
} from "lucide-react";
import { Progress } from "../ui/progress";
import UserFC from "../flashcard/UserFC";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Level configuration with unique designs
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

const achievements = [
    { id: 1, name: "Học giả mới", description: "Hoàn thành ôn tập 10 thẻ đầu tiên", icon: BookOpen, earned: true },
    { id: 2, name: "Người sưu tầm từ vựng", description: "Thêm 20 thẻ mới", icon: Star, earned: true },
    { id: 3, name: "Chuỗi liên tiếp 7 ngày", description: "Học liên tiếp 7 ngày", icon: Flame, earned: true },
    { id: 4, name: "Chiến binh từ vựng", description: "Ôn tập 100 thẻ", icon: Trophy, earned: false },
    { id: 5, name: "Hoàn hảo", description: "Đánh giá 20 thẻ là 'Hoàn hảo' (5/5)", icon: Target, earned: false },
    { id: 6, name: "Dậy sớm học bài", description: "Hoàn thành phiên ôn tập trước 7h sáng", icon: Award, earned: false },
];

interface PropsProfile {
    profile: IUser;
    quiz: IQuiz[];
    flashcard: IListFlashcard[];
}
export default function UserProfile({ profile, quiz, flashcard }: PropsProfile) {
    const { user } = useUser() || { user: null };
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempprofile, setTempprofile] = useState(profile);
    const [avatarInputType, setAvatarInputType] = useState<"file" | "url">("file");
    const [currentLevel] = useState(1);
    const [currentXP] = useState(10);
    const [dailyStreak] = useState(1);

    const currentLevelConfig = levelConfig[currentLevel] || levelConfig[1];
    const nextLevel = currentLevel + 1;
    const xpForNextLevel = nextLevel * 100;
    const xpProgress = (currentXP / xpForNextLevel) * 100;

    const LevelIcon = currentLevelConfig.icon;
    const handleSaveSettings = () => {
        setIsSettingsOpen(false);
    };
    const router = useRouter();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempprofile((prev) => ({
                    ...prev,
                    avatar: e.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-3">
                <div className="text-gray-500 dark:text-gray-300">Không tìm thấy hồ sơ người dùng.</div>
                <Button className="text-white">Vui lòng đăng nhập lại</Button>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center dark:text-white/80 text-gray-400">
            <div className="w-full md:w-[1000px] xl:w-[1200px] ">
                <div className="p-2 md:px-5 py-20 flex flex-col gap-5 min-h-screen">
                    <Card className="mb-8 dark:border-white/10 dark:bg-slate-800/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg dark:border-white/10">
                                    <AvatarImage src={profile?.profilePicture} alt={profile?.displayName} className="object-cover" />
                                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {profile?.displayName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 ">{profile?.displayName}</h1>
                                        <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1">
                                            <LevelIcon className="w-4 h-4" />
                                            Cấp {currentLevel}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-400 mb-1">{currentLevelConfig.name}</p>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-600 dark:text-white/60">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile?.email}</span>
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-500 mb-4 dark:text-white/60">
                                        <Calendar className="w-4 h-4" />
                                        {profile?.created_at && <span>Tham gia {handleCompareDate(profile?.created_at)}</span>}
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
                                    {user?._id === profile?._id && (
                                        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                            <DialogTrigger asChild>
                                                <div className=" flex justify-end">
                                                    <Button className="dark:text-white" variant="outline">
                                                        <Settings className="w-4 h-4 mr-2" />
                                                        Cập nhật
                                                    </Button>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Cài đặt thông tin cá nhân</DialogTitle>
                                                    <DialogDescription>Cập nhật thông tin hồ sơ của bạn tại đây.</DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-6">
                                                    {/* Avatar Section */}
                                                    <div className="space-y-4">
                                                        <Label>Ảnh đại diện</Label>
                                                        <div className="flex justify-center">
                                                            <Avatar className="w-20 h-20">
                                                                <AvatarImage src={tempprofile?.profilePicture} alt="Preview" className="object-cover" />
                                                                <AvatarFallback>
                                                                    {tempprofile?.displayName
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>

                                                        <Tabs value={avatarInputType} onValueChange={(value) => setAvatarInputType(value as "file" | "url")}>
                                                            <TabsList className="grid w-full grid-cols-2">
                                                                <TabsTrigger value="file">
                                                                    <Upload className="w-4 h-4 mr-2" />
                                                                    Tải lên
                                                                </TabsTrigger>
                                                                <TabsTrigger value="url">
                                                                    <LinkIcon className="w-4 h-4 mr-2" />
                                                                    URL
                                                                </TabsTrigger>
                                                            </TabsList>

                                                            <TabsContent value="file" className="space-y-2">
                                                                <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer" />
                                                            </TabsContent>

                                                            <TabsContent value="url" className="space-y-2">
                                                                <Input
                                                                    placeholder="Nhập URL hình ảnh"
                                                                    value={tempprofile?.profilePicture.startsWith("http") ? tempprofile?.profilePicture : ""}
                                                                    onChange={(e) =>
                                                                        setTempprofile((prev) => ({
                                                                            ...prev,
                                                                            avatar: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                            </TabsContent>
                                                        </Tabs>
                                                    </div>

                                                    {/* Name */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Tên hiển thị</Label>
                                                        <Input
                                                            id="name"
                                                            value={tempprofile?.displayName}
                                                            onChange={(e) =>
                                                                setTempprofile((prev) => ({
                                                                    ...prev,
                                                                    name: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    {/* Email (disabled) */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input id="email" value={tempprofile?.email} disabled className="bg-gray-100 dark:text-gray-600" />
                                                        <p className="text-sm text-gray-500 dark:text-white/60">Email không thể thay đổi</p>
                                                    </div>

                                                    {/* Password Link */}
                                                    <div className="pt-2">
                                                        <Link href="/update-password" className="">
                                                            <Button variant="secondary">
                                                                Thay đổi mật khẩu <ArrowRight />
                                                            </Button>
                                                        </Link>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-3 pt-4">
                                                        <Button onClick={handleSaveSettings} className="flex-1 text-white">
                                                            Lưu thay đổi
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setTempprofile(profile);
                                                                setIsSettingsOpen(false);
                                                            }}
                                                            className="flex-1">
                                                            Hủy
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
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
                    {/* <Card className=" dark:border-white/10 dark:bg-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-2xl">Bài đăng của bạn</CardTitle>
                            <CardDescription>Tổng cộng {quiz.length} bài đăng</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {quiz &&
                                    quiz.map((post) => (
                                        <Card key={post._id} className={`border shadow-md hover:shadow-lg transition-shadow cursor-pointer group`}>
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {post.subject}
                                                    </Badge>
                                                    <Link href={`/quiz/detail/${post.slug}`} className="block">
                                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {post.view}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3" />
                                                            {post.noa}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="w-3 h-3" />
                                                            {post.comment.length}
                                                        </span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                                                        <Share2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                {post.date && <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">{handleCompareDate(post.date)}</div>}
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </CardContent>
                    </Card> */}
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
                                {user?._id === profile?._id && (
                                    <TabsTrigger value="guide" className="dark:data-[state=active]:bg-slate-700">
                                        Hướng dẫn
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
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
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                                <Zap className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-bold">Cấp {nextLevel}</h3>
                                            <p className="text-sm text-slate-400">Người kể chuyện</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Còn {xpForNextLevel - currentXP} XP</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Thành tựu</h2>
                                <Badge variant="secondary" className="dark:bg-slate-700">
                                    {achievements.filter((a) => a.earned).length}/{achievements.length} đã đạt
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {achievements.map((achievement) => {
                                    const AchievementIcon = achievement.icon;
                                    return (
                                        <Card
                                            key={achievement.id}
                                            className={`dark:border-slate-700 ${
                                                achievement.earned
                                                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-600/30"
                                                    : "dark:bg-slate-800"
                                            }`}>
                                            <CardContent className="p-6 text-center">
                                                <div
                                                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                                        achievement.earned ? "bg-gradient-to-br from-yellow-500 to-orange-600 dark:from-yellow-800 dark:to-orange-900" : "dark:bg-slate-700"
                                                    }`}>
                                                    <AchievementIcon className={`w-8 h-8 ${achievement.earned ? "text-white" : "text-slate-400"}`} />
                                                </div>
                                                <h3 className={`font-bold mb-2 ${achievement.earned ? "text-yellow-400" : "text-slate-300"}`}>{achievement.name}</h3>
                                                <p className="text-sm text-slate-400">{achievement.description}</p>
                                                {achievement.earned && <Badge className="mt-3 bg-yellow-600 text-white">Đã đạt được</Badge>}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>

                        <TabsContent value="levels" className="space-y-6">
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
                                                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                                        isUnlocked ? `bg-gradient-to-br ${config.color}` : "dark:bg-slate-700"
                                                    } ${isCurrentLevel ? "ring-4 ring-blue-500/50" : ""}`}>
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
                            <h2 className="text-2xl font-bold">Bộ Quiz của {user?._id === profile?._id ? "bạn" : profile?.displayName}</h2>
                            <Badge variant="secondary" className="bg-slate-700">
                                {quiz?.length || 0} bộ quiz
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto">
                            {quiz &&
                                quiz.map((post) => (
                                    <Card key={post._id} className={`border shadow-md hover:shadow-lg transition-shadow cursor-pointer group`}>
                                        <div className="relative w-full h-32">
                                            <Image src={post.img} alt="" className="absolute object-cover" fill></Image>
                                            <Badge variant="secondary" className="text-xs absolute z-1 top-1 left-1">
                                                {post.subject}
                                            </Badge>
                                            <Button
                                                onClick={() => router.push(`/quiz/detail/${post.slug}`)}
                                                variant="secondary"
                                                size="sm"
                                                className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-1 top-1 right-1">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <CardHeader className="pb-3 pt-0">
                                            <div className="flex justify-between items-start mb-2"></div>
                                            <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {post.view}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-3 h-3" />
                                                        {post.noa}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="w-3 h-3" />
                                                        {post.comment.length}
                                                    </span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                                    <Share2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            {post.date && <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">{handleCompareDate(post.date)}</div>}
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-bold">Bộ Flashcard của {user?._id === profile?._id ? "bạn" : profile?.displayName}</h2>
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
    );
}
