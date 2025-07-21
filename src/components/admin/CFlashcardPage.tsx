"use client"

import { IListFlashcard } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { flashcardAdminConfig } from "./configs"
import { GenericDataTable } from "./GenericDataTable"
import { flashcardColumns } from "./columnConfigs"

// Wrapper component để chuẩn hóa props
const FlashcardDataTable = ({ data }: { data: IListFlashcard[] }) => {
    return <GenericDataTable data={data} columns={flashcardColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề..." modalType="flashcard" />
}

export default function CFlashcardPage({ flashcard }: { flashcard: IListFlashcard[] }) {
    return <GenericAdminPage config={flashcardAdminConfig} data={flashcard} dataTableComponent={FlashcardDataTable} />
}
