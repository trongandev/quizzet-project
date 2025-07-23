import React from "react"
import { GET_API } from "@/lib/fetchAPI"

import UserProfile from "@/components/profile/UserProfile"

export default async function ProfileUID({ params }) {
    const { slug } = params

    const req = await GET_API(`/profile/${slug}`)
    return <UserProfile profile={req?.user} quiz={req?.quiz} flashcard={req?.flashcards} gamificationProfile={req?.gamificationProfile} achievements={req.achievements} levels={req.levels} activities={req?.activities} countFlashcard={req?.countFlashcard} isAnotherUser={true} />
}
