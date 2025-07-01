"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, Type } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { optimizedPromptFCMore } from "@/lib/optimizedPrompt";
import { POST_API } from "@/lib/fetchAPI";
import { toast } from "sonner";
import Loading from "../ui/loading";
import { revalidateCache } from "@/lib/revalidate";

interface AddVocabularyModalProps {
    children: React.ReactNode;
    listFlashcard?: any;
    token: any;
    filteredFlashcards: any;
    setFilteredFlashcards: any;
}

export default function AddMoreVocaModal({ children, listFlashcard, token, filteredFlashcards, setFilteredFlashcards }: AddVocabularyModalProps) {
    const [open, setOpen] = useState(false);

    const [vocabulary, setVocabulary] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIGenerate = async (e: any) => {
        e.preventDefault();
        toast.loading("Đang tạo flashcard bằng AI, vui lòng đợi trong giây lát...", {
            description: "Quá trình này có thể mất vài giây đến vài phút tùy vào độ phức tạp của từ vựng.",
            id: "ai-generate",
        });
        try {
            const optimizedPrompt = optimizedPromptFCMore(vocabulary, listFlashcard?.language);
            setIsGenerating(true);

            const req = await POST_API("/flashcards/create-ai-list", { prompt: optimizedPrompt, list_flashcard_id: listFlashcard._id, language: listFlashcard?.language || "" }, "POST", token);
            const res = await req?.json();
            if (res.ok) {
                toast.success("Tạo flashcard thành công từ AI", { description: "Các từ vựng mới đã được thêm vào bộ flashcard của bạn.", id: "ai-generate", duration: 5000 });
                console.log("AI generated flashcards:", res.flashcards);
                setFilteredFlashcards([...res?.flashcards, ...filteredFlashcards]);
                setOpen(false);
                // Reset form data with AI generated content
                setVocabulary("");
                // 4. Revalidate cache
                await revalidateCache({
                    tag: [`flashcard_${listFlashcard._id}`],
                    path: `/flashcard/${listFlashcard._id}`,
                });
            }
        } catch (error: any) {
            console.error("Error generating flashcards with AI:", error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau", { description: error.message, id: "ai-generate" });
        } finally {
            setIsGenerating(false);
            toast.dismiss("ai-generate");
        }
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleAIGenerate(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Thêm nhiều từ vựng mới
                    </DialogTitle>
                    <DialogDescription>
                        <p>Điền thông tin để thêm từ vựng mới vào bộ flashcard của bạn</p>
                        <p>Bạn có thể ghi tiếng việt vào và bấm tạo bằng AI, AI sẽ tự động chuyển từ thành tiếng bạn muốn</p>
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[60vh] pr-2">
                    <div className="space-y-6">
                        {/* Main Word Section */}
                        <Card className="border-blue-100 bg-blue-50/30 dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    Từ vựng chính
                                    <Badge variant="destructive" className="text-xs">
                                        Bắt buộc
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Textarea
                                        id="title"
                                        value={vocabulary}
                                        onChange={(e) => setVocabulary(e.target.value)}
                                        autoFocus
                                        autoComplete="off"
                                        maxLength={200}
                                        onKeyDown={handleEnterKey}
                                        placeholder="VD: extraordinary, beautiful, huge, etc."
                                        className="flex-1 h-52"
                                    />
                                </div>
                                <div className="flex justify-between items-center bg-slate-600/50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-white/50">Các từ vựng cách nhau bằng dấu cách</p>
                                    <span className="text-xs text-gray-400">
                                        {vocabulary.split(" ").length}/24 từ {" | Mất khoảng:" + vocabulary.split(" ").length * 1.25 + "s"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-600/50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-white/50">Các câu cách nhau bằng dấu phẩy</p>
                                    <span className="text-xs text-right  text-gray-400">
                                        {vocabulary.split(",").length} câu {" | " + vocabulary.length}/200 chữ
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-white/50">Nếu bạn không làm đúng format, AI có thể hiểu nhầm</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-4" />

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="dark:text-white gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        {isGenerating ? <Loading /> : <Sparkles className="w-4 h-4" />}

                        {isGenerating ? "Đang tạo..." : "Tạo bằng AI"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
