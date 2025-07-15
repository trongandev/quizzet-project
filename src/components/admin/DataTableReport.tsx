"use client"

import React, { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    BookUser,
    CalendarMinus2,
    CheckCircle,
    ChevronDown,
    Clock,
    Edit,
    LocateFixed,
    Mail,
    MegaphoneOff,
    MoreHorizontal,
    Pencil,
    Search,
    User,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IHistory, IQuiz, IReport, ISO, IUser } from "@/types/type"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import handleCompareDate from "@/lib/CompareDate"
import { Badge } from "../ui/badge"
import { GoogleOutlined } from "@ant-design/icons"
import Link from "next/link"
import Image from "next/image"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { ColumnReport } from "./ColumnReport"

export function DataTableReport({ report }: { report: IReport[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [rowSelection, setRowSelection] = useState({})
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null)
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
    // const [newDataReport, setNewDataReport] = useState({resolved_content: "",is_violated:"", status: ""});

    const handleResolveReport = (report: any) => {
        setSelectedReport(report)
        setIsResolveModalOpen(true)
    }

    // const handleSaveResolution = () => {
    //     // Here you would typically call an API to update the report
    //
    //     setIsResolveModalOpen(false);
    //     setSelectedReport(null);
    //     setResolveStatus("");
    //     setResolveContent("");
    // };

    const table = useReactTable<IReport>({
        data: report,
        columns: ColumnReport(),
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
                        <Input
                            placeholder="Tìm kiếm tên người đăng..."
                            className="pl-10 w-full md:w-64 "
                            value={
                                (table
                                    .getColumn("displayName")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("displayName")
                                    ?.setFilterValue(event.target.value)
                            }
                        />
                    </div>
                    <div className="relative w-full ">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm tiêu đề..."
                            className="pl-10 w-full md:w-64 "
                            value={
                                (table
                                    .getColumn("title")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("title")
                                    ?.setFilterValue(event.target.value)
                            }
                        />
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
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
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
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={ColumnReport().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            {/* <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Giải quyết báo cáo</DialogTitle>
                        <DialogDescription>Cập nhật trạng thái và nội dung giải quyết cho báo cáo này</DialogDescription>
                    </DialogHeader>

                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Thông tin báo cáo</Label>
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={selectedReport.user_report.profilePicture || "/placeholder.svg"} alt={selectedReport.user_report.displayName} />
                                            <AvatarFallback className="text-xs">{selectedReport.user_report.displayName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{selectedReport.user_report.displayName}</span>
                                        <span className="text-xs text-muted-foreground">báo cáo</span>
                                    </div>
                                    <p className="text-sm">
                                        <strong>Nội dung:</strong> {selectedReport.content}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Loại:</strong> {selectedReport.type_of_violation}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Ngày tạo:</strong> {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái giải quyết</Label>
                                <Select value={selectedReport.status} onValueChange={(value) => {
                                    setSelectedReport((prev) => prev ? { ...prev, status: value } : null)}}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-yellow-600" />
                                                Đang chờ xử lý
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Đã giải quyết
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            <div className="flex items-center gap-2">
                                                <X className="w-4 h-4 text-red-600" />
                                                Từ chối
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Nội dung giải quyết</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Nhập nội dung giải quyết, lý do từ chối hoặc ghi chú..."
                                    value={selectedReport.resolved_content || ""}
                                    onChange={}
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsResolveModalOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSaveResolution} disabled={!resolveStatus}>
                                    Lưu giải quyết
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog> */}
        </div>
    )
}
