"use client";

import { useState } from "react";
import { ArrowLeft, Share2, Flag, Star, Send, ThumbsUp, MessageCircle, Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IComment, IQuestion, IQuiz, IUser } from "@/types/type";
import { useRouter } from "next/navigation";
import handleCompareDate from "@/lib/CompareDate";
import Image from "next/image";
import { POST_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Link from "next/link";
interface PropsDetailQuiz {
    quiz: IQuestion[];
    data?: IQuiz;
    comment: IComment[];
    setComment: React.Dispatch<React.SetStateAction<IComment[]>>;
    user?: IUser | null;
}

export default function DetailQuiz({ quiz, data, comment, setComment, user }: PropsDetailQuiz) {
    const [userRating, setUserRating] = useState(5);
    const [reportReason, setReportReason] = useState("");
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState("");

    const router = useRouter();
    const token = Cookies.get("token") || "";
    const handleSubmitComment = async () => {
        const newComment: IComment = {
            _id: Math.random().toString(36).substr(2, 9), // Generate a temporary ID
            quiz_id: data?._id,
            review,
            helpful: 0,
            rating: userRating,
            created_at: new Date(),
            user_id: user as IUser,
        };
        try {
            const req = await POST_API(`/quiz/comment`, newComment, "POST", token);
            if (req) {
                const res = await req.json();
                if (res.ok) {
                    if (res?.exist) {
                        setComment((item) => item.map((i) => (i._id == res?.id ? { ...i, review, created_at: new Date() } : i)));
                    } else {
                        setComment([...comment, newComment]);
                    }
                    toast.success("Bình luận đã được gửi thành công!");
                    setReview("");
                } else {
                    toast.error(res.message || "Đã có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.");
                }
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast.error("Đã có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.");
            return;
        } finally {
            setUserRating(0);
            setLoading(false);
        }
    };

    const handleReport = () => {
        if (reportReason) {
            // Handle report submission
            setReportReason("");
            setIsReportModalOpen(false);
        }
    };

    function calAvg(arr: IComment[]) {
        let sum = 0;
        if (arr.length == 0) return 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i]?.rating;
        }
        return sum / arr.length;
    }

    function Round(num: number) {
        return Math.round(num * 10) / 10;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40 dark:bg-slate-800 dark:border-b-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Chia sẻ
                            </Button>
                            <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-600 dark:text-red-400 dark:border-red-400">
                                        <Flag className="h-4 w-4 mr-2" />
                                        Báo cáo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Báo cáo vi phạm</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <p className="text-sm  dark:text-gray-400">Vui lòng chọn lý do báo cáo bài quiz này:</p>
                                        <RadioGroup value={reportReason} onValueChange={setReportReason}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="spam" id="spam" />
                                                <Label htmlFor="spam">Spam hoặc nội dung rác</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="inappropriate" id="inappropriate" />
                                                <Label htmlFor="inappropriate">Nội dung không phù hợp</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="copyright" id="copyright" />
                                                <Label htmlFor="copyright">Vi phạm bản quyền</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="misinformation" id="misinformation" />
                                                <Label htmlFor="misinformation">Thông tin sai lệch</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other" id="other" />
                                                <Label htmlFor="other">Khác</Label>
                                            </div>
                                        </RadioGroup>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                                                Hủy
                                            </Button>
                                            <Button onClick={handleReport} disabled={!reportReason} className="bg-red-600 hover:bg-red-700">
                                                Gửi báo cáo
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quiz Overview */}
                        <Card className="dark:border-white/10">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                                            <Image src={data?.img || ""} alt="" className="absolute w-full h-full" fill></Image>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="secondary">{data?.subject}</Badge>
                                        </div>
                                        <h1 className="text-2xl font-bold mb-4">{data?.title}</h1>
                                        <p className=" mb-4">{data?.content}</p>
                                        <div className="flex items-center space-x-6 text-sm  dark:text-gray-400 mb-4">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>{data?.noa} người học</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {data?.date && <span>{handleCompareDate(data?.date)}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="h-5 w-5 text-gray-300" />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm  ">{data?.comment?.length} đánh giá</span>
                                            </div>
                                        </div>
                                        <Link href={`/quiz/${data?.slug}`}>
                                            <Button variant="default" className="mt-4 text-white">
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                Làm bài quiz
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quiz Preview */}
                        <Card className="dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-600">Preview 10 câu hỏi trong bài quiz này</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 h-[500px] overflow-y-auto">
                                {quiz.map((question: any) => (
                                    <div key={question.id} className="border-b pb-6 last:border-b-0 dark:border-b-white/10 dark:text-white/80">
                                        <h3 className="font-medium mb-4 ">{question.question}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {question.answers.map((option: any, index: number) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/20 cursor-pointer">
                                                    <span className="font-medium text-blue-600 min-w-[20px] pl-2 pr-1">{String.fromCharCode(65 + Number(index))}</span>
                                                    <span>{option}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card className="dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    Bình luận và đánh giá
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add Comment */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-5">
                                        <Label className="text-sm font-medium block text-white/70">Đánh giá của bạn:</Label>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                                                    <Star className={`h-6 w-6 ${star <= userRating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs">{userRating} sao</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="comment" className="text-sm font-medium mb-2 block text-white/70">
                                            Bình luận của bạn
                                        </Label>
                                        <Textarea
                                            id="comment"
                                            placeholder="Hãy để lại bình luận cũng như số sao của bạn dưới đây..."
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <Button onClick={handleSubmitComment} disabled={!review.trim() || userRating === 0 || loading} className="text-white">
                                        <Send className="h-4 w-4 mr-2" />
                                        Gửi bình luận
                                    </Button>
                                </div>

                                <Separator />

                                {/* Existing Comments */}
                                <div className="space-y-6">
                                    {comment.map((cmt) => (
                                        <div key={cmt._id} className="flex space-x-4">
                                            <Avatar>
                                                <AvatarImage src={cmt?.user_id?.profilePicture} className="object-cover" />
                                                <AvatarFallback>{cmt?.user_id?.displayName[0].toUpperCase() + cmt?.user_id?.displayName[1].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="font-medium">{cmt?.user_id?.displayName}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className={`h-4 w-4 ${star <= cmt?.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                    {cmt?.created_at && <span className="text-sm ">{handleCompareDate(cmt?.created_at)}</span>}
                                                </div>
                                                {cmt.review && <p className="text-gray-700 mb-2 dark:text-white/60">{cmt.review}</p>}

                                                <Button variant="ghost" size="sm" className=" hover:text-blue-600">
                                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                                    {cmt?.helpful || "0"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Author Info */}
                        <Card className="dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Tác giả</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={data?.uid?.profilePicture} className="object-cover" />
                                        <AvatarFallback>TA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{data?.uid?.displayName}</div>
                                        {data?.uid?.created_at && <div className="text-sm ">{handleCompareDate(data?.uid?.created_at)}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quiz Stats */}
                        <Card className="dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Thống kê</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="">Số câu hỏi:</span>
                                    <span className="font-medium">{quiz?.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="">Lượt xem:</span>
                                    <span className="font-medium">{data?.view || "0"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="">Lượt làm:</span>
                                    <span className="font-medium">{data?.noa}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="">Độ khó:</span>
                                    <Badge variant="secondary">Dễ</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Quizzes */}
                        <Card className="dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Quiz liên quan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800/20">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">JS</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">JavaScript cơ bản</div>
                                            <div className="text-xs ">15 câu hỏi</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
