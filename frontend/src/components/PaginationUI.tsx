import React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PaginationUI({ totalPages, itemsPerPage, currentPage, setCurrentPage, startIndex, endIndex, totalItems }: any) {
    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = itemsPerPage ? 3 : 5 // Ít hơn trên mobile

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (itemsPerPage) {
                // ✅ Logic đơn giản hơn cho mobile
                if (currentPage === 1) {
                    pages.push(1, 2, "...", totalPages)
                } else if (currentPage === totalPages) {
                    pages.push(1, "...", totalPages - 1, totalPages)
                } else {
                    pages.push(1, "...", currentPage, "...", totalPages)
                }
            } else {
                // Logic cũ cho desktop
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i)
                    }
                    pages.push("...")
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push("...")
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push("...")
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push("...")
                    pages.push(totalPages)
                }
            }
        }

        return pages
    }
    return (
        <>
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className={cn(
                                    "gap-1 pl-2.5",
                                    buttonVariants({
                                        variant: "ghost",
                                    }),
                                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                                )}
                            >
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
                                        aria-current={currentPage === page ? "page" : undefined}
                                    >
                                        {page}
                                    </button>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={cn(
                                    "gap-1 pr-2.5",
                                    buttonVariants({
                                        variant: "ghost",
                                    }),
                                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                                )}
                            >
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
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} | Trang {currentPage} / {totalPages}
                    </p>
                </div>
            )}
        </>
    )
}
