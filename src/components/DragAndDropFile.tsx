"use client"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import React, { useRef, useState } from "react"

interface Props {
    selectedFile: File | null
    setSelectedFile: (file: File | null) => void
}

export default function DragAndDropFile({
    selectedFile,
    setSelectedFile,
}: Props) {
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
        ]
        if (!allowedTypes.includes(file.type)) {
            alert("Please select a PNG, JPG, or GIF file.")
            return
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024 // 10MB in bytes
        if (file.size > maxSize) {
            alert("Kích thước tập tin phải nhỏ hơn 3MB.")
            return
        }

        setSelectedFile(file)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
            const reader = new FileReader()
            reader.onload = () => {
                setIsDragOver(false) // Reset drag over state
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragOver(false)

        const file = event.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return (
            Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
            " " +
            sizes[i]
        )
    }
    return (
        <div className="">
            <div
                autoFocus
                className={`cursor-pointer hover:border-primary/50 hover:bg-primary/5 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleButtonClick}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Tải lên hình - kéo vào hoặc bỏ qua
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF tới 3MB
                        </p>
                    </div>
                </div>
            </div>

            {selectedFile && (
                <div className="mt-3 flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 relative h-20 w-36">
                            <Image
                                src={URL.createObjectURL(selectedFile)}
                                alt="Selected file preview"
                                fill
                                className="rounded-md object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate max-w-[255px]">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    )
}
