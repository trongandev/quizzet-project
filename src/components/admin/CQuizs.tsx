"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, FileText, Plus, CheckCircle, Clock, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { DataTableQuiz } from "./DataTableQuiz";
import { IQuiz } from "@/types/type";

const topics = [
    {
        id: 1,
        title: "Câu hỏi về AI",
        category: "AI",
        thumbnail: "/placeholder.svg?height=60&width=80",
        createdAt: "2 ngày trước",
        status: "approved",
    },
    {
        id: 2,
        title: "50 bài về tư tưởng HCM",
        category: "50 bài về tư tưởng HCM",
        thumbnail: "/placeholder.svg?height=60&width=80",
        createdAt: "2 ngày trước",
        status: "pending",
    },
    {
        id: 3,
        title: "tinhocvp",
        category: "thi ả",
        thumbnail: null,
        createdAt: "21 ngày trước",
        status: "pending",
    },
    {
        id: 4,
        title: "tinhocvp",
        category: "thi ả",
        thumbnail: null,
        createdAt: "21 ngày trước",
        status: "pending",
    },
];

export default function CQuizsPage({ quiz }: { quiz: IQuiz[] }) {
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
                        <div className="text-2xl font-bold">{topics.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bài đăng trong hệ thống</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{topics.filter((t) => t.status === "approved").length}</div>
                        <p className="text-xs text-muted-foreground">Đã được phê duyệt</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{topics.filter((t) => t.status === "pending").length}</div>
                        <p className="text-xs text-muted-foreground">Cần được xem xét</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
                        <X className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{topics.filter((t) => t.status === "rejected").length}</div>
                        <p className="text-xs text-muted-foreground">Đã bị từ chối</p>
                    </CardContent>
                </Card>
            </div>

            {/* <Card className="dark:border-white/10">
                <CardHeader>
                    <CardTitle>Danh sách bài đăng</CardTitle>
                    <CardDescription>Quản lý và kiểm duyệt nội dung bài đăng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input placeholder="Tìm kiếm bài đăng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="approved">Đã duyệt</SelectItem>
                                <SelectItem value="pending">Chờ duyệt</SelectItem>
                                <SelectItem value="rejected">Từ chối</SelectItem>
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
                                <TableHead>Hình ảnh</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Ngày đăng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topics.map((topic, index) => (
                                <TableRow key={topic.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="w-16 h-12 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                            {topic.thumbnail ? (
                                                <Image src={topic.thumbnail || "/placeholder.svg"} alt={topic.title} width={64} height={48} className="object-cover w-full h-full" />
                                            ) : (
                                                <FileText className="w-6 h-6 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-xs">
                                        <div className="truncate">{topic.title}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{topic.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{topic.createdAt}</TableCell>
                                    <TableCell>{getStatusBadge(topic.status)}</TableCell>
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
                                                {topic.status === "pending" && (
                                                    <>
                                                        <DropdownMenuItem className="text-green-600">Phê duyệt</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Từ chối</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                <DropdownMenuItem className="text-red-600">Xóa bài đăng</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card> */}
            <DataTableQuiz quiz={quiz} />
        </div>
    );
}
