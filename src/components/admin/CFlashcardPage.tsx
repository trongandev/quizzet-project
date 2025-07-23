"use client"

import { IListFlashcard } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { flashcardColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

// Wrapper component để chuẩn hóa props

export default function CFlashcardPage({ flashcard }: { flashcard: IListFlashcard[] }) {
    const { flashcardAdminConfig } = useAdminConfigs()

    const FlashcardDataTable = ({ data, modalType }: { data: IListFlashcard[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={flashcardColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề..." modalType={modalType as any} />
    }
    return <GenericAdminPage config={flashcardAdminConfig} data={flashcard} dataTableComponent={FlashcardDataTable} />
}
