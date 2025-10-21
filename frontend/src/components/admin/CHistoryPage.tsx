"use client"

import { IHistory } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { historyColumns } from "./columnConfigs"
import { useAdminConfigs } from "@/components/admin/enhancedConfigs"

// Wrapper component để chuẩn hóa props

export default function CHistoryPage({ history }: { history: IHistory[] }) {
    const { historyAdminConfig } = useAdminConfigs()

    const HistoryDataTable = ({ data, modalType }: { data: IHistory[]; modalType?: string }) => {
        return <GenericDataTable data={data} columns={historyColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề quiz..." modalType={modalType as any} />
    }
    return <GenericAdminPage config={historyAdminConfig} data={history} dataTableComponent={HistoryDataTable} />
}
