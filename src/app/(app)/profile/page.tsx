import React from "react"

import { GET_API } from "@/lib/fetchAPI"
import UserProfile from "@/components/profile/UserProfile"
import { cookies } from "next/headers"
export default async function CProfile() {
    const cookieStore = cookies()

    const token = cookieStore.get("token")?.value || ""
    const req = await GET_API("/profile", token)
    return <UserProfile profile={req?.user} quiz={req?.quiz} flashcard={req?.flashcards} />
}
