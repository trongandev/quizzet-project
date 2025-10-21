import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, BookUser, CheckCircle, Clock, LocateFixed, MegaphoneOff, MoreHorizontal, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IReport } from "@/types/type"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import handleCompareDate from "@/lib/CompareDate"
import { Badge } from "../ui/badge"
import Link from "next/link"

const getStatusBadge = (status: string) => {
    switch (status) {
        case "resolved":
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã giải quyết
                </Badge>
            )
        case "pending":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Đang chờ
                </Badge>
            )

        case "rejected":
            return (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Đã hủy
                </Badge>
            )
    }
}

const getTypeOfViolationBadge = (status: string) => {
    switch (status) {
        case "spam":
            return (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
                    <MegaphoneOff className="w-3 h-3 mr-1" />
                    Spam
                </Badge>
            )
        case "inappropriate":
            return (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">
                    <X className="w-3 h-3 mr-1" />
                    Không phù hợp
                </Badge>
            )
        case "other":
            return (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300">
                    <MoreHorizontal className="w-3 h-3 mr-1" />
                    Khác
                </Badge>
            )
        case "copyright":
            return (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                    <BookUser className="w-3 h-3 mr-1" />
                    Vi phạm bản quyền
                </Badge>
            )
        case "misinformation":
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    <LocateFixed className="w-3 h-3 mr-1" />
                    Thông tin sai lệch
                </Badge>
            )
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

export const ColumnReport = (): ColumnDef<IReport>[] => [
    {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
        cell: ({ row }) => <Checkbox className="mr-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "user_report",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Người gửi
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.user_report._id}`} className="capitalize flex items-center gap-2">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={row.original.user_report.profilePicture} alt="Profile Picture" className="object-cover" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                        {(row.original.user_report.displayName || "")
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || ""}
                    </AvatarFallback>
                </Avatar>
                <p className="text-white/80 font-medium w-[100px] line-clamp-1" title={row.original.user_report.displayName}>
                    {row.original.user_report.displayName}
                </p>
            </Link>
        ),
    },
    {
        accessorKey: "content",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nội dung
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <p className="text-white/80">{row.original.content}</p>,
    },
    {
        accessorKey: "type_of_violation",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Loại vi phạm
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{getTypeOfViolationBadge(row.original.type_of_violation)}</div>,
    },

    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng thái
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{getStatusBadge(row.original.status)}</div>,
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
        cell: ({ row }) => <div className="text-xs">{handleCompareDate(row.original.created_at)}</div>,
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
                            <Pencil /> Giải quyết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-700 dark:text-red-300">
                            <MegaphoneOff /> Đánh dấu là không vi phạm
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
