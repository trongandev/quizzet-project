"use client"

import { useState } from "react"
import { IDailyTask } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { DailyTaskCreateForm } from "./CreateForm"
import Cookies from "js-cookie"
import { POST_API } from "@/lib/fetchAPI"
import { toast } from "sonner"
import { GenericDataTable } from "./GenericDataTable"
import { DailyTaskColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

export default function CDailyTask({ tasks }: { tasks: IDailyTask[] }) {
    const [task, setTask] = useState<IDailyTask[]>(tasks)
    const token = Cookies.get("token") || ""

    const handleSubmit = async (data: any) => {
        try {
            const req = await POST_API("/task", data, "POST", token)
            const res = await req?.json()
            if (res?.ok) {
                setTask((prev) => [...prev, res.data])
                toast.success(res.message)
            } else {
                toast.error(res?.message)
                return
            }
        } catch (error: any) {
            console.error("Error sending SO JSON:", error.message)
            toast.error(error.message)
            return
        }
    }

    const { dailyTaskAdminConfig } = useAdminConfigs()

    const DataTable = ({ data, modalType }: { data: IDailyTask[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={DailyTaskColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề quiz..." modalType={modalType as any} />
    }

    return <GenericAdminPage config={dailyTaskAdminConfig} data={task} dataTableComponent={DataTable} createFormComponent={DailyTaskCreateForm} onCreateItem={handleSubmit} />
}
