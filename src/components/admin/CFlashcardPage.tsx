"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, Lock, Unlock } from "lucide-react"
import { DataTableFlashcard } from "./DataTableFlashcard"
import { IListFlashcard } from "@/types/type"

export default function CFlashcardPage({ flashcard }: { flashcard: IListFlashcard[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const analyzeFlahcard = [
        {
            title: "Tổng Flashcards",
            value: flashcard.length,
            icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả bộ thẻ trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Công khai",
            value: flashcard.filter((f) => f.public).length,
            icon: <Unlock className="h-4 w-4 text-green-600" />,
            description: "Có thể truy cập công khai",
            bgColor: "bg-green-50 dark:bg-green-900/60 text-green-200",
        },
        {
            title: "Riêng tư",
            value: flashcard.filter((f) => !f.public).length,
            icon: <Lock className="h-4 w-4 text-red-600" />,
            description: "Chỉ tác giả có thể truy cập",
            bgColor: "bg-red-50 dark:bg-red-900/60 text-red-200",
        },
        {
            title: "Tổng từ vựng",
            value: flashcard.reduce((sum, f) => sum + f.flashcards.length, 0),
            icon: <CreditCard className="h-4 w-4 text-blue-600" />,
            description: "Tổng số thẻ học",
            bgColor: "bg-blue-50 dark:bg-blue-900/60 text-blue-200",
        },
    ]
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Quản lý Flashcard</h2>
                        <p className="text-muted-foreground">Quản lý các bộ thẻ học tập trong hệ thống</p>
                    </div>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Flashcard
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {analyzeFlahcard.map((item, index) => (
                    <Card className={`dark:border-white/10 ${item.bgColor}`} key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DataTableFlashcard flashcard={flashcard} />
        </div>
    )
}
