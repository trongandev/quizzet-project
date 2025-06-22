"use client";
import handleCompareDate from "@/lib/CompareDate";
import { IQuiz } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { FaRegEye, FaRegQuestionCircle } from "react-icons/fa";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Filter, Grid2X2, Grid3x3, Play, Plus, Search } from "lucide-react";
import { SiQuizlet } from "react-icons/si";
import { Tooltip } from "antd";
import { subjectOption } from "@/lib/subjectOption";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
export default function CTaiLieu({ toolData }: any) {
    const [toggleBtnSortNumber, setToggleBtnSortNumber] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
    const [viewMode, setViewMode] = useState(4); // "grid 4x2" or "grid3x2"
    const [data, setData] = useState(toolData);
    const [subject, setSubject] = useState("Tất cả");
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    // Calculate pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    const displaySO = currentItems;

    const handleSortByNumber = useCallback(
        (key: keyof IQuiz, direction = "asc") => {
            setToggleBtnSortNumber(!toggleBtnSortNumber);
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return Number(a[key]) - Number(b[key]);
                return Number(b[key]) - Number(a[key]);
            });
            setData(sortedData);
        },
        [data]
    );

    const handleSearch = (value: any) => {
        setSearchTerm(value);
        const search = toolData.filter((item: any) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
    };

    const handleSearchSubject = (value: string) => {
        console.log(value);
        if (value === "none") {
            setData(toolData);
            setCurrentPage(1);
            return;
        }
        setSubject(value);
        const search = toolData.filter((item: any) => item.subject == value);
        setData(search);
        setCurrentPage(1); // Reset to first page after filter
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px]">
                <div className="p-2 md:p-5 flex flex-col gap-5  bg-white/80 dark:bg-gray-800 border border-gray-400/50 dark:border-white/10 rounded-lg mb-4 shadow-sm">
                    <div className="flex items-center gap-3 ">
                        <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-gradient-to-r from-red-500/80 to-yellow-500/80 rounded-lg text-white">
                            <SiQuizlet size={21} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Đề cương</h1>
                            <p>Tổng hợp những đề cương của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.</p>
                        </div>
                    </div>
                    <div className="flex md:items-center gap-3 justify-between flex-col md:flex-row">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm tên câu hỏi mà bạn cần..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="w-[0.4px] h-10 bg-gray-500/50 hidden md:block"></div>
                        <div className="flex items-center gap-2 justify-between md:justify-start">
                            <div className="relative flex-1">
                                <Select value={subject} onValueChange={handleSearchSubject}>
                                    <SelectTrigger className="w-[140px] h-11 border-gray-200">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Chọn danh mục</SelectLabel>
                                            {subjectOption.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                                <Tooltip placement="top" title="Sắp xếp theo số lượt làm tăng dần">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === "asc" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSortOrder("asc");
                                            handleSortByNumber("noa", "asc");
                                        }}>
                                        <ArrowUpNarrowWide className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                                <Tooltip placement="top" title="Sắp xếp theo số lượt làm giảm dần">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === "desc" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSortOrder("desc");
                                            handleSortByNumber("noa", "desc");
                                        }}>
                                        <ArrowDownNarrowWide className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                                <Tooltip placement="top" title="Dạng lưới 4x2">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 4 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => setViewMode(4)}>
                                        <Grid3x3 className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                                <Tooltip placement="top" title="Dạng lưới 3x2">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 3 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => setViewMode(3)}>
                                        <Grid2X2 className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="w-[0.4px] h-10 bg-gray-500/50  hidden md:block"></div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/quiz/themcauhoi"
                                className="w-full md:w-auto border border-gray-500/50 dark:border-white/10 rounded-md flex items-center justify-center md:justify-start gap-2 h-11 px-3 text-gray-500">
                                <Plus className="h-4 w-4" />
                                Thêm đề cương
                            </Link>
                            <Tooltip placement="top" title="Nếu bạn có đề cương hoặc tài liệu, đừng ngần ngại hãy gửi cho tôi">
                                <Link
                                    href="mailto:trongandev@gmail.com"
                                    className="relative group overflow-hidden w-full md:w-auto flex items-center justify-center md:justify-start gap-4 bg-gradient-to-r from-blue-500 to-purple-500 px-4 h-11 rounded-md text-white">
                                    <Play className="h-4 w-4" />
                                    Gửi Mail
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                </Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${viewMode === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                        {displaySO?.map((item: any, index: any) => (
                            <div
                                className="bg-white dark:bg-slate-800/50 hover:shadow-md rounded-xl h-[200px] flex flex-col md:flex-row overflow-hidden shadow-sm border border-white/10 group hover:scale-105 transition-all duration-300"
                                key={index}>
                                <div className="relative flex-1">
                                    <Image
                                        unoptimized
                                        src={item.image}
                                        alt={item.title}
                                        className="object-cover absolute h-full hover:scale-105 transition-all duration-300"
                                        priority
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute z-1 bottom-0 bg-linear-item w-full text-white text-[10px] p-2 font-bold ">
                                        <p className="flex gap-1 items-center">
                                            <FaRegQuestionCircle />
                                            Số câu hỏi: {item.lenght}
                                        </p>
                                        <p className="flex gap-1 items-center">
                                            <FaRegEye />
                                            Lượt xem: {item.view}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-between flex-col h-full p-3">
                                    <div className="">
                                        <h1 className="font-bold line-clamp-2 h-[48px]">{item.title}</h1>
                                    </div>
                                    <div className="">
                                        <p className="text-[12px]">{handleCompareDate(item.date)}</p>
                                        <Link href={`/decuong/${item.slug}`}>
                                            <Button className="text-sm w-full !rounded-md">Xem ngay</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data && data.length === 0 ? <p className="text-primary">Không có đề cương nào...</p> : ""}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className={cn("gap-1 pl-2.5", buttonVariants({ variant: "ghost" }), currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                        <ChevronLeft className="h-4 w-4" />
                                        <span>Previous</span>
                                    </button>
                                </PaginationItem>

                                {getPageNumbers().map((page, index) => (
                                    <PaginationItem key={index}>
                                        {page === "..." ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <button
                                                onClick={() => handlePageChange(page as number)}
                                                className={cn(
                                                    buttonVariants({
                                                        variant: currentPage === page ? "outline" : "ghost",
                                                        size: "sm",
                                                    }),
                                                    "cursor-pointer"
                                                )}
                                                aria-current={currentPage === page ? "page" : undefined}>
                                                {page}
                                            </button>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className={cn("gap-1 pr-2.5", buttonVariants({ variant: "ghost" }), currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                        <span>Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}{" "}
                    {/* Pagination Info */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} quiz | Trang {currentPage} / {totalPages}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
