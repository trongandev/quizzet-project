import React, { useEffect, useState } from "react";
import { FaRegCreditCard } from "react-icons/fa";
import PublicFC from "./PublicFC";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export default function PublicFCHome({ publicFlashcards }: any) {
    const [data, setData] = useState(publicFlashcards);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const totalItems = data?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data?.slice(startIndex, endIndex);
    const displayFC = currentItems;

    useEffect(() => {
        if (window.innerWidth < 768) {
            setItemsPerPage(4); // Adjust items per page for mobile view
        } else {
            setItemsPerPage(8); // Default items per page for larger screens
        }
    }, [publicFlashcards]);

    // Handle page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
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
        <div className="mt-10 mb-5 dark:text-white  flex flex-col gap-5  bg-white/80 dark:bg-gray-800 border border-gray-400/50 dark:border-white/10 rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-3">
                <div className="w-1/6 h-14 md:w-14 flex items-center justify-center bg-gradient-to-r from-pink-500/80 to-yellow-500/80 rounded-lg text-white">
                    <FaRegCreditCard size={21} />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Flashcard</h1>
                    <p>Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 h-[340px] overflow-y-scroll">
                {displayFC && displayFC.map((item: any) => <PublicFC item={item} key={item?._id} />)}
                {publicFlashcards?.length <= 0 && <div className="h-[340px] col-span-12 flex items-center justify-center text-gray-700">Không có dữ liệu...</div>}
            </div>
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
                                        onClick={() => handlePageChange(page)}
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
                <div className="flex justify-center mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} Flashcard | Trang {currentPage} / {totalPages}
                    </p>
                </div>
            )}
        </div>
    );
}
