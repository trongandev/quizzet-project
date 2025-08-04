"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { X, Save, Search, ClipboardPaste } from "lucide-react"
import Image from "next/image"
import Loading from "@/components/ui/loading"
import { CreateFormProps } from "./GenericAdminPage"

export function SubjectOutlineCreateForm({ onSubmit, onCancel, loading }: CreateFormProps) {
    const defaultValue = {
        title: "",
        content: "",
        image: "",
        type: "txt",
        quest: "",
    }

    const [data, setData] = useState(defaultValue)

    const handleSubmit = async () => {
        await onSubmit(data)
        setData(defaultValue)
    }

    const handlePaste = (type: string) => {
        if (type === "content") {
            navigator.clipboard.readText().then((text) => {
                setData({ ...data, content: text })
            })
        } else if (type === "image") {
            navigator.clipboard.readText().then((text) => {
                setData({ ...data, image: text })
            })
        }
    }

    const handleGetImageInGoogle = () => {
        const searchQuery = data.title || "Đề cương học tập"
        const url = `https://www.google.com/search?hl=vi&q=${encodeURIComponent(searchQuery)}&tbm=isch`
        window.open(url, "_blank")
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Tạo đề cương mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="flex gap-2 items-center">
                    <Input placeholder="Nhập tiêu đề" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                    <Button variant="outline" onClick={handleGetImageInGoogle}>
                        <Search />
                    </Button>
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => handlePaste("content")}>
                        <ClipboardPaste />
                    </Button>
                    <Input placeholder="Nhập nội dung (mô tả)" value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} />
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => handlePaste("image")}>
                        <ClipboardPaste />
                    </Button>
                    <Input placeholder="Nhập link hình ảnh" value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} />
                </div>
                {data.image && (
                    <div className="flex items-center gap-2 relative w-full h-48">
                        <Image src={data.image} alt="Preview" fill className="object-cover rounded-md" />
                        <Button variant="outline" className="text-red-500 absolute top-1 right-1" onClick={() => setData({ ...data, image: "" })}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <Textarea
                    className="h-48"
                    placeholder="Paste JSON vào đây"
                    value={data.quest}
                    onChange={(e) => {
                        try {
                            setData({ ...data, quest: JSON.parse(e.target.value) })
                        } catch {
                            setData({ ...data, quest: e.target.value })
                        }
                    }}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    <X className="mr-2" />
                    Hủy
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="text-white">
                    {loading ? <Loading /> : <Save />}
                    Lưu đề cương
                </Button>
            </DialogFooter>
        </>
    )
}

export function DailyTaskCreateForm({ onSubmit, onCancel, loading }: CreateFormProps) {
    const defaultValue = {
        taskId: "",
        name: "",
        description: "",
        icon: "",
        xpPerAction: 0, //XP thưởng cho mỗi lần hoàn thành
        dailyLimitCount: 1, //Số lần tối đa có thể hoàn thành trong ngày
        unlockLevel: 1, //Cấp độ mở khóa nhiệm vụ
    }

    const [data, setData] = useState(defaultValue)

    const handleSubmit = async () => {
        await onSubmit(data)
        setData(defaultValue)
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Tạo nhiệm vụ mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="flex gap-5">
                    <div className="flex-1">
                        <label className="block text-sm mb-1">Task ID</label>
                        <Input placeholder="Task ID" value={data.taskId} onChange={(e) => setData({ ...data, taskId: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm mb-1">Tên nhiệm vụ</label>
                        <Input placeholder="Tên nhiệm vụ" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm mb-1">Mô tả</label>
                    <Input placeholder="Mô tả" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Icon</label>
                    <Input placeholder="Icon" value={data.icon} onChange={(e) => setData({ ...data, icon: e.target.value })} />
                </div>
                <div className="flex gap-5">
                    <div>
                        <label className="block text-sm mb-1">XP thưởng mỗi lần hoàn thành</label>
                        <Input type="number" placeholder="XP thưởng mỗi lần hoàn thành" value={data.xpPerAction} onChange={(e) => setData({ ...data, xpPerAction: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Số lần tối đa trong ngày</label>
                        <Input type="number" placeholder="Số lần tối đa trong ngày" value={data.dailyLimitCount} onChange={(e) => setData({ ...data, dailyLimitCount: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Cấp độ mở khóa</label>
                        <Input type="number" placeholder="Cấp độ mở khóa" value={data.unlockLevel} onChange={(e) => setData({ ...data, unlockLevel: parseInt(e.target.value) })} />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    <X className="mr-2" />
                    Hủy
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="text-white">
                    {loading ? <Loading /> : <Save />}
                    Lưu nhiệm vụ
                </Button>
            </DialogFooter>
        </>
    )
}
