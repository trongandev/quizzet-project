"use client"

import { IQuiz } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { quizColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

// Wrapper component để chuẩn hóa props

export default function CQuizsPage({ quiz }: { quiz: IQuiz[] }) {
    const { quizAdminConfig } = useAdminConfigs()

    const QuizDataTable = ({ data, modalType }: { data: IQuiz[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={quizColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề..." modalType={modalType as any} />
    }
    return <GenericAdminPage config={quizAdminConfig} data={quiz} dataTableComponent={QuizDataTable} />
}
