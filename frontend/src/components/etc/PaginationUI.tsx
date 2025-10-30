import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import type { IPagination } from '@/types/etc'
import { Button } from '../ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

type PaginationUIProps = {
    currentPage: number
    pagination: IPagination
    onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number) {
    const pages = []
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, '...', total)
        } else if (current >= total - 2) {
            pages.push(1, '...', total - 3, total - 2, total - 1, total)
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total)
        }
    }
    return pages
}

export default function PaginationUI({ currentPage, pagination, onPageChange }: PaginationUIProps) {
    const { totalPages, hasNextPage, hasPrevPage } = pagination
    const pages = getPageNumbers(currentPage, totalPages)

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button variant={'outline'} size={'sm'} disabled={!hasPrevPage} onClick={() => onPageChange(currentPage - 1)}>
                        <ChevronLeftIcon />
                        <span className="hidden sm:block">Quay về</span>
                    </Button>
                </PaginationItem>
                {pages.map((page, idx) =>
                    page === '...' ? (
                        <PaginationItem key={idx}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (page !== currentPage) onPageChange(Number(page))
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    <Button variant={'outline'} size={'sm'} disabled={!hasNextPage} onClick={() => onPageChange(currentPage + 1)}>
                        <span className="hidden sm:block">Tiến tới</span>
                        <ChevronRightIcon className="" />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
