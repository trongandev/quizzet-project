import CReportPage from "@/components/admin/CReportPage";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function ReportPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/report/admin", token);
    return <CReportPage report={res.result} />;
}
