"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Globe, Lock } from "lucide-react"
import { POST_API } from "@/lib/fetchAPI"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { languages } from "@/lib/languageOption"
interface CreateFlashcardModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
    listFlashCard: any
    setListFlashCard: React.Dispatch<React.SetStateAction<any[]>>
    filterFlashcard: any
    setFilterFlashcard: React.Dispatch<React.SetStateAction<any>>
    setTabFlashcard: any
}

export function CreateFlashcardModal({ children, open, setOpen, listFlashCard, setListFlashCard, filterFlashcard, setFilterFlashcard, setTabFlashcard }: CreateFlashcardModalProps) {
    const [loading, setLoading] = useState(false)
    const token = Cookies.get("token") || ""
    const [formData, setFormData] = useState({
        title: "",
        language: "english",
        desc: "",
        public: false, // Already boolean
    })
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)

            const req = await POST_API("/list-flashcards", { ...formData }, "POST", token)
            if (req) {
                const res = await req.json()
                if (req.ok) {
                    toast.success("Tạo thành công flashcard")
                    setOpen(false)
                    setListFlashCard([res?.listFlashCard, ...listFlashCard])
                    setFilterFlashcard([res?.listFlashCard, ...filterFlashcard])
                    setTabFlashcard("my-sets")
                    setFormData({
                        title: "",
                        language: "",
                        desc: "",
                        public: false,
                    })
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau", { description: error instanceof Error ? error.message : "Lỗi không xác định" })
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handlePublicChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            public: value === "true",
        }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-slate-800/50 rounded-lg">
                            <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        Tạo bộ flashcard mới
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4 h-[450px] md:h-[500px] overflow-scroll">
                    {/* Tên list từ */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Tên bộ flashcard <span className="text-red-500">*</span>
                        </Label>
                        <Input id="title" placeholder="Ví dụ: Từ vựng TOEIC cơ bản" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full" required />
                        <p className="text-xs text-gray-500 dark:text-white/50">Đặt tên mô tả rõ ràng để dễ tìm kiếm sau này</p>
                    </div>

                    {/* Ngôn ngữ */}
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Ngôn ngữ <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.language} defaultValue="english" onValueChange={(value) => handleInputChange("language", value)} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn ngôn ngữ chính của bộ flashcard" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        <div className="flex items-center gap-2">
                                            <span>{lang.label}</span>
                                            <span className="text-gray-500 dark:text-white/50">({lang.name})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="desc" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Mô tả
                        </Label>
                        <Textarea id="desc" placeholder="Mô tả ngắn gọn về nội dung bộ flashcard này..." value={formData.desc} onChange={(e) => handleInputChange("desc", e.target.value)} className="w-full min-h-[80px] resize-none" maxLength={200} />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 dark:text-white/50">Mô tả giúp người khác hiểu rõ hơn về nội dung</p>
                            <span className="text-xs text-gray-400">{formData.desc.length}/200</span>
                        </div>
                    </div>

                    {/* Quyền riêng tư */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-white/80">Quyền truy cập</Label>
                        <RadioGroup value={formData.public.toString()} onValueChange={handlePublicChange} className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50  dark:hover:bg-white/10 cursor-pointer  transition-colors">
                                <RadioGroupItem value="true" id="public" className="mt-1" />
                                <Label htmlFor="public" className="flex-1 block">
                                    <div className="flex items-center gap-2 font-medium cursor-pointer">
                                        <Globe className="w-4 h-4 text-green-600" />
                                        Công khai
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-white/70 mt-1 cursor-pointer">Mọi người có thể tìm thấy và sử dụng bộ flashcard này</p>
                                </Label>
                            </div>

                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50  dark:hover:bg-white/10 cursor-pointer  transition-colors">
                                <RadioGroupItem value="false" id="private" className="mt-1" />
                                <Label htmlFor="private" className="flex-1 block">
                                    <div className="flex items-center gap-2 font-medium cursor-pointer">
                                        <Lock className="w-4 h-4 text-orange-600" />
                                        Riêng tư
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-white/70 mt-1 cursor-pointer">Chỉ bạn có thể xem và sử dụng bộ flashcard này</p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                        Hủy
                    </Button>{" "}
                    <Button type="submit" onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 dark:text-white" disabled={!formData.title || !formData.language || loading}>
                        {loading ? "Đang tạo..." : "Tạo flashcard"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
