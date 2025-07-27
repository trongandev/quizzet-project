import { AdminPageConfig } from "./GenericAdminPage"
import { useAdminActions } from "@/hooks/useAdminActions"
import { IUser, IQuiz, IListFlashcard, ISO, IReport, IDailyTask } from "@/types/type"
import { FileText, Clock, Users, CreditCard, Unlock, Lock, UserCheck, UserX } from "lucide-react"

export function useAdminConfigs() {
    const { updateUser, updateQuiz, updateFlashcard, updateSubjectOutline, updateReport } = useAdminActions()

    const userAdminConfig: AdminPageConfig = {
        title: "Quản lý Người dùng",
        description: "Quản lý thông tin và quyền của người dùng",
        createButtonText: "Tạo Người dùng",
        modalType: "user",
        onSave: async (data: IUser) => {
            await updateUser(data)
        },
        statCards: [
            {
                title: "Tổng người dùng",
                valueKey: "length",
                icon: Users,
                description: "Tất cả người dùng",
                bgColor: "dark:bg-gray-900/50",
            },
            {
                title: "Đang hoạt động",
                valueKey: (data: IUser[]) => data.filter((u) => u.status).length,
                icon: UserCheck,
                description: "Người dùng đang hoạt động",
                bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
            },
            {
                title: "Bị cấm",
                valueKey: (data: IUser[]) => data.filter((u) => !u.status).length,
                icon: UserX,
                description: "Người dùng bị cấm",
                bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
            },
            {
                title: "Admin",
                valueKey: (data: IUser[]) => data.filter((u) => u.role === "admin").length,
                icon: CreditCard,
                description: "Quản trị viên",
                bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
            },
        ],
    }

    const quizAdminConfig: AdminPageConfig = {
        title: "Quản lý Quiz",
        description: "Quản lý các bài quiz trong hệ thống",
        createButtonText: "Tạo Quiz",
        modalType: "quiz",
        onSave: async (data: IQuiz) => {
            await updateQuiz(data)
        },
        statCards: [
            {
                title: "Tổng Quiz",
                valueKey: "length",
                icon: FileText,
                description: "Tất cả quiz trong hệ thống",
                bgColor: "dark:bg-gray-900/50",
            },
            {
                title: "Đã duyệt",
                valueKey: (data: IQuiz[]) => data.filter((q) => q.status).length,
                icon: FileText,
                description: "Quiz đã được duyệt",
                bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
            },
            {
                title: "Chờ duyệt",
                valueKey: (data: IQuiz[]) => data.filter((q) => !q.status).length,
                icon: Clock,
                description: "Quiz chờ duyệt",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/60 text-yellow-200",
            },
            {
                title: "Tác giả",
                valueKey: (data: IQuiz[]) => new Set(data.map((q) => q.uid?._id)).size,
                icon: Users,
                description: "Số tác giả",
                bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
            },
        ],
    }

    const flashcardAdminConfig: AdminPageConfig = {
        title: "Quản lý Flashcard",
        description: "Quản lý các bộ flashcard trong hệ thống",
        createButtonText: "Tạo Flashcard",
        modalType: "flashcard",
        onSave: async (data: IListFlashcard) => {
            await updateFlashcard(data)
        },
        statCards: [
            {
                title: "Tổng Flashcard",
                valueKey: "length",
                icon: CreditCard,
                description: "Tất cả bộ flashcard",
                bgColor: "dark:bg-gray-900/50",
            },
            {
                title: "Công khai",
                valueKey: (data: IListFlashcard[]) => data.filter((f) => f.public).length,
                icon: Unlock,
                description: "Flashcard công khai",
                bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
            },
            {
                title: "Riêng tư",
                valueKey: (data: IListFlashcard[]) => data.filter((f) => !f.public).length,
                icon: Lock,
                description: "Flashcard riêng tư",
                bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
            },
            {
                title: "Tác giả",
                valueKey: (data: IListFlashcard[]) => new Set(data.map((f) => f.userId?._id)).size,
                icon: Users,
                description: "Số tác giả",
                bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
            },
        ],
    }

    const subjectOutlineAdminConfig: AdminPageConfig = {
        title: "Quản lý Đề cương",
        description: "Quản lý các đề cương môn học",
        createButtonText: "Tạo Đề cương",
        modalType: "subjectOutline",
        onSave: async (data: ISO) => {
            await updateSubjectOutline(data)
        },
        showCreateButton: true,
        statCards: [
            {
                title: "Tổng đề cương",
                valueKey: "length",
                icon: FileText,
                description: "Tất cả đề cương",
                bgColor: "dark:bg-gray-900/50",
            },
            {
                title: "Hoạt động",
                valueKey: "length", // fallback, would need proper status field
                icon: FileText,
                description: "Đề cương đang hoạt động",
                bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
            },
            {
                title: "Môn học",
                valueKey: (data: ISO[]) => new Set(data.map((s) => s.subject)).size,
                icon: FileText,
                description: "Số môn học",
                bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
            },
            {
                title: "Tác giả",
                valueKey: (data: ISO[]) => new Set(data.map((s) => s.user_id?._id)).size,
                icon: Users,
                description: "Số tác giả",
                bgColor: "bg-purple-50 dark:bg-purple-900/60 text-purple-200",
            },
        ],
    }

    const historyAdminConfig: AdminPageConfig = {
        title: "Quản lý Lịch sử",
        description: "Theo dõi hoạt động của người dùng trong hệ thống",
        createButtonText: "Tạo bản ghi",
        modalType: "history",
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

    const reportAdminConfig: AdminPageConfig = {
        title: "Quản lý Báo cáo",
        description: "Xử lý các báo cáo từ người dùng",
        createButtonText: "Tạo báo cáo",
        modalType: "report",
        onSave: async (data: IReport) => {
            await updateReport(data)
        },
        statCards: [
            {
                title: "Tổng báo cáo",
                valueKey: "length",
                icon: FileText,
                description: "Tất cả báo cáo",
                bgColor: "dark:bg-gray-900/50",
            },
            {
                title: "Chờ xử lý",
                valueKey: (data: IReport[]) => data.filter((r) => r.status === "pending").length,
                icon: Clock,
                description: "Báo cáo chờ xử lý",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/60 text-yellow-200",
            },
            {
                title: "Đã xử lý",
                valueKey: (data: IReport[]) => data.filter((r) => r.status === "resolved").length,
                icon: FileText,
                description: "Báo cáo đã xử lý",
                bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
            },
            {
                title: "Vi phạm",
                valueKey: (data: IReport[]) => data.filter((r) => r.is_violated).length,
                icon: UserX,
                description: "Báo cáo có vi phạm",
                bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
            },
        ],
    }
    const dailyTaskAdminConfig: AdminPageConfig = {
        title: "Quản lý nhiệm vụ",
        description: "Quản lý các nhiệm vụ hàng ngày",
        createButtonText: "Tạo nhiệm vụ mới",
        modalType: "dailyTask",
        // onSave: async (data: IDailyTask) => {
        //     await updateSubjectOutline(data)
        // },
        showCreateButton: true,
        statCards: [
            {
                title: "Tổng nhiệm vụ",
                valueKey: "length",
                icon: FileText,
                description: "Tất cả nhiệm vụ hàng ngày",
                bgColor: "dark:bg-gray-900/50",
            },
        ],
    }

    return {
        userAdminConfig,
        quizAdminConfig,
        flashcardAdminConfig,
        subjectOutlineAdminConfig,
        historyAdminConfig,
        reportAdminConfig,
        dailyTaskAdminConfig,
    }
}
