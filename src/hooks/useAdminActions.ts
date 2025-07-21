"use client"

import { AdminService } from "@/lib/adminService"
import { IUser, IQuiz, IListFlashcard, ISO, IReport } from "@/types/type"
import Cookies from "js-cookie"

export function useAdminActions() {
    const token = Cookies.get("token") || ""

    const updateUser = async (userData: IUser) => {
        if (!token) throw new Error("No authentication token")

        const updateData = {
            displayName: userData.displayName,
            role: userData.role as "user" | "admin",
            status: userData.status,
        }

        return AdminService.updateUser(userData._id, updateData, token)
    }

    const updateQuiz = async (quizData: IQuiz) => {
        if (!token) throw new Error("No authentication token")

        const updateData = {
            title: quizData.title,
            content: quizData.content,
            subject: quizData.subject,
            status: quizData.status,
        }

        return AdminService.updateQuiz(quizData._id, updateData, token)
    }

    const updateFlashcard = async (flashcardData: IListFlashcard) => {
        if (!token) throw new Error("No authentication token")

        const updateData = {
            title: flashcardData.title,
            description: flashcardData.desc,
            subject: "general", // fallback
            access: flashcardData.public ? ("public" as const) : ("private" as const),
        }

        return AdminService.updateFlashcard(flashcardData._id, updateData, token)
    }

    const updateSubjectOutline = async (outlineData: ISO) => {
        if (!token) throw new Error("No authentication token")

        const updateData = {
            title: outlineData.title,
            subject: outlineData.subject,
            status: true, // fallback
        }

        return AdminService.updateSubjectOutline(outlineData._id, updateData, token)
    }

    const updateReport = async (reportData: IReport) => {
        if (!token) throw new Error("No authentication token")

        const updateData = {
            status: reportData.status as "pending" | "resolved",
        }

        return AdminService.updateReport(reportData._id, updateData, token)
    }

    return {
        updateUser,
        updateQuiz,
        updateFlashcard,
        updateSubjectOutline,
        updateReport,
    }
}
