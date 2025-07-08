"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
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
import { ArrowUpDown, CalendarMinus2, ChevronDown, LocateFixed, Mail, MegaphoneOff, MoreHorizontal, Pencil } from "lucide-react";
import Cookies from "js-cookie";
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
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { POST_API } from "@/lib/fetchAPI";
import Loading from "../ui/loading";
export function DataTableUsers({ user }: { user: IUser[] }) {
    const [users, setUsers] = useState<IUser[]>(user || []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [loadingUpdated, setLoadingUpdated] = useState(false);
    const token = Cookies.get("token") || "";

    useEffect(() => {
        if (user && user.length > 0) {
            setUsers(user);
        }
    }, [user]);

    const handleEdit = useCallback((user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    }, []);

    const columns: ColumnDef<IUser>[] = useMemo(
        () => [
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
                            <p className="text-white/80 font-medium w-[150px] line-clamp-1" title={row.original.displayName}>
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
                    const data = row.original;

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
                                <DropdownMenuItem onClick={() => handleEdit(data)}>
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
        ],
        [handleEdit]
    );

    const table = useReactTable<IUser>({
        data: users,
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

    const handleEditSelectedUser = useCallback((key: any, value: any) => {
        setSelectedUser((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    const handleUpdateUser = useCallback(async () => {
        try {
            setLoadingUpdated(true);
            if (!selectedUser) return;
            const req = await POST_API("/profile", selectedUser, "PATCH", token);
            const res = await req?.json();
            if (res?.ok) {
                setUsers((prev) => prev.map((u) => (u._id === selectedUser._id ? selectedUser : u)));
                setIsModalOpen(false);
            } else {
                toast.error("Cập nhật người dùng thất bại!", {
                    duration: 10000,
                    description: res?.message,
                });
            }
        } catch (error: any) {
            toast.error("Cập nhật người dùng thất bại!", {
                duration: 10000,
                description: error?.message,
            });
        } finally {
            setLoadingUpdated(false);
        }
    }, [selectedUser, token]);
    if (!user || user.length === 0) {
        return (
            <div className="flex w-full items-center justify-center h-[80vh]">
                <Loading className="h-8 w-8" />
            </div>
        );
    }
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-5">
                    {/* <div className="relative w-full ">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm tên..."
                            className="pl-10 w-full md:w-64 "
                            value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("displayName")?.setFilterValue(event.target.value)}
                        />
                    </div> */}
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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                        <DialogDescription>Chỉnh sửa thông tin người dùng</DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={selectedUser.profilePicture} alt="Profile Picture" className="object-cover" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                                        {(selectedUser.displayName || "")
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || ""}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.displayName}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                                    <p className="font-mono text-sm bg-muted p-2 rounded">{selectedUser._id || `user_${selectedUser._id}`}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Tên hiển thị</Label>
                                    <Input placeholder="Nhập tên người dùng..." value={selectedUser.displayName} onChange={(e) => handleEditSelectedUser("displayName", e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                    <p className="text-sm">{selectedUser.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Xác thực</Label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedUser.verify ? "default" : "secondary"}>{selectedUser.verify ? "Đã xác thực" : "Chưa xác thực"}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground mr-2">Vai trò</Label>
                                    <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Vai trò" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Vai trò</SelectLabel>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="superadmin">SuperAdmin</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                                        <Switch checked={selectedUser.status} onCheckedChange={(value) => setSelectedUser({ ...selectedUser, status: value })} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="text-white" variant={selectedUser.status ? "default" : "secondary"}>
                                            {selectedUser.status ? "Hoạt động" : "Không hoạt động"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Ảnh đại diện</Label>
                                    <p className="text-sm text-muted-foreground">{selectedUser.displayName ? "Đã có ảnh đại diện" : "Chưa có ảnh đại diện"}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
                                    <p className="text-sm">{handleCompareDate(selectedUser.created_at)}</p>
                                </div>
                            </div>

                            <Separator />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleUpdateUser} disabled={loadingUpdated} className="text-white">
                                    {loadingUpdated ? <Loading /> : <Pencil className="mr-2" />}
                                    Cập nhật
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
