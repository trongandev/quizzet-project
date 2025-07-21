"use client"

import { IQuiz } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { quizAdminConfig } from "./configs"
import { GenericDataTable } from "./GenericDataTable"
import { quizColumns } from "./columnConfigs"

// Wrapper component để chuẩn hóa props
const QuizDataTable = ({ data }: { data: IQuiz[] }) => {
    return <GenericDataTable data={data} columns={quizColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề..." modalType="quiz" />
}

export default function CQuizsPage({ quiz }: { quiz: IQuiz[] }) {
    return <GenericAdminPage config={quizAdminConfig} data={quiz} dataTableComponent={QuizDataTable} />
}
