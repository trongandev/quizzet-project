"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, CreditCard, Plus, Lock, Unlock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableFlashcard } from "./DataTableFlashcard";
import { IListFlashcard } from "@/types/type";

const flashcards = [
    {
        id: 1,
        creator: {
            name: "Gragon Yellow",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        title: "Phát triển",
        language: "en",
        description: "",
        difficulty: "private",
        cardCount: 5,
        createdAt: "2 ngày trước",
    },
    {
        id: 2,
        creator: {
            name: "Lieu Nguyen",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        title: "a",
        language: "en",
        description: "",
        difficulty: "public",
        cardCount: 1,
        createdAt: "2 ngày trước",
    },
    {
        id: 3,
        creator: {
            name: "KHOA",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        title: "HSK 3 LESSON 19",
        language: "zh",
        description: "",
        difficulty: "public",
        cardCount: 16,
        createdAt: "6 ngày trước",
    },
    {
        id: 4,
        creator: {
            name: "KHOA",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        title: "HSK 3 LESSON 18",
        language: "zh",
        description: "",
        difficulty: "public",
        cardCount: 18,
        createdAt: "7 ngày trước",
    },
    {
        id: 5,
        creator: {
            name: "KHOA",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        title: "TOEIC 2024 Test 1",
        language: "en",
        description: "",
        difficulty: "private",
        cardCount: 104,
        createdAt: "13 ngày trước",
    },
];

export default function CFlashcardPage({ flashcard }: { flashcard: IListFlashcard[] }) {
    const [searchTerm, setSearchTerm] = useState("");

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
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Flashcards</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{flashcards.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bộ thẻ trong hệ thống</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Công khai</CardTitle>
                        <Unlock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{flashcards.filter((f) => f.difficulty === "public").length}</div>
                        <p className="text-xs text-muted-foreground">Có thể truy cập công khai</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Riêng tư</CardTitle>
                        <Lock className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{flashcards.filter((f) => f.difficulty === "private").length}</div>
                        <p className="text-xs text-muted-foreground">Chỉ tác giả có thể truy cập</p>
                    </CardContent>
                </Card>
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thẻ</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{flashcards.reduce((sum, f) => sum + f.cardCount, 0)}</div>
                        <p className="text-xs text-muted-foreground">Tổng số thẻ học</p>
                    </CardContent>
                </Card>
            </div>

            {/* <Card>
                <CardHeader>
                    <CardTitle>Danh sách Flashcards</CardTitle>
                    <CardDescription>Quản lý các bộ thẻ học tập được tạo bởi người dùng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input placeholder="Tìm kiếm flashcard..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ngôn ngữ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="en">Tiếng Anh</SelectItem>
                                <SelectItem value="zh">Tiếng Trung</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Quyền truy cập" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="public">Công khai</SelectItem>
                                <SelectItem value="private">Riêng tư</SelectItem>
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
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Ngôn ngữ</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Chế độ</TableHead>
                                <TableHead>Số lượng thẻ</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flashcards.map((flashcard, index) => (
                                <TableRow key={flashcard.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={flashcard.creator.avatar || "/placeholder.svg"} alt={flashcard.creator.name} />
                                                <AvatarFallback>{flashcard.creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{flashcard.creator.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{flashcard.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getLanguageFlag(flashcard.language)}</span>
                                            <span className="text-sm text-muted-foreground">{flashcard.language === "en" ? "Tiếng Anh" : "Tiếng Trung"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{flashcard.description || "Không có mô tả"}</TableCell>
                                    <TableCell>{getDifficultyBadge(flashcard.difficulty)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                            {flashcard.cardCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{flashcard.createdAt}</TableCell>
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
                                                <DropdownMenuItem>{flashcard.difficulty === "public" ? "Chuyển riêng tư" : "Chuyển công khai"}</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Xóa flashcard</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card> */}
            <DataTableFlashcard flashcard={flashcard} />
        </div>
    );
}
