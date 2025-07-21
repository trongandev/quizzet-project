"use client"

import { AdminPageWrapper } from "./AdminPageWrapper"
import { IReport } from "@/types/type"

interface CReportPageProps {
    report: IReport[]
    onDataUpdate?: () => void
}

export default function CReportPage({ report, onDataUpdate }: CReportPageProps) {
    return <AdminPageWrapper type="report" data={report} onDataUpdate={onDataUpdate} />
}
