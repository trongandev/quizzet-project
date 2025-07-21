"use client"

import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { useAdminConfigs } from "./enhancedConfigs"
import { userColumns, quizColumns, flashcardColumns, subjectOutlineColumns, historyColumns, reportColumns } from "./columnConfigs"

interface AdminPageWrapperProps {
    type: "user" | "quiz" | "flashcard" | "subjectOutline" | "history" | "report"
    data: any[]
    onDataUpdate?: () => void
}

export function AdminPageWrapper({ type, data, onDataUpdate }: AdminPageWrapperProps) {
    const configs = useAdminConfigs()

    const getConfig = () => {
        switch (type) {
            case "user":
                return configs.userAdminConfig
            case "quiz":
                return configs.quizAdminConfig
            case "flashcard":
                return configs.flashcardAdminConfig
            case "subjectOutline":
                return configs.subjectOutlineAdminConfig
            case "history":
                return configs.historyAdminConfig
            case "report":
                return configs.reportAdminConfig
            default:
                return configs.userAdminConfig
        }
    }

    const getColumns = () => {
        switch (type) {
            case "user":
                return userColumns
            case "quiz":
                return quizColumns
            case "flashcard":
                return flashcardColumns
            case "subjectOutline":
                return subjectOutlineColumns
            case "history":
                return historyColumns
            case "report":
                return reportColumns
            default:
                return userColumns
        }
    }

    const getSearchKey = () => {
        switch (type) {
            case "user":
                return "displayName"
            case "quiz":
                return "title"
            case "flashcard":
                return "title"
            case "subjectOutline":
                return "title"
            case "history":
                return "quiz_id.title"
            case "report":
                return "content"
            default:
                return "title"
        }
    }

    const DataTableComponent = ({ data, modalType, onSave, onDataUpdate }: any) => <GenericDataTable data={data} columns={getColumns()} searchKey={getSearchKey()} modalType={modalType} onSave={onSave} onDataUpdate={onDataUpdate} />

    return <GenericAdminPage config={getConfig()} data={data} dataTableComponent={DataTableComponent} onDataUpdate={onDataUpdate} />
}
