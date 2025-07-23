import handleCompareDate from "@/lib/CompareDate"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Badge } from "../ui/badge"
import { Dot, Play, Settings, Trash2 } from "lucide-react"
import { IListFlashcard } from "@/types/type"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
export default function UserFC({ item }: { item: IListFlashcard }) {
    const statusCounts = {
        reviewing: 0, // từ mới và chưa ôn tập lần nào
        remembered: 0, // đã ôn tập
        learned: 0, // đã nhớ đã học thuộc
    }
    item.flashcards.forEach((card) => {
        if (card.status in statusCounts) {
            statusCounts[card.status as keyof typeof statusCounts] = (statusCounts[card.status as keyof typeof statusCounts] || 0) + 1
        }
    })

    const percent = Math.round(((statusCounts.learned + statusCounts.remembered) / item.flashcards.length) * 100)
    return (
        <Link href={`/flashcard/${item?._id}`} className="relative group overflow-hidden w-full  bg-white/80  dark:bg-slate-800/50 border border-white/10 rounded-md shadow-sm px-5 py-3 hover:shadow-md transition-all duration-300  items-start space-y-3">
            <div className="flex items-start justify-between mt-0">
                <div className="flex-1">
                    <h1 className=" font-bold line-clamp-1 text-gray-900 dark:text-white/80 text-xl duration-300" title={item.title}>
                        {item.title}
                    </h1>

                    <p className="text-md line-clamp-1 text-gray-600 dark:text-white/60" title={item.desc}>
                        {item.desc || "Không có mô tả"}
                    </p>
                    <div className="flex items-center gap-1 text-md text-gray-600 dark:text-white/60">
                        <p className=" line-clamp-1 " title={item.flashcards?.length.toString()}>
                            {item.flashcards?.length || 0} từ vựng
                        </p>

                        {item?.last_practice_date && (
                            <>
                                <Dot />
                                <p className="line-clamp-1">Lần học cuối: {handleCompareDate(item?.last_practice_date) || "Không có mô tả"}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Image src={`/flag/${item.language}.svg` || "/flag/english.svg`"} alt="" width={25} height={25} className="rounded-sm brightness-90 group-hover:brightness-100 duration-300"></Image>
                </div>
            </div>
            <div className="flex items-start text-sm dark:text-white/60">
                <div className="flex-1 flex flex-col item-center text-center text-orange-600 dark:text-orange-400">
                    <p className="text-2xl font-semibold">{statusCounts.reviewing}</p>
                    <p className="">Từ mới</p>
                </div>
                <div className="flex-1 flex flex-col item-center text-center text-purple-600 dark:text-purple-400">
                    <p className="text-2xl font-semibold">{statusCounts.remembered}</p>
                    <p className="">Đang học</p>
                </div>
                <div className="flex-1 flex flex-col item-center text-center text-green-600 dark:text-green-400">
                    <p className="text-2xl font-semibold">{statusCounts.learned}</p>
                    <p className="">Đã nhớ</p>
                </div>
            </div>
            <div className="">
                <div className="flex justify-between items-center mb-[4px]">
                    <p>Tiến trình học</p>
                    <p>{percent || 0}%</p>
                </div>
                <Progress value={percent}></Progress>
            </div>
            <div className="flex gap-2">
                <Link href={`/flashcard/practice-science/${item?._id}`} className="block w-full ">
                    <Button variant="outline" className="w-full">
                        {item.flashcards?.length > 0 ? (
                            <>
                                <Play />
                                Học ngay ({statusCounts.reviewing} từ vựng)
                            </>
                        ) : (
                            "Chưa có từ vựng"
                        )}
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" className="">
                            <Settings />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Các tính năng</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>Không học bộ này nữa</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash2 /> Xóa bộ thẻ này
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Link>
    )
}
