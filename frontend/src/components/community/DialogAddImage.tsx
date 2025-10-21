import React, { useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LinkIcon, Save, Upload, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
    image: string;
    setImage: (value: string) => void;
    children: React.ReactNode;
}

export default function DialogAddImage({ image, setImage, children }: Props) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarInputType, setAvatarInputType] = useState<"file" | "url">("file");

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Please select a PNG, JPG, or GIF file.");
            return;
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert("Kích thước tập tin phải nhỏ hơn 3MB.");
            return;
        }

        setSelectedFile(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            setImage(""); // Clear the image state
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const handleChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const value = e.target.value.trim();

            setImage(value);

            if (!value) {
                return;
            }

            // Validate URL format
            if (!value.startsWith("http://") && !value.startsWith("https://")) {
                toast.error("Đường dẫn phải bắt đầu bằng http hoặc https", {
                    duration: 3000,
                    position: "top-center",
                });
                return;
            }

            const img = new window.Image();
            img.onload = () => {
                setImage(value);
            };
            img.onerror = () => {
                toast.error("Đường dẫn hình ảnh không hợp lệ. Vui lòng kiểm tra lại URL.", {
                    duration: 3000,
                    position: "top-center",
                });
                setImage("");
            };
            img.src = value;
        } catch (error) {
            console.error("Error handling link change:", error);
            toast.error("Đã xảy ra lỗi khi xử lý đường dẫn hình ảnh.", {
                description: error instanceof Error ? error.message : "Unknown error",
                duration: 3000,
                position: "top-center",
            });
            return;
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chọn hình ảnh</DialogTitle>
                    <DialogDescription>Bạn có thể upload file hoặc dán đường link liên kết ảnh</DialogDescription>
                </DialogHeader>
                <div className="h-[350px]">
                    <Tabs value={avatarInputType} onValueChange={(value) => setAvatarInputType(value as "file" | "url")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file">
                                <Upload className="w-4 h-4 mr-2" />
                                Tải lên
                            </TabsTrigger>
                            <TabsTrigger value="url">
                                <LinkIcon className="w-4 h-4 mr-2" />
                                URL
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="space-y-2">
                            <div
                                className={`cursor-pointer hover:border-primary/50 hover:bg-primary/5 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={handleButtonClick}
                                onDrop={handleDrop}>
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="p-3 bg-muted rounded-full">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Tải lên tệp hoặc kéo và thả</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF tới 3MB</p>
                                    </div>
                                </div>
                            </div>

                            {selectedFile && (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate max-w-[365px]">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif" onChange={handleFileChange} className="hidden" />
                            <Button onClick={handleButtonClick} className="text-white w-full h-12  bg-gradient-to-r from-blue-500 to-cyan-500" variant="default">
                                <Upload className="h-4 w-4 mr-2" />
                                {selectedFile ? "Change File" : "Upload"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="url" className="space-y-5">
                            <Input placeholder="Nhập URL hình ảnh" value={image.startsWith("http") ? image : ""} onChange={(e) => handleChangeLink(e)} />
                            <div className={`${image === "" ? "h-0" : "h-52"}  w-full relative`}>
                                {image ? (
                                    <Image src={image} fill alt="" className="absolute w-full h-full rounded-md object-contain "></Image>
                                ) : (
                                    <p className="text-muted-foreground text-center mt-20">Không có hình ảnh nào được chọn</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                    {/* <div className={`${!image === "" ? "h-52" : "h-0"}  w-full relative`}>
                        <Image src={image} fill alt="" className="absolute w-full h-full rounded-md object-cover"></Image>
                    </div> */}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button" size="lg">
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button size="lg" className="text-white" disabled={loading}>
                        {loading ? <Loading /> : <Save className="mr-2 h-4 w-4" />}
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
