"use client"

import { useState } from "react"
import { IDailyTask } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { SubjectOutlineCreateForm } from "./CreateForm"
import Cookies from "js-cookie"
import { POST_API } from "@/lib/fetchAPI"
import { toast } from "sonner"
import { GenericDataTable } from "./GenericDataTable"
import { DailyTaskColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

export default function CDailyTask({ tasks }: { tasks: IDailyTask[] }) {
    const [task, setTask] = useState<IDailyTask[]>(tasks)
    const token = Cookies.get("token") || ""

    const handleCreateSubjectOutline = async (data: any) => {
        try {
            const req = await POST_API("/so", data, "POST", token)
            const res = await req?.json()
            if (res?.ok) {
                setTask((prev) => [...prev, res.data])
                toast.success("Đề cương đã được gửi thành công!", {
                    description: "Bạn có thể kiểm tra trong danh sách đề cương.",
                })
            } else {
                toast.error("Lỗi khi gửi đề cương: ", {
                    description: res?.message || "Vui lòng thử lại sau.",
                })
                throw new Error(res?.message || "Failed to create subject outline")
            }
        } catch (error: any) {
            console.error("Error sending SO JSON:", error.message)
            toast.error("Lỗi khi gửi đề cương: ", {
                description: error.message,
            })
            throw error
        }
    }

    const { dailyTaskAdminConfig } = useAdminConfigs()

    const DataTable = ({ data, modalType }: { data: IDailyTask[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={DailyTaskColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề quiz..." modalType={modalType as any} />
    }

    return <GenericAdminPage config={dailyTaskAdminConfig} data={tasks} dataTableComponent={DataTable} createFormComponent={SubjectOutlineCreateForm} onCreateItem={handleCreateSubjectOutline} />
}
