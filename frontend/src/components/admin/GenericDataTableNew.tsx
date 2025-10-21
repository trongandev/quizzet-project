"use client"

import * as React from "react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import { GenericModal } from "./GenericModal"

interface GenericDataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    searchKey?: string
    searchPlaceholder?: string
    enableColumnVisibility?: boolean
    modalType?: 'user' | 'quiz' | 'history' | 'flashcard' | 'subjectOutline'
}

export function GenericDataTable<TData>({ 
    data, 
    columns, 
    searchKey, 
    searchPlaceholder = "Tìm kiếm...", 
    enableColumnVisibility = true,
    modalType 
}: GenericDataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedItem, setSelectedItem] = React.useState<TData | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    // Create context for modal actions
    const modalContext = React.useMemo(() => ({
        openModal: (item: TData) => {
            setSelectedItem(item)
            setIsModalOpen(true)
        },
        closeModal: () => {
            setSelectedItem(null)
            setIsModalOpen(false)
        }
    }), [])

    // Enhanced columns with modal context
    const enhancedColumns = React.useMemo(() => {
        if (!modalType) return columns
        
        return columns.map(column => {
            if (column.id === 'actions') {
                return {
                    ...column,
                    cell: ({ row }: any) => {
                        const originalCell = column.cell as any
                        // Pass modal context to the cell
                        return originalCell({ row, modalContext })
                    }
                }
            }
            return column
        })
    }, [columns, modalType, modalContext])

    const table = useReactTable({
        data,
        columns: enhancedColumns,
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
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-5">
                    {searchKey && (
                        <Input 
                            placeholder={searchPlaceholder} 
                            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""} 
                            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)} 
                            className="max-w-sm" 
                        />
                    )}
                </div>

                {enableColumnVisibility && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột <ChevronDown className="ml-2 h-4 w-4" />
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
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} của {table.getFilteredRowModel().rows.length} hàng được chọn.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Trước
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Sau
                    </Button>
                </div>
            </div>

            {/* Modal */}
            {modalType && (
                <GenericModal
                    isOpen={isModalOpen}
                    onClose={modalContext.closeModal}
                    data={selectedItem}
                    type={modalType}
                />
            )}
        </div>
    )
}
