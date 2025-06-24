"use client";
import handleCompareDate from "@/lib/CompareDate";
import { IQuiz } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Grid2X2, Grid3x3, Play, Plus, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { SiQuizlet } from "react-icons/si";
import { Tooltip } from "antd";
import { subjectOption } from "@/lib/subjectOption";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
export default function CQuiz({ quizData }: { quizData: IQuiz[] }) {
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState(4); // "grid 4x2" or "grid3x2"
    const [data, setData] = useState(quizData);
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

    const displayQuizs = currentItems;

    const handleSortByNumber = useCallback(
        (key: keyof IQuiz, direction = "asc") => {
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return Number(a[key]) - Number(b[key]);
                return Number(b[key]) - Number(a[key]);
            });
            setData(sortedData);
            setCurrentPage(1); // Reset to first page after sorting
        },
        [data]
    );
    const handleSearch = (value: any) => {
        setSearchTerm(value);
        const search = quizData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
        setCurrentPage(1); // Reset to first page after search
    };

    const handleSearchSubject = (value: string) => {
        if (value === "none") {
            setData(quizData);
            setCurrentPage(1);
            return;
        }
        setSubject(value);
        const search = quizData.filter((item) => item.subject == value);
        setData(search);
        setCurrentPage(1); // Reset to first page after filter
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // if (quizRef.current) {
        //     quizRef.current.scrollIntoView({ behavior: "smooth" });
        // }
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
                <div className="p-5 flex flex-col gap-5  bg-white/80 dark:bg-gray-800 border border-gray-400/50 dark:border-white/10 rounded-lg mb-4 shadow-sm">
                    <div className="flex items-center gap-3 ">
                        <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                            <SiQuizlet size={21} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Quiz</h1>
                            <p>Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                        </div>
                    </div>
                    <div className="flex md:items-center gap-3 justify-between flex-col md:flex-row">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Tìm tên câu hỏi mà bạn cần..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-10 h-11" />
                        </div>
                        <div className="w-[0.4px] h-10 bg-gray-500/50 hidden md:block"></div>
                        <div className="flex items-center gap-2 justify-between md:justify-start">
                            <div className="relative flex-1">
                                <Select value={subject} defaultValue="all" onValueChange={handleSearchSubject}>
                                    <SelectTrigger className="w-[140px] h-11">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tìm thể loại quiz</SelectLabel>
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
                            <div className="hidden md:flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
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
                            <Link href="/quiz/nganhang" className="">
                                <Button className="h-11" variant="secondary" disabled>
                                    <Play className="h-4 w-4" />
                                    Thi thử
                                </Button>
                            </Link>
                            <Link href="/quiz/themcauhoi" className="">
                                <Button className="h-11 relative group overflow-hidden  bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                    <Plus className="h-4 w-4" />
                                    Thêm câu hỏi
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${viewMode === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} h-[816px] overflow-y-scroll`}>
                        {displayQuizs?.map((item) => (
                            <div key={item._id} className="group hover:shadow-md hover:scale-105 transition-all duration-300  rounded-xl border border-white/10 shadow-md h-[400px]">
                                <div className="overflow-hidden relative h-full rounded-[8px]">
                                    <Link className="block" href={`/quiz/detail/${item.slug}`}>
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            className="absolute h-full w-full object-cover group-hover:scale-105 duration-300  brightness-90"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                    </Link>
                                    <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                        <h1 className="text-lg font-bold">{item.title}</h1>
                                        <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                                        <div className="flex justify-end items-center gap-1 mb-[1px] text-[10px]">
                                            <FaRegEye />
                                            <p className="">Lượt làm: {item.noa}</p>
                                        </div>
                                        <div className="flex justify-between items-center gap-1">
                                            <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                                                <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                    <Image
                                                        unoptimized
                                                        src={item.uid.profilePicture}
                                                        alt={item.uid.displayName}
                                                        className="absolute object-cover h-full"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        priority
                                                    />
                                                </div>
                                                <div className="group">
                                                    <div className="flex items-center gap-1">
                                                        <h2 className="text-sm line-clamp-1 overflow-hidden">{item.uid.displayName}</h2>
                                                        {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                    </div>
                                                    <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                        <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                                    </p>
                                                </div>
                                            </Link>

                                            <Link href={`/quiz/${item.slug}`} className="">
                                                <Button className="text-white">
                                                    Làm bài <IoArrowForwardCircleOutline />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Empty state */}
                        {data && data.length === 0 ? <p className="text-primary col-span-full text-center py-8">Không có quiz nào...</p> : ""}
                    </div>{" "}
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
