import CHistoryPage from "@/components/admin/CHistoryPage";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function HistoryPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/history/admin", token);
    return <CHistoryPage history={res.history} />;
}
