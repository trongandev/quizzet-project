"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { CreditCard, Lock, Unlock, UserPlus } from "lucide-react";
import { IUser } from "@/types/type";
import { DataTableUsers } from "./DataTableUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function UsersPage({ user }: { user: IUser[] }) {
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
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng User</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bộ thẻ trong hệ thống</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
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
                </Card>
            </div>
            <DataTableUsers user={user} />
        </div>
    );
}
