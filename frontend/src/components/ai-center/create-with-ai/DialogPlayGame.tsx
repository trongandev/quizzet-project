"use client"
import React from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Gamepad2 } from "lucide-react"
import { Game2048Smooth } from "@/components/ai-center/Game2048Smooth"

export default function DialogPlayGame({ openGame, setOpenGame, generatedQuiz }: any) {
    return (
        <Dialog open={openGame} onOpenChange={setOpenGame}>
            <DialogTrigger>
                <Button size="lg" variant="outline" className="w-full">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Chơi game 2048
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-5">Giải trí trong lúc đợi AI {!generatedQuiz ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-500" />}</DialogTitle>
                    {!generatedQuiz ? (
                        <DialogDescription>
                            <p className="mb-2 hidden md:block">Hệ thống AI đang tổng hợp các câu hỏi cho bạn.</p>
                            <p className="mb-4">Quá trình này có thể mất chút thời gian tùy thuộc vào số lượng câu hỏi</p>
                        </DialogDescription>
                    ) : (
                        <DialogDescription>
                            <p className="mb-2 text-green-300">AI đã tạo xong quiz cho bạn!</p>
                            <p className="mb-4 text-green-300">Bạn có thể xem trước kết quả hoặc lưu vào nháp để chỉnh sửa sau.</p>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex justify-center">
                    <Game2048Smooth />
                </div>

                <DialogFooter>
                    <p className=" hidden md:block text-xs text-muted-foreground text-center w-full">Chơi game để thời gian chờ trở nên thú vị hơn!</p>
                    <DialogClose asChild className="hidden md:block">
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
