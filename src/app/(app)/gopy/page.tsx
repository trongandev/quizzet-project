"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, TrendingUp, Users, ThumbsUp, ThumbsDown, Filter, Send, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loading from "@/components/ui/loading"
import { toast } from "sonner"
import { GET_API, GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI"
import Cookies from "js-cookie"
import { IFeedback } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import { useUser } from "@/context/userContext"
import Image from "next/image"
// interface Review {
//     id: number
//     userName: string
//     userAvatar: string
//     rating: number
//     title: string
//     comment: string
//     date: string
//     likes: number
//     dislikes: number
//     category: string
//     isVerified?: boolean
// }

const categories = ["Tất cả", "Giao diện", "Tính năng", "Nội dung", "Hiệu suất", "Cộng đồng"]

const StarRating = ({ rating, size = "sm", interactive = false, onRatingChange }: { rating: number; size?: "sm" | "md" | "lg"; interactive?: boolean; onRatingChange?: (rating: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0)

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    }

    return (
        <div className="flex gap-1 items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn(sizeClasses[size], "transition-colors", interactive && "cursor-pointer", (interactive ? hoverRating || rating : rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-400")} onClick={() => interactive && onRatingChange?.(star)} onMouseEnter={() => interactive && setHoverRating(star)} onMouseLeave={() => interactive && setHoverRating(0)} />
            ))}
        </div>
    )
}

export default function FeedbackPage() {
    const [reviewData, setReviewData] = useState<IFeedback[]>([])
    const [selectedCategory, setSelectedCategory] = useState("Tất cả")
    const [filteredReviews, setFilteredReviews] = useState<IFeedback[]>(reviewData)
    const [averageRating, setAverageRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [ratingDistribution, setRatingDistribution] = useState<{ rating: number; count: number; percentage: number }[]>([])
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: "",
        comment: "",
        category: "Giao diện",
    })
    const [loading, setLoading] = useState(false)
    const [loadingLikes, setLoadingLikes] = useState(false)
    const token = Cookies.get("token") || ""
    const { user } = useUser()
    useEffect(() => {
        const fetchReviews = async () => {
            const res = await GET_API_WITHOUT_COOKIE("/feedback")
            console.log(res)
            setReviewData(res)
            setFilteredReviews(res)
            setTotalReviews(res.length)
            setAverageRating(res.reduce((sum: any, review: any) => sum + review.rating, 0) / res.length || 0)
            setRatingDistribution(
                [5, 4, 3, 2, 1].map((rating) => ({
                    rating,
                    count: res.filter((review: any) => review.rating === rating).length,
                    percentage: (res.filter((review: any) => review.rating === rating).length / res.length) * 100,
                }))
            )
        }

        fetchReviews()
    }, [])

    useEffect(() => {
        if (selectedCategory === "Tất cả") {
            setFilteredReviews(reviewData)
        } else {
            setFilteredReviews(reviewData.filter((review) => review.category === selectedCategory))
        }
    }, [reviewData, selectedCategory])

    const handleSubmitReview = async () => {
        try {
            setLoading(true)
            const req = await POST_API("/feedback", newReview, "POST", token)
            const res = await req?.json()
            if (res?.ok) {
                toast.success("Đánh giá đã được gửi thành công!")
                setReviewData((prev) => [{ _id: res?.updateData?._id, createdAt: res?.updateData.createAt, updatedAt: res?.updateData.updatedAt, likes: 0, user_id: user, ...newReview }, ...prev])
                setNewReview({ rating: 0, title: "", comment: "", category: "Giao diện" })
            } else {
                toast.error(`${res?.message}`, { duration: 10000 })
            }
        } catch (error: any) {
            toast.error(`Lỗi: ${error.message}`, { duration: 10000 })
        } finally {
            setLoading(false)
        }
    }

    const handleIncreaseLikes = async (reviewId: string, likes: number) => {
        try {
            setLoadingLikes(true)
            const req = await POST_API(`/feedback/${reviewId}`, { likes }, "PATCH", token)
            const res = await req?.json()
            if (res?.ok) {
                toast.success("Đánh giá bình luận hữu ích thành công")
                setReviewData((prev) => prev.map((review) => (review._id === reviewId ? { ...review, likes } : review)))
            } else {
                toast.error(`Lỗi: ${res?.message}`, { duration: 10000 })
            }
        } catch (error: any) {
            toast.error(`Lỗi: ${error.message}`, { duration: 10000 })
        } finally {
            setLoadingLikes(false)
        }
    }

    const getIconLevel = (level: number) => {
        if (level <= 3) {
            return "/icon-level/crystal_lv1_1-3.svg" // Default icon for invalid levels
        }
        if (level <= 6) {
            return `/icon-level/crystal_lv2_4-6.svg` // Assuming icons are named as crystal_lv1.svg, crystal_lv2.svg, etc.
        }
        if (level <= 9) {
            return `/icon-level/crystal_lv3_7-9.svg`
        }
        if (level <= 12) {
            return `/icon-level/crystal_lv4_10-12.svg`
        }
        if (level <= 15) {
            return `/icon-level/crystal_lv5_13-15.svg`
        }
        return `/icon-level/crystal_lv6_16-18.svg`
    }

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full md:w-[1000px] xl:w-[1200px] px-2 md:px-0 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold  flex items-center justify-center gap-2">
                        <MessageSquare className="h-8 w-8 text-blue-500" />
                        Đánh Giá & Góp Ý
                    </h1>
                    <p className="text-slate-400">Chia sẻ trải nghiệm và giúp chúng tôi cải thiện website</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Review Form */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle className=" flex items-center gap-2">
                                    <Send className="h-5 w-5 text-blue-500" />
                                    Viết Đánh Giá Mới
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="">Đánh giá tổng thể</Label>
                                    <div className="flex justify-between items-center">
                                        <StarRating rating={newReview.rating} size="lg" interactive onRatingChange={(rating) => setNewReview({ ...newReview, rating })} />
                                        <p className="text-xs dark:text-yellow-400 text-yellow-600">{newReview.rating}/5 sao</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="">
                                            Tiêu đề
                                        </Label>
                                        <Input id="title" placeholder="Nhập tiêu đề đánh giá..." value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} className="" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="">
                                            Danh mục
                                        </Label>
                                        <Select value={newReview.category} onValueChange={(value) => setNewReview({ ...newReview, category: value })}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.slice(1).map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comment" className="">
                                        Nội dung đánh giá
                                    </Label>
                                    <Textarea id="comment" placeholder="Chia sẻ trải nghiệm của bạn về website..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className=" min-h-[100px]" />
                                </div>

                                <Button onClick={handleSubmitReview} disabled={loading || !user} className="w-full text-white">
                                    {loading ? <Loading /> : <Send className="h-4 w-4 mr-2" />}
                                    {user ? "Gửi đánh giá" : "Đăng nhập để gửi đánh giá"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Category Filter */}
                        <Card className="">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <span className=" font-medium">Lọc theo danh mục:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className="dark:text-white">
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <Card key={review._id} className="">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={review.user_id.profilePicture} alt={review.user_id.displayName} className="object-cover" />
                                                <AvatarFallback className="">
                                                    {review.user_id.displayName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center justify-between flex-wrap">
                                                    <div className="flex items-center gap-2">
                                                        <h1 className={`line-clamp-1 animate-text-gradient bg-gradient-to-r font-semibold ${review.user_id.role === "admin" ? "from-blue-500 via-blue-400 to-blue-600 bg-[200%_auto] bg-clip-text text-transparent" : ""}`}>{user?.displayName || "Khách vãng lai"}</h1>
                                                        {token && (
                                                            <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1 text-xs">
                                                                <Image src={getIconLevel(review.user_id?.gamification?.level || 0)} width={14} height={14} alt="" />
                                                                Cấp {review.user_id?.gamification?.level || 0}
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className="">
                                                            {review.category}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-sm text-slate-400">{review.createdAt && handleCompareDate(review.createdAt)}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={review.rating} size="sm" />
                                                    <span className="text-sm text-slate-400">({review.rating}/5)</span>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium  mb-2">{review.title}</h4>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                                                </div>

                                                <Button variant="ghost" size="sm" className="mt-2 text-slate-400 hover:text-green-400" onClick={() => handleIncreaseLikes(review._id, review.likes + 1)} disabled={loadingLikes || user?._id === review.user_id._id}>
                                                    {loadingLikes ? <Loading /> : <ThumbsUp className="h-4 w-4 mr-1" />}
                                                    {review.likes}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredReviews.length === 0 && <div className="h-[300px] text-center flex items-center justify-center dark:text-gray-400 text-gray-500">Chưa có người dùng nào đánh giá ở hạng mục này...</div>}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Overall Rating */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle className=" flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-yellow-500" />
                                    Đánh Giá Tổng Quan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold  mb-2">{averageRating.toFixed(1)}</div>
                                    <StarRating rating={Math.round(averageRating)} size="md" />
                                    <p className="text-sm text-slate-400 mt-2">Dựa trên {totalReviews} đánh giá</p>
                                </div>

                                <div className="space-y-2">
                                    {ratingDistribution.map(({ rating, count, percentage }) => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-sm  w-3">{rating}</span>
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <div className="flex-1 bg-slate-600 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                            </div>
                                            <span className="text-sm text-slate-400 w-8">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle className=" flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Thống Kê Nhanh
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Tổng đánh giá</span>
                                    <span className=" font-semibold">{totalReviews}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Đánh giá 5 sao</span>
                                    <span className=" font-semibold">{ratingDistribution.find((r) => r.rating === 5)?.count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Tỷ lệ hài lòng</span>
                                    <span className="text-green-400 font-semibold">{Math.round((reviewData.filter((r) => r.rating >= 4).length / totalReviews) * 100)}%</span>
                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Người dùng tích cực</span>
                                    <span className=" font-semibold">{reviewData.filter((r) => r.isVerified).length}</span>
                                </div> */}
                            </CardContent>
                        </Card>

                        {/* Top Categories */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle className=" flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Danh Mục Phổ Biến
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {categories.slice(1).map((category) => {
                                    const count = reviewData.filter((r) => r.category === category).length
                                    const percentage = (count / totalReviews) * 100
                                    return (
                                        <div key={category} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="">{category}</span>
                                                <span className="text-slate-400">{count}</span>
                                            </div>
                                            <div className="bg-slate-600 rounded-full h-1.5">
                                                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
