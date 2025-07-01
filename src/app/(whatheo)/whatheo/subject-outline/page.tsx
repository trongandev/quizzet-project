import CSubjectOutline from "@/components/admin/CSubjectOutline";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function SubjectOutlnePage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/admin/suboutline", token);
    return <CSubjectOutline subject_outline={res} />;
}
