import CSubjectOutline from "@/components/admin/CSubjectOutline";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function SubjectOutlnePage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/admin/suboutline", token);
    if (!res.ok) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1>Bạn không có quyền truy cập</h1>
            </div>
        );
    }
    return <CSubjectOutline subject_outline={res} />;
}
