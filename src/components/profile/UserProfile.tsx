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
import { Settings, Eye, Heart, MessageCircle, Share2, Calendar, Mail, Upload, LinkIcon, CheckCircle, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { IQuiz, IUser } from "@/types/type";
import handleCompareDate from "@/lib/CompareDate";
import { useUser } from "@/context/userContext";

interface PropsProfile {
    profile: IUser;
    quiz: IQuiz[];
}
export default function UserProfile({ profile, quiz }: PropsProfile) {
    const { user } = useUser() || { user: null };
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempprofile, setTempprofile] = useState(profile);
    const [avatarInputType, setAvatarInputType] = useState<"file" | "url">("file");
    const handleSaveSettings = () => {
        setIsSettingsOpen(false);
    };

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
    return (
        <div className="flex items-center justify-center dark:text-white/80 text-gray-400">
            <div className="w-full md:w-[1000px] xl:w-[1200px] ">
                <div className="p-2 md:px-5 md:py-20 flex flex-col gap-5 min-h-screen">
                    <Card className="mb-8 dark:border-white/10 dark:bg-slate-800/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg dark:border-white/10">
                                    <AvatarImage src={profile?.profilePicture} alt={profile?.displayName} className="object-cover brightness-90" />
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
                                        <BadgeCheck className="w-6 h-6 text-blue-500" />
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-600 mb-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile?.email}</span>
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-500 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        {profile?.created_at && <span>Tham gia vào ngày {handleCompareDate(profile?.created_at)}</span>}
                                    </div>
                                    {user?._id === profile?._id && (
                                        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="text-white">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Cập nhật
                                                </Button>
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
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className=" dark:border-white/10 dark:bg-slate-800/50">
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
                    </Card>
                </div>
            </div>
        </div>
    );
}
