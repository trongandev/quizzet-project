"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, X } from "lucide-react";
import { IReport } from "@/types/type";
import { DataTableReport } from "./DataTableReport";

export default function CReportPage({ report }: { report: IReport[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Quản lý báo cáo</h2>
                        <p className="text-muted-foreground">Quản lý và xem các báo cáo trong hệ thống</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số báo cáo trong hệ thống</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{report.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả số báo cáo trong hệ thống</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{report.filter((t) => t.status === "resolved").length}</div>
                        <p className="text-xs text-muted-foreground">Đã được phê duyệt</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{report.filter((t) => t.status === "pending").length}</div>
                        <p className="text-xs text-muted-foreground">Cần được xem xét</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
                        <X className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{report.filter((t) => t.status === "rejected").length}</div>
                        <p className="text-xs text-muted-foreground">Đã bị từ chối</p>
                    </CardContent>
                </Card>
            </div>

            <DataTableReport report={report} />
        </div>
    );
}
