import CUsersPage from "@/components/admin/CUsersPage";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function UsersPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/profile/admin", token);
    return <CUsersPage user={res?.user} />;
}
