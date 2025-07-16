"use client"

import * as React from "react"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, BookUser, CalendarMinus2, ChevronDown, Edit, LocateFixed, Lock, Mail, MegaphoneOff, MoreHorizontal, Pencil, Search, Unlock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IListFlashcard } from "@/types/type"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import handleCompareDate from "@/lib/CompareDate"
import { Badge } from "../ui/badge"
import { GoogleOutlined } from "@ant-design/icons"
import Link from "next/link"

const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: "🇺🇸",
        chinese: "🇨🇳",
        japan: "🇯🇵",
        korea: "🇰🇷",
        vietnamese: "🇻🇳",
        germany: "🇩🇪",
        france: "🇫🇷",
    }
    return flags[lang] || "🌐"
}

const getLanguageName = (lang: string) => {
    const names: { [key: string]: string } = {
        english: "English",
        chinese: "中文",
        japan: "日本語",
        korea: "한국어",
        vietnamese: "Tiếng Việt",
        germany: "Deutsch",
        france: "Français",
    }
    return names[lang] || "Khác"
}

const getDifficultyBadge = (difficulty: boolean) => {
    switch (difficulty) {
        case true:
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/30">
                    <Unlock className="w-3 h-3 mr-1" />
                    Công khai
                </Badge>
            )
        case false:
            return (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/30">
                    <Lock className="w-3 h-3 mr-1" />
                    Riêng tư
                </Badge>
            )
        default:
            return <Badge variant="secondary">{difficulty}</Badge>
    }
}

export const columns: ColumnDef<IListFlashcard>[] = [
    {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "displayName",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Người dùng
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.userId._id}`} className="flex items-center gap-1">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={row.original.userId.profilePicture} alt="Profile Picture" className="object-cover" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                        {(row.original.userId.displayName || "")
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || ""}
                    </AvatarFallback>
                </Avatar>
                <p className="text-white/80 font-medium w-[150px] line-clamp-1" title={row.original.userId.displayName}>
                    {row.original.userId.displayName}
                </p>
            </Link>
        ),
    },

    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tiêu đề
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <Link href={`/flashcard/${row.original._id}`} className="w-[200px] block" target="_blank">
                {row.getValue("title")}
            </Link>
        ),
    },
    {
        accessorKey: "desc",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mô tả
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-xs dark:text-white/60">{row.getValue("desc") || "Không có"}</div>,
    },
    {
        accessorKey: "language",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Ngôn ngữ
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <Badge variant="secondary" className="">
                {getLanguageFlag(row.original.language) + " " + getLanguageName(row.original.language)}
            </Badge>
        ),
    },

    {
        accessorKey: "public",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Chế độ
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{getDifficultyBadge(row.original.public)}</div>,
    },
    {
        accessorKey: "flashcards",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số lượng thẻ
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge variant="outline">{row.original.flashcards.length}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Ngày tạo
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-xs dark:text-white/60">{handleCompareDate(row.original.created_at)}</div>,
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment._id)}>
                            <BookUser />
                            Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-700 dark:text-red-300">
                            <MegaphoneOff /> Vô hiệu hóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function DataTableFlashcard({ flashcard }: { flashcard: IListFlashcard[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable<IListFlashcard>({
        data: flashcard,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-5">
                    <div className="relative w-full ">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Tìm kiếm tên..." className="pl-10 w-full md:w-64 " value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("displayName")?.setFilterValue(event.target.value)} />
                    </div>
                    <div className="relative w-full ">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Tìm kiếm tiêu đề..." className="pl-10 w-full md:w-64 " value={(table.getColumn("title")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)} />
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border dark:border-white/10">
                <Table>
                    <TableHeader className="dark:border-white/10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
