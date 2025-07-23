"use client"

import React, { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, LucideIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Generic interfaces
export interface StatCard {
    title: string
    icon: LucideIcon
    valueKey: string | ((data: any[]) => number)
    description: string
    bgColor?: string
    filter?: (items: any[]) => any[]
}

export interface AdminPageConfig {
    title: string
    description: string
    createButtonText?: string
    showCreateButton?: boolean
    statCards: StatCard[]
    modalType?: "user" | "quiz" | "history" | "flashcard" | "subjectOutline" | "report"
    onSave?: (data: any) => Promise<void>
}

export interface CreateFormProps {
    onSubmit: (data: any) => Promise<void>
    onCancel: () => void
    loading: boolean
}

interface GenericAdminPageProps {
    config: AdminPageConfig
    data: any[]
    dataTableComponent: React.ComponentType<{
        data: any[]
        modalType?: AdminPageConfig["modalType"]
        onSave?: AdminPageConfig["onSave"]
        onDataUpdate?: () => void
    }>
    createFormComponent?: React.ComponentType<CreateFormProps>
    onCreateItem?: (data: any) => Promise<void>
    onDataUpdate?: () => void
}

export function GenericAdminPage({ config, data, dataTableComponent, createFormComponent, onCreateItem, onDataUpdate }: GenericAdminPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateItem = async (formData: any) => {
        if (!onCreateItem) return

        try {
            setIsCreating(true)
            await onCreateItem(formData)
            setIsCreateDialogOpen(false)
        } catch (error) {
            console.error("Error creating item:", error)
        } finally {
            setIsCreating(false)
        }
    }

    const calculateStatValue = (statCard: StatCard) => {
        if (statCard.filter) {
            return statCard.filter(data).length
        }
        return typeof statCard.valueKey === "number" ? statCard.valueKey : data.length
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{config?.title}</h2>
                        <p className="text-muted-foreground">{config?.description}</p>
                    </div>
                </div>
                {config.showCreateButton && createFormComponent && (
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                {config.createButtonText || "Tạo mới"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            {React.createElement(createFormComponent, {
                                onSubmit: handleCreateItem,
                                onCancel: () => setIsCreateDialogOpen(false),
                                loading: isCreating,
                            })}
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Stats Cards */}
            <div className={`grid gap-4 md:grid-cols-${Math.min(config.statCards.length, 4)}`}>
                {config.statCards.map((statCard, index) => {
                    const IconComponent = statCard.icon
                    const value = calculateStatValue(statCard)

                    return (
                        <Card key={index} className={`dark:border-white/10  ${statCard.bgColor || ""}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{statCard.title}</CardTitle>
                                <IconComponent className={`h-4 w-4 ${statCard.bgColor || "text-muted-foreground"}`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold`}>{value}</div>
                                <p className="text-xs text-muted-foreground">{statCard.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Data Table */}
            {React.createElement(dataTableComponent, {
                data,
                modalType: config.modalType,
                onSave: config.onSave,
                onDataUpdate,
            })}
        </div>
    )
}
