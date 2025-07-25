"use client"

import { IQuiz } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { quizColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"
import { toast } from "sonner"
import { POST_API } from "@/lib/fetchAPI"
import Cookies from "js-cookie"
// Wrapper component để chuẩn hóa props

export default function CQuizsPage({ quiz }: { quiz: IQuiz[] }) {
    const { quizAdminConfig } = useAdminConfigs()
    const token = Cookies.get("token") || ""
    const onSave = async (data: IQuiz) => {
        // Implement save logic here if needed
        console.log("Saving data:", data)
        try {
            const req = await POST_API(`/quiz/admin/${data._id}`, data, "PATCH", token || "")
            const res = await req?.json()
            if (res?.ok) {
                toast.success("Cập nhật thành công")
                quiz = quiz.map((q) => (q._id === data._id ? { ...q, ...data } : q)) // Update the local state with the new data
            } else {
                toast.error("Lỗi khi lưu quiz: ", {
                    description: res?.message || "Vui lòng thử lại sau.",
                })
            }
        } catch (error: any) {
            console.error("Error saving quiz data:", error.message)
            toast.error("Lỗi khi lưu quiz: ", {
                description: error.message,
            })
        }
    }
    const QuizDataTable = ({ data, modalType }: { data: IQuiz[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={quizColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề..." modalType={modalType as any} onSave={onSave} />
    }
    return <GenericAdminPage config={quizAdminConfig} data={quiz} dataTableComponent={QuizDataTable} />
}
