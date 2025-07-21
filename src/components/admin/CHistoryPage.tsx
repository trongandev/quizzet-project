"use client"

import { IHistory } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { historyAdminConfig } from "./configs"
import { GenericDataTable } from "./GenericDataTable"
import { historyColumns } from "./columnConfigs"

// Wrapper component để chuẩn hóa props
const HistoryDataTable = ({ data }: { data: IHistory[] }) => {
    return <GenericDataTable data={data} columns={historyColumns} searchKey="title" searchPlaceholder="Tìm kiếm theo tiêu đề quiz..." modalType="history" />
}

export default function CHistoryPage({ history }: { history: IHistory[] }) {
    return <GenericAdminPage config={historyAdminConfig} data={history} dataTableComponent={HistoryDataTable} />
}
