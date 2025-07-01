"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, BookUser, CalendarMinus2, ChevronDown, Edit, LocateFixed, Mail, MegaphoneOff, MoreHorizontal, Pencil, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IUser } from "@/types/type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import handleCompareDate from "@/lib/CompareDate";
import { Badge } from "../ui/badge";
import { GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";

export const columns: ColumnDef<IUser>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Thông tin người dùng
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <Link href={`/profile/${row.original._id}`} className="flex items-center gap-3">
                <Avatar className="w-14 h-14">
                    <AvatarImage src={row.original.profilePicture} alt="Profile Picture" className="object-cover" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                        {(row.original.displayName || "")
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || ""}
                    </AvatarFallback>
                </Avatar>
                <div className="">
                    <p className="text-white/80 font-medium w-[100px] line-clamp-1" title={row.original.displayName}>
                        {row.original.displayName}
                    </p>
                    <p className="text-xs text-white/60 flex items-center gap-1" title={String(row.original.created_at)}>
                        <CalendarMinus2 size={12} />
                        {handleCompareDate(row.original.created_at)}
                    </p>
                </div>
            </Link>
        ),
    },

    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    // {
    //     accessorKey: "amount",
    //     header: () => <div className="text-right">Amount</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue("amount"));

    //         // Format the amount as a dollar amount
    //         const formatted = new Intl.NumberFormat("en-US", {
    //             style: "currency",
    //             currency: "USD",
    //         }).format(amount);

    //         return <div className="text-right font-medium">{formatted}</div>;
    //     },
    // },

    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng thái
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge
                    variant="secondary"
                    className={`${
                        row.getValue("status") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                    {row.getValue("status") ? "Hoạt động" : "Cấm"}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "provider",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nguồn
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge
                    variant="secondary"
                    className={` ${
                        row.original.provider === "local" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                    {row.original.provider === "local" ? <LocateFixed size={15} /> : <GoogleOutlined size={15} />}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Quyền
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge
                    variant="secondary"
                    className={`${
                        row.getValue("role") === "user"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                    {row.getValue("role")}
                </Badge>
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;

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
            );
        },
    },
];

export function DataTableUsers({ user }: { user: IUser[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable<IUser>({
        data: user,
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
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-5">
                    <div className="relative w-full ">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm tên..."
                            className="pl-10 w-full md:w-64 "
                            value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("displayName")?.setFilterValue(event.target.value)}
                        />
                    </div>
                    <div className="relative w-full ">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm email..."
                            className="pl-10 w-full md:w-64 "
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
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
                                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
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
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
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
    );
}
