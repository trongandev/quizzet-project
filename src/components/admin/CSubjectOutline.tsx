"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, X, Save, Search, ClipboardPaste } from "lucide-react"
import { ISO } from "@/types/type"
import { DataTableSubjectOutline } from "./DataTableSubjectOutline"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Cookies from "js-cookie"
import { POST_API } from "@/lib/fetchAPI"
import { toast } from "sonner"
import Loading from "@/components/ui/loading"
import { Input } from "@/components/ui/input"
import Image from "next/image"
export default function CSubjectOutline({ subject_outline }: { subject_outline: ISO[] }) {
    const [SO, setSO] = useState<ISO[]>(subject_outline)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const defaultValue = {
        title: "",
        content: "",
        image: "",
        type: "txt",
        quest: "",
    }
    const [data, setData] = useState(defaultValue)
    const token = Cookies.get("token") || ""
    const handleSendSOJSON = async () => {
        try {
            setLoading(true)
            const req = await POST_API("/so", data, "POST", token)
            const res = await req?.json()
            if (res?.ok) {
                setOpen(false)
                setLoading(false)
                setSO((prev) => [...prev, res.data])
                toast.success("Đề cương đã được gửi thành công!", {
                    description: "Bạn có thể kiểm tra trong danh sách đề cương.",
                })
            } else {
                toast.error("Lỗi khi gửi đề cương: ", {
                    description: res?.message || "Vui lòng thử lại sau.",
                })
            }
        } catch (error: any) {
            console.error("Error sending SO JSON:", error.message)
            toast.error("Lỗi khi gửi đề cương: ", {
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePaste = (type: string) => {
        if (type === "content") {
            navigator.clipboard.readText().then((text) => {
                setData({
                    ...data,
                    content: text,
                })
            })
        } else if (type === "image") {
            navigator.clipboard.readText().then((text) => {
                setData({
                    ...data,
                    image: text,
                })
            })
        }
    }

    const handleGetImageInGoogle = () => {
        const searchQuery = data.title || "Đề cương học tập"
        const url = `https://www.google.com/search?hl=vi&q=${encodeURIComponent(searchQuery)}&tbm=isch`
        window.open(url, "_blank")
    }
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Quản lý bài đăng</h2>
                        <p className="text-muted-foreground">Quản lý và kiểm duyệt các bài đăng trong hệ thống</p>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="text-white">
                            <Plus />
                            Tạo đề cương
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nhập file JSON vào</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex gap-2 items-center">
                                <Input placeholder="Nhập tiêu đề" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })}></Input>
                                <Button variant="outline" onClick={handleGetImageInGoogle}>
                                    <Search />
                                </Button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Button variant="outline" onClick={() => handlePaste("content")}>
                                    <ClipboardPaste />
                                </Button>
                                <Input placeholder="Nhập nội dung (mô tả)" value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })}></Input>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Button variant="outline" onClick={() => handlePaste("image")}>
                                    <ClipboardPaste />
                                </Button>

                                <Input placeholder="Nhập link hình ảnh" value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })}></Input>
                            </div>
                            {data.image && (
                                <div className="flex items-center gap-2 relative w-full h-48">
                                    <Image src={data.image} alt="Preview" fill className=" object-cover rounded-md" />
                                    <Button variant="outline" className="text-red-500 absolute top-1 right-1" onClick={() => setData({ ...data, image: "" })}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <Textarea className="h-48" placeholder="Paste JSON vào đây" value={data.quest} onChange={(e) => setData({ ...data, quest: JSON.parse(e.target.value) })}></Textarea>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="text-white">
                                <X className="mr-2" />
                                Hủy
                            </Button>
                            <Button type="submit" className="text-white" disabled={loading} onClick={handleSendSOJSON}>
                                {loading ? <Loading /> : <Save />}
                                Lưu đề cương
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="dark:border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bài đăng</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{SO.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bài đăng trong hệ thống</p>
                    </CardContent>
                </Card>
            </div>

            <DataTableSubjectOutline subject_outline={SO} />
        </div>
    )
}
