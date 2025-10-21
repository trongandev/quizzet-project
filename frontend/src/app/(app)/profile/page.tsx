import React from "react"

import { GET_API } from "@/lib/fetchAPI"
import UserProfile from "@/components/profile/UserProfile"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
export default async function CProfile() {
    const cookieStore = cookies()

    const token = cookieStore.get("token")?.value || ""
    const req = await GET_API("/profile", token)
    if (req?.gamificationProfile === null) {
        return (
            <div className="h-screen flex items-center justify-center flex-col gap-3 px-5 md:px-0">
                <h3 className="font-semibold text-3xl">Oh no</h3>
                <p>Bạn cần đăng nhập lại để cập nhật tính năng thành tựu, cấp độ và nhiều thứ khác...</p>
                <Link href="/login">
                    <Button variant="secondary">
                        Đi tới đăng nhập <ArrowRight />
                    </Button>
                </Link>
            </div>
        )
    }
    if (req?.ok) return <UserProfile profile={req?.user} quiz={req?.quiz} flashcard={req?.flashcards} gamificationProfile={req?.gamificationProfile} achievements={req.achievements} levels={req.levels} activities={req?.activities} countFlashcard={req?.countFlashcard} isAnotherUser={false} />
    else {
        return (
            <div className="h-screen flex items-center justify-center flex-col gap-3 px-5 md:px-0">
                <h3 className="font-semibold text-3xl">Oh no</h3>
                <p>Đã có lỗi xảy ra khi tải thông tin người dùng. Vui lòng thử lại sau.</p>
            </div>
        )
    }
}
