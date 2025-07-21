"use client"

import { AdminPageWrapper } from "./AdminPageWrapper"
import { IUser } from "@/types/type"

interface CUsersPageProps {
    users: IUser[]
    onDataUpdate?: () => void
}

export default function CUsersPage({ users, onDataUpdate }: CUsersPageProps) {
    return <AdminPageWrapper type="user" data={users} onDataUpdate={onDataUpdate} />
}
