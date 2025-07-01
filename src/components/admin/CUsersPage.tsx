"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IUser } from "@/types/type";
import { DataTableUsers } from "./DataTableUsers";

export default function UsersPage({ user }: { user: IUser[] }) {
    const [searchTerm, setSearchTerm] = useState("");

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
            {/* 
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách người dùng</CardTitle>
                    <CardDescription>Tổng cộng {users.length} người dùng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input placeholder="Tìm kiếm người dùng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Lọc
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Quyền</TableHead>
                                <TableHead>Hoạt động</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Hoạt động
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch defaultChecked />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Vô hiệu hóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card> */}
            <DataTableUsers user={user} />
        </div>
    );
}
