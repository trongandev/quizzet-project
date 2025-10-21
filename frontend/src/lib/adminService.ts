import { POST_API } from "@/lib/fetchAPI"

export interface UpdateUserRequest {
    displayName?: string
    role?: "user" | "admin"
    status?: boolean
}

export interface UpdateQuizRequest {
    title?: string
    content?: string
    subject?: string
    status?: boolean
}

export interface UpdateFlashcardRequest {
    title?: string
    description?: string
    subject?: string
    access?: "public" | "private"
}

export interface UpdateSubjectOutlineRequest {
    title?: string
    subject?: string
    status?: boolean
}

export interface UpdateReportRequest {
    status?: "pending" | "resolved"
}

export class AdminService {
    static async updateUser(userId: string, data: UpdateUserRequest, token: string) {
        try {
            const response = await POST_API(`/admin/users/${userId}`, data, "PUT", token)

            if (!response || !response.ok) {
                throw new Error("Failed to update user")
            }

            return response.json()
        } catch (error) {
            console.error("Error updating user:", error)
            throw error
        }
    }

    static async updateQuiz(quizId: string, data: UpdateQuizRequest, token: string) {
        try {
            const response = await POST_API(`/admin/quizzes/${quizId}`, data, "PUT", token)

            if (!response || !response.ok) {
                throw new Error("Failed to update quiz")
            }

            return response.json()
        } catch (error) {
            console.error("Error updating quiz:", error)
            throw error
        }
    }

    static async updateFlashcard(flashcardId: string, data: UpdateFlashcardRequest, token: string) {
        try {
            const response = await POST_API(`/admin/flashcards/${flashcardId}`, data, "PUT", token)

            if (!response || !response.ok) {
                throw new Error("Failed to update flashcard")
            }

            return response.json()
        } catch (error) {
            console.error("Error updating flashcard:", error)
            throw error
        }
    }

    static async updateSubjectOutline(outlineId: string, data: UpdateSubjectOutlineRequest, token: string) {
        try {
            const response = await POST_API(`/admin/subject-outlines/${outlineId}`, data, "PUT", token)

            if (!response || !response.ok) {
                throw new Error("Failed to update subject outline")
            }

            return response.json()
        } catch (error) {
            console.error("Error updating subject outline:", error)
            throw error
        }
    }

    static async updateReport(reportId: string, data: UpdateReportRequest, token: string) {
        try {
            const response = await POST_API(`/admin/reports/${reportId}`, data, "PUT", token)

            if (!response || !response.ok) {
                throw new Error("Failed to update report")
            }

            return response.json()
        } catch (error) {
            console.error("Error updating report:", error)
            throw error
        }
    }
}
