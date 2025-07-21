"use client"

import { IUser } from "@/types/type"
import { GenericAdminPage } from "./GenericAdminPage"
import { GenericDataTable } from "./GenericDataTable"
import { userColumns } from "./columnConfigs"
import { useAdminConfigs } from "./enhancedConfigs"

interface CUsersPageProps {
    user: IUser[]
    onDataUpdate?: () => void
}

export default function CUsersPage({ user, onDataUpdate }: CUsersPageProps) {
    const { userAdminConfig } = useAdminConfigs()

    // Wrapper component để chuẩn hóa props
    const UserDataTable = ({ data, modalType, onSave, onDataUpdate }: { data: IUser[]; modalType?: string; onSave?: (data: any) => Promise<void>; onDataUpdate?: () => void }) => {
        return <GenericDataTable data={data} columns={userColumns} searchKey="displayName" searchPlaceholder="Tìm kiếm theo tên..." modalType={modalType as any} onSave={onSave} onDataUpdate={onDataUpdate} />
    }

    return <GenericAdminPage config={userAdminConfig} data={user} dataTableComponent={UserDataTable} onDataUpdate={onDataUpdate} />
}
