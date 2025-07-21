import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpDown, MoreHorizontal, FileText, User, CalendarMinus2, LocateFixed } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { IQuiz, IHistory, ISO, IListFlashcard, IUser } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import { GoogleOutlined } from "@ant-design/icons"

// Common select column
const selectColumn = {
    id: "select",
    header: ({ table }: any) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }: any) => <Checkbox className="mr-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
}

// Common actions column
const actionsColumn = {
    id: "actions",
    enableHiding: false,
    cell: ({ row, modalContext }: any) => {
        const item = row.original
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item._id)}>Copy ID</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {modalContext && <DropdownMenuItem onClick={() => modalContext.openModal(item)}>Xem chi tiết</DropdownMenuItem>}
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
}

// Status badge helpers
const getStatusBadge = (status: boolean) => {
    if (status === true) {
        return <Badge className="bg-green-600 text-white">Đã duyệt</Badge>
    } else if (status === false) {
        return <Badge className="bg-yellow-600 text-white">Chờ duyệt</Badge>
    }
    return <Badge className="bg-gray-600 text-white">Không xác định</Badge>
}

const getPublicBadge = (isPublic: boolean) => {
    return isPublic ? <Badge className="bg-green-600 text-white">Công khai</Badge> : <Badge className="bg-gray-600 text-white">Riêng tư</Badge>
}

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

const getFileTypeColor = (type: string) => {
    switch (type) {
        case "pdf":
            return "bg-red-500"
        case "docx":
            return "bg-blue-500"
        case "xlsx":
            return "bg-green-500"
        default:
            return "bg-gray-500"
    }
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Quiz columns
export const quizColumns: ColumnDef<IQuiz>[] = [
    selectColumn,
    {
        accessorKey: "displayName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Người dùng
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.uid._id}`} className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={row.original.uid.profilePicture} alt="Profile" className="object-cover" />
                </Avatar>
                <p className="text-white/80 font-medium w-[150px] line-clamp-1">{row.original.uid.displayName}</p>
            </Link>
        ),
    },
    {
        accessorKey: "img",
        header: "Hình ảnh",
        cell: ({ row }) => (
            <div className="relative h-16 w-32 overflow-hidden">
                <Image src={row.original.img || "/meme.jpg"} alt="" fill className="absolute w-full h-full object-cover rounded-md" />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tiêu đề
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/quiz/${row.original._id}`} target="_blank" className="text-white/80">
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => <p className="text-xs text-white/60 max-w-[200px] line-clamp-2">{row.original.content}</p>,
    },
    {
        accessorKey: "subject",
        header: "Môn học",
        cell: ({ row }) => (
            <Badge variant="secondary" className="uppercase text-xs">
                {row.original.subject}
            </Badge>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Ngày tạo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-xs">{handleCompareDate(row.original.date)}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => getStatusBadge(row.original.status),
    },
    actionsColumn,
]

// History columns
export const historyColumns: ColumnDef<IHistory>[] = [
    selectColumn,
    {
        accessorKey: "displayName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Người dùng
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.user_id._id}`} className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={row.original.user_id.profilePicture} alt="Profile" className="object-cover" />
                </Avatar>
                <p className="text-white/80 font-medium w-[150px] line-clamp-1">{row.original.user_id.displayName}</p>
            </Link>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tiêu đề quiz
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <p className="text-white/80">{row.original.quiz_id.title}</p>,
    },
    {
        accessorKey: "subject",
        header: "Môn học",
        cell: ({ row }) => <p className="text-xs text-white/60">{row.original.quiz_id.subject}</p>,
    },
    {
        accessorKey: "score",
        header: "Điểm số",
        cell: ({ row }) => (
            <Badge variant="secondary" className="uppercase text-xs font-thin">
                {row.original.score}/{row.original.total_questions || "20"}
            </Badge>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Ngày làm
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-xs">{handleCompareDate(row.original.date)}</div>,
    },
    actionsColumn,
]

// Subject Outline columns
export const subjectOutlineColumns: ColumnDef<ISO>[] = [
    selectColumn,
    {
        accessorKey: "image",
        header: "Hình ảnh",
        cell: ({ row }) => (
            <div className="relative h-16 w-32 overflow-hidden">
                <Image src={row.original.image || "/meme.jpg"} alt="" fill className="absolute w-full h-full object-cover rounded-md" />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tiêu đề
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/decuong/${row.original.slug}`} target="_blank" className="text-white/80">
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Loại
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge className={`${getFileTypeColor(row.original.type)} text-white text-xs px-2 py-1`}>
                <FileText className="w-4 h-4 text-white mr-1" />
                {row.original.type.toUpperCase()}
            </Badge>
        ),
    },
    {
        accessorKey: "length",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Kích thước
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className="text-xs font-thin">
                {row.original.type === "txt" ? row.original.lenght + " câu" : formatFileSize(row.original.lenght)}
            </Badge>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Ngày tạo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-xs">{handleCompareDate(row.original.date)}</div>,
    },
    actionsColumn,
]

// Flashcard columns
export const flashcardColumns: ColumnDef<IListFlashcard>[] = [
    selectColumn,
    {
        accessorKey: "displayName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Người dùng
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.userId._id}`} className="flex items-center gap-1">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={row.original.userId.profilePicture} alt="Profile" className="object-cover" />
                </Avatar>
                <p className="text-white/80 font-medium w-[150px] line-clamp-1">{row.original.userId.displayName}</p>
            </Link>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tiêu đề
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/flashcard/${row.original._id}`} className="w-[200px] block" target="_blank">
                {row.getValue("title")}
            </Link>
        ),
    },
    {
        accessorKey: "desc",
        header: "Mô tả",
        cell: ({ row }) => <div className="text-xs dark:text-white/60 max-w-[200px] line-clamp-2">{row.getValue("desc") || "Không có"}</div>,
    },
    {
        accessorKey: "language",
        header: "Ngôn ngữ",
        cell: ({ row }) => <Badge variant="secondary">{getLanguageFlag(row.original.language) + " " + getLanguageName(row.original.language)}</Badge>,
    },
    {
        accessorKey: "public",
        header: "Chế độ",
        cell: ({ row }) => getPublicBadge(row.original.public),
    },
    {
        accessorKey: "flashcards",
        header: "Số lượng thẻ",
        cell: ({ row }) => <Badge variant="outline">{row.original.flashcards?.length || 0} thẻ</Badge>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Ngày tạo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-xs dark:text-white/60">{handleCompareDate(row.original.created_at)}</div>,
    },
    actionsColumn,
]

// User columns
export const userColumns: ColumnDef<IUser>[] = [
    selectColumn,
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Người dùng
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/profile/${row.original._id}`} className="hover:underline">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.profilePicture} alt={row.original.displayName} className="object-cover" />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{row.original.displayName}</div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <CalendarMinus2 size={12} />
                            {handleCompareDate(row.original.created_at)}
                        </p>
                    </div>
                </div>
            </Link>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Trạng thái
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className={`${row.getValue("status") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                {row.getValue("status") ? "Hoạt động" : "Cấm"}
            </Badge>
        ),
    },
    {
        accessorKey: "provider",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nguồn
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className={`${row.original.provider === "local" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                {row.original.provider === "local" ? <LocateFixed size={15} /> : <GoogleOutlined className="w-4 h-4" />}
            </Badge>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Quyền
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className={`${row.original.role === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"}`}>
                {row.original.role.toUpperCase()}
            </Badge>
        ),
    },
    actionsColumn,
]

// Report columns
export const reportColumns: ColumnDef<any>[] = [
    selectColumn,
    {
        accessorKey: "content",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nội dung
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("content")}</div>,
    },
    {
        accessorKey: "type_of_violation",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Loại vi phạm
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <Badge variant="secondary">{row.getValue("type_of_violation")}</Badge>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Trạng thái
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => getStatusBadge(row.getValue("status") === "resolved"),
    },
    {
        accessorKey: "is_violated",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Vi phạm
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => getStatusBadge(row.getValue("is_violated")),
    },
    {
        accessorKey: "user_report.displayName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Người báo cáo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user_report
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture} alt={user?.displayName} className="object-cover" />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.displayName || "N/A"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Ngày tạo
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <CalendarMinus2 className="h-4 w-4 text-muted-foreground" />
                <span>{handleCompareDate(row.getValue("created_at"))}</span>
            </div>
        ),
    },
    actionsColumn,
]
