import { AdminPageConfig } from "./GenericAdminPage"
import { FileText, Clock, Users, CreditCard, Unlock, Lock, UserCheck, UserX } from "lucide-react"

export const historyAdminConfig: AdminPageConfig = {
    title: "Quản lý Lịch sử",
    description: "Theo dõi hoạt động của người dùng trong hệ thống",
    createButtonText: "Tạo bản ghi",
    statCards: [
        {
            title: "Tổng lượt làm quiz",
            valueKey: "length",
            icon: FileText,
            description: "Tất cả lượt làm quiz",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Hoàn thành",
            valueKey: (data: any[]) => data.filter((h) => h.isDone).length,
            icon: FileText,
            description: "Đã hoàn thành quiz",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Chưa hoàn thành",
            valueKey: (data: any[]) => data.filter((h) => !h.isDone).length,
            icon: Clock,
            description: "Chưa hoàn thành quiz",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/60 text-yellow-200",
        },
        {
            title: "Người dùng tham gia",
            valueKey: (data: any[]) => new Set(data.map((h) => h.user_id)).size,
            icon: Users,
            description: "Số người dùng đã tham gia",
            bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
        },
    ],
}

export const quizAdminConfig: AdminPageConfig = {
    title: "Quản lý Quiz",
    description: "Quản lý các bài quiz trong hệ thống",
    createButtonText: "Tạo Quiz",
    statCards: [
        {
            title: "Tổng Quiz",
            valueKey: "length",
            icon: FileText,
            description: "Tất cả quiz trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Công khai",
            valueKey: (data: any[]) => data.filter((q) => q.public).length,
            icon: Unlock,
            description: "Có thể truy cập công khai",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Riêng tư",
            valueKey: (data: any[]) => data.filter((q) => !q.public).length,
            icon: Lock,
            description: "Chỉ tác giả có thể truy cập",
            bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
        },
        {
            title: "Tổng câu hỏi",
            valueKey: (data: any[]) => data.reduce((sum, q) => sum + q.questions.length, 0),
            icon: FileText,
            description: "Tổng số câu hỏi",
            bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
        },
    ],
}

export const subjectOutlineAdminConfig: AdminPageConfig = {
    title: "Quản lý Đề cương",
    description: "Quản lý các đề cương môn học trong hệ thống",
    createButtonText: "Tạo Đề cương",
    statCards: [
        {
            title: "Tổng Đề cương",
            valueKey: "length",
            icon: FileText,
            description: "Tất cả đề cương trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Công khai",
            valueKey: (data: any[]) => data.filter((s) => s.public).length,
            icon: Unlock,
            description: "Có thể truy cập công khai",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Riêng tư",
            valueKey: (data: any[]) => data.filter((s) => !s.public).length,
            icon: Lock,
            description: "Chỉ tác giả có thể truy cập",
            bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
        },
        {
            title: "Tổng tài liệu",
            valueKey: (data: any[]) => data.reduce((sum, s) => sum + s.files.length, 0),
            icon: FileText,
            description: "Tổng số tài liệu",
            bgColor: "bg-purple-50 dark:bg-purple-900/60 text-purple-200",
        },
    ],
}

export const flashcardAdminConfig: AdminPageConfig = {
    title: "Quản lý Flashcard",
    description: "Quản lý các bộ thẻ học tập trong hệ thống",
    createButtonText: "Tạo Flashcard",
    statCards: [
        {
            title: "Tổng Flashcards",
            valueKey: "length",
            icon: CreditCard,
            description: "Tất cả bộ thẻ trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Công khai",
            valueKey: (data: any[]) => data.filter((f) => f.public).length,
            icon: Unlock,
            description: "Có thể truy cập công khai",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Riêng tư",
            valueKey: (data: any[]) => data.filter((f) => !f.public).length,
            icon: Lock,
            description: "Chỉ tác giả có thể truy cập",
            bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
        },
        {
            title: "Tổng từ vựng",
            valueKey: (data: any[]) => data.reduce((sum, f) => sum + f.flashcards.length, 0),
            icon: CreditCard,
            description: "Tổng số thẻ học",
            bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
        },
    ],
}

export const userAdminConfig: AdminPageConfig = {
    title: "Quản lý Người dùng",
    description: "Quản lý tài khoản người dùng trong hệ thống",
    createButtonText: "Tạo tài khoản",
    statCards: [
        {
            title: "Tổng người dùng",
            valueKey: "length",
            icon: Users,
            description: "Tất cả tài khoản trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Hoạt động",
            valueKey: (data: any[]) => data.filter((u) => u.status).length,
            icon: UserCheck,
            description: "Tài khoản đang hoạt động",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Bị cấm",
            valueKey: (data: any[]) => data.filter((u) => !u.status).length,
            icon: UserX,
            description: "Tài khoản bị khóa",
            bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
        },
        {
            title: "Admin",
            valueKey: (data: any[]) => data.filter((u) => u.role === "admin").length,
            icon: Users,
            description: "Tài khoản quản trị",
            bgColor: "bg-purple-50 dark:bg-purple-900/60 text-purple-200",
        },
    ],
}
