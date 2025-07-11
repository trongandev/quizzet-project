"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, CheckCircle, Clock, X } from "lucide-react";
import { ISO } from "@/types/type";
import { DataTableSubjectOutline } from "./DataTableSubjectOutline";

export default function CSubjectOutline({ subject_outline }: { subject_outline: ISO[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Quản lý bài đăng</h2>
                        <p className="text-muted-foreground">Quản lý và kiểm duyệt các bài đăng trong hệ thống</p>
                    </div>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo bài đăng
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bài đăng</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subject_outline.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bài đăng trong hệ thống</p>
                    </CardContent>
                </Card>
                {/* <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{subject_outline.filter((t) => t.status === "approved").length}</div>
                        <p className="text-xs text-muted-foreground">Đã được phê duyệt</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{subject_outline.filter((t) => t.status === "pending").length}</div>
                        <p className="text-xs text-muted-foreground">Cần được xem xét</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng dung lượng</CardTitle>
                        <X className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{subject_outline.filter((t) => t.type !== "txt")}</div>
                        <p className="text-xs text-muted-foreground">Đã bị từ chối</p>
                    </CardContent>
                </Card> */}
            </div>

            <DataTableSubjectOutline subject_outline={subject_outline} />
        </div>
    );
}
