"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Calendar, Mail, Shield, Globe, Lock, Edit, Save, X } from "lucide-react"
import { IUser, IQuiz, IHistory, IListFlashcard, ISO, IReport } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import Image from "next/image"
import { useState, useEffect } from "react"

interface GenericModalProps {
    isOpen: boolean
    onClose: () => void
    data: any
    type: "user" | "quiz" | "history" | "flashcard" | "subjectOutline" | "report"
    onSave?: (updatedData: any) => Promise<void>
}

export function GenericModal({ isOpen, onClose, data, type, onSave }: GenericModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState(data)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setEditData(data)
    }, [data])

    if (!data) return null

    const handleSave = async () => {
        if (onSave && editData) {
            setSaving(true)
            try {
                await onSave(editData)
                setIsEditing(false)
            } catch (error) {
                console.error("Save failed:", error)
            } finally {
                setSaving(false)
            }
        }
    }

    const handleCancel = () => {
        setEditData(data)
        setIsEditing(false)
    }

    const renderUserDetails = (user: IUser) => {
        if (isEditing) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.profilePicture} alt={user.displayName} className="object-cover" />
                            <AvatarFallback>
                                <User className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="displayName">Tên hiển thị</Label>
                            <Input id="displayName" value={editData.displayName || ""} onChange={(e) => setEditData({ ...editData, displayName: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Quyền</Label>
                            <Select value={editData.role} onValueChange={(value) => setEditData({ ...editData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <div className="flex items-center space-x-2">
                                <Switch checked={editData.status} onCheckedChange={(checked) => setEditData({ ...editData, status: checked })} />
                                <span className="text-sm">{editData.status ? "Hoạt động" : "Bị cấm"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.profilePicture} alt={user.displayName} className="object-cover" />
                        <AvatarFallback>
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-semibold">{user.displayName}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm">Quyền:</span>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role.toUpperCase()}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Trạng thái:</span>
                        <Badge variant={user.status ? "default" : "destructive"}>{user.status ? "Hoạt động" : "Bị cấm"}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Tham gia:</span>
                        <span className="text-sm">{handleCompareDate(user.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">Nguồn:</span>
                        <Badge variant="outline">{user.provider === "local" ? "Tài khoản nội bộ" : "Google"}</Badge>
                    </div>
                </div>
            </div>
        )
    }

    const renderQuizDetails = (quiz: IQuiz) => {
        if (isEditing) {
            return (
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="relative h-24 w-40 overflow-hidden rounded-md">
                            <Image src={quiz.img || "/meme.jpg"} alt={quiz.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input id="title" value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Mô tả</Label>
                        <Textarea id="content" value={editData.content || ""} onChange={(e) => setEditData({ ...editData, content: e.target.value })} rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Môn học</Label>
                            <Input id="subject" value={editData.subject || ""} onChange={(e) => setEditData({ ...editData, subject: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <div className="flex items-center space-x-2">
                                <Switch checked={editData.status} onCheckedChange={(checked) => setEditData({ ...editData, status: checked })} />
                                <span className="text-sm">{editData.status ? "Đã duyệt" : "Chờ duyệt"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="relative h-24 w-40 overflow-hidden rounded-md">
                        <Image src={quiz.img || "/meme.jpg"} alt={quiz.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        <p className="text-muted-foreground text-sm">{quiz.content}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Môn học:</span>
                        <Badge variant="secondary">{quiz.subject}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Trạng thái:</span>
                        <Badge variant={quiz.status ? "default" : "secondary"}>{quiz.status ? "Đã duyệt" : "Chờ duyệt"}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Số câu hỏi:</span>
                        <Badge variant="outline">{quiz.questions?.data_quiz?.length || 0} câu</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Ngày tạo:</span>
                        <span className="text-sm">{handleCompareDate(quiz.date)}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Tác giả:</h4>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={quiz.uid?.profilePicture} className="object-cover" />
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{quiz.uid?.displayName}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderFlashcardDetails = (flashcard: IListFlashcard) => {
        if (isEditing) {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input id="title" value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea id="description" value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="access">Quyền truy cập</Label>
                            <Select value={editData.access} onValueChange={(value) => setEditData({ ...editData, access: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Công khai</SelectItem>
                                    <SelectItem value="private">Riêng tư</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Môn học</Label>
                            <Input id="subject" value={editData.subject || ""} onChange={(e) => setEditData({ ...editData, subject: e.target.value })} />
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">{flashcard.title}</h3>
                    <p className="text-muted-foreground text-sm">{flashcard.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Ngôn ngữ:</span>
                        <Badge variant="secondary">{flashcard.language}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Quyền truy cập:</span>
                        <Badge variant={flashcard.public ? "default" : "destructive"}>{flashcard.public ? "Công khai" : "Riêng tư"}</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Số thẻ:</span>
                        <Badge variant="outline">{flashcard.flashcards?.length || 0} thẻ</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Ngày tạo:</span>
                        <span className="text-sm">{handleCompareDate(flashcard.created_at)}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Tác giả:</h4>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={flashcard.userId?.profilePicture} className="object-cover" />
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{flashcard.userId?.displayName}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderSubjectOutlineDetails = (outline: ISO) => {
        if (isEditing) {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input id="title" value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Môn học</Label>
                        <Input id="subject" value={editData.subject || ""} onChange={(e) => setEditData({ ...editData, subject: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <div className="flex items-center space-x-2">
                            <Switch checked={editData.status} onCheckedChange={(checked) => setEditData({ ...editData, status: checked })} />
                            <span className="text-sm">{editData.status ? "Hoạt động" : "Tạm ẩn"}</span>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">{outline.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Môn học:</span>
                        <Badge variant="secondary">{outline.subject}</Badge>
                    </div>

                    {/* <div className="flex items-center gap-2">
                        <span className="text-sm">Trạng thái:</span>
                        <Badge variant={outline.status ? "default" : "secondary"}>{outline.status ? "Hoạt động" : "Tạm ẩn"}</Badge>
                    </div> */}

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Ngày tạo:</span>
                        <span className="text-sm">{handleCompareDate(outline.date)}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Tác giả:</h4>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={outline.user_id?.profilePicture} className="object-cover" />
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{outline.user_id?.displayName}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderHistoryDetails = (history: IHistory) => (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Lịch sử làm quiz</h3>
                <p className="text-muted-foreground text-sm">Chi tiết kết quả làm bài</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Quiz:</span>
                    <span className="text-sm font-medium">{history.quiz_id?.title}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Điểm số:</span>
                    <Badge variant="outline">
                        {history.score}/{history.total_questions || 20}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Môn học:</span>
                    <Badge variant="secondary">{history.quiz_id?.subject}</Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Ngày làm:</span>
                    <span className="text-sm">{handleCompareDate(history.date)}</span>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-2">Người làm:</h4>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={history.user_id?.profilePicture} className="object-cover" />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{history.user_id?.displayName}</span>
                </div>
            </div>
        </div>
    )

    const renderReportDetails = (report: IReport) => (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Báo cáo từ người dùng</h3>
                <p className="text-muted-foreground text-sm">Chi tiết nội dung báo cáo</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Loại báo cáo:</span>
                    <Badge variant="secondary">{report.type_of_violation}</Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Trạng thái:</span>
                    <Badge variant={report.status === "pending" ? "secondary" : "default"}>{report.status === "pending" ? "Chờ xử lý" : "Đã xử lý"}</Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Ngày báo cáo:</span>
                    <span className="text-sm">{handleCompareDate(report.created_at)}</span>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-2">Nội dung:</h4>
                <p className="text-sm bg-muted p-3 rounded">{report.content}</p>
            </div>

            <div>
                <h4 className="font-medium mb-2">Người báo cáo:</h4>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={report.user_report?.profilePicture} className="object-cover" />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{report.user_report?.displayName}</span>
                </div>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (type) {
            case "user":
                return renderUserDetails(data as IUser)
            case "quiz":
                return renderQuizDetails(data as IQuiz)
            case "history":
                return renderHistoryDetails(data as IHistory)
            case "flashcard":
                return renderFlashcardDetails(data as IListFlashcard)
            case "subjectOutline":
                return renderSubjectOutlineDetails(data as ISO)
            case "report":
                return renderReportDetails(data as IReport)
            default:
                return <div>Không có dữ liệu để hiển thị</div>
        }
    }

    const getTitle = () => {
        switch (type) {
            case "user":
                return "Chi tiết người dùng"
            case "quiz":
                return "Chi tiết bài quiz"
            case "history":
                return "Chi tiết lịch sử"
            case "flashcard":
                return "Chi tiết bộ flashcard"
            case "subjectOutline":
                return "Chi tiết đề cương"
            case "report":
                return "Chi tiết báo cáo"
            default:
                return "Chi tiết"
        }
    }

    const canEdit = ["user", "quiz", "flashcard", "subjectOutline"].includes(type)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>{getTitle()}</DialogTitle>
                            <DialogDescription>Xem chi tiết thông tin {isEditing ? "và chỉnh sửa" : ""}</DialogDescription>
                        </div>
                        {canEdit && (
                            <div className="flex gap-2 mr-5">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                            <X className="h-4 w-4" />
                                            Hủy
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={saving} className="text-white">
                                            <Save className="h-4 w-4" />
                                            {saving ? "Đang lưu..." : "Lưu"}
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4" />
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="mt-4">{renderContent()}</div>
            </DialogContent>
        </Dialog>
    )
}
