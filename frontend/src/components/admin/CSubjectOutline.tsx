"use client"

import { useState } from "react"
import { ISO } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { SubjectOutlineCreateForm } from "./CreateForm"
import Cookies from "js-cookie"
import { POST_API } from "@/lib/fetchAPI"
import { toast } from "sonner"
import { GenericDataTable } from "./GenericDataTable"
import { subjectOutlineColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

export default function CSubjectOutline({ subject_outline }: { subject_outline: ISO[] }) {
    const [SO, setSO] = useState<ISO[]>(subject_outline)
    const token = Cookies.get("token") || ""

    const handleCreateSubjectOutline = async (data: any) => {
        try {
            const req = await POST_API("/so", data, "POST", token)
            const res = await req?.json()
            if (res?.ok) {
                setSO((prev) => [...prev, res.data])
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

    const { subjectOutlineAdminConfig } = useAdminConfigs()

    const SubjectOutlineDataTable = ({ data, modalType }: { data: ISO[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={subjectOutlineColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề quiz..." modalType={modalType as any} />
    }

    return <GenericAdminPage config={subjectOutlineAdminConfig} data={SO} dataTableComponent={SubjectOutlineDataTable} createFormComponent={SubjectOutlineCreateForm} onCreateItem={handleCreateSubjectOutline} />
}
