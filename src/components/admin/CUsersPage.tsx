"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import { CreditCard, Lock, Unlock, UserPlus } from "lucide-react"
import { IUser } from "@/types/type"
import { DataTableUsers } from "./DataTableUsers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default function UsersPage({ user }: { user: IUser[] }) {
    const analyzeUser = [
        {
            title: "Tổng User",
            value: user.length,
            icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả người dùng trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
        },
        {
            title: "Còn hoạt động",
            value: user.filter((f) => f.status).length,
            icon: <Unlock className="h-4 w-4 " />,
            description: "Có thể truy cập",
            bgColor: "bg-green-50 dark:bg-green-900/70 text-green-200",
        },
        {
            title: "Bị khóa",
            value: user.filter((f) => !f.status).length,
            icon: <Lock className="h-4 w-4 " />,
            description: "Bị khóa vì vi phạm cộng đồng",
            bgColor: "bg-red-50 dark:bg-red-900/70 text-red-200",
        },
        {
            title: "Tổng số admin",
            value: user.filter((f) => f.role == "admin").length,
            icon: <CreditCard className="h-4 w-4 " />,
            description: "Quyền Admin",
            bgColor: "bg-purple-50 dark:bg-purple-900/70 text-purple-200",
        },
        {
            title: "Tổng số user",
            value: user.filter((f) => f.role == "user").length,
            icon: <CreditCard className="h-4 w-4 " />,
            description: "Quyền user",
            bgColor: "bg-blue-50 dark:bg-blue-900/70 text-blue-200",
        },
    ]
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
                        <p className="text-muted-foreground">Quản lý tài khoản người dùng trong hệ thống</p>
                    </div>
                </div>
                <Button className="text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-5">
                {analyzeUser.map((item, index) => (
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

                {/* <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Còn hoạt động</CardTitle>
                        <Unlock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{user.filter((f) => f.status).length}</div>
                        <p className="text-xs text-muted-foreground">Có thể truy cập</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bị khóa</CardTitle>
                        <Lock className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{user.filter((f) => !f.status).length}</div>
                        <p className="text-xs text-muted-foreground">Bị khóa vì vi phạm cộng đồng</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số admin</CardTitle>
                        <CreditCard className="h-4 w-4 text-purple-800" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-800">{user.filter((f) => f.role == "admin").length}</div>
                        <p className="text-xs text-muted-foreground">Quyền Admin</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số user</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{user.filter((f) => f.role == "user").length}</div>
                        <p className="text-xs text-muted-foreground">Quyền user</p>
                    </CardContent>
                </Card> */}
            </div>
            <DataTableUsers user={user} />
        </div>
    )
}
