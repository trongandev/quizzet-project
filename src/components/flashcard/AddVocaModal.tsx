"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Volume2, BookOpen, MessageCircle, Lightbulb, Plus, Trash2, Type, Languages } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { optimizedPromptFCSingle } from "@/lib/optimizedPrompt";
import { POST_API } from "@/lib/fetchAPI";
import { toast } from "sonner";
import Loading from "../ui/loading";

interface AddVocabularyModalProps {
    children: React.ReactNode;
    listFlashcard?: any;
    onAdd: (values: any) => Promise<void>;
    token: any;
    filteredFlashcards: any;
    setFilteredFlashcards: any;
}

interface VocabularyData {
    title: string;
    transcription: string;
    define: string;
    type_of_word: string;
    examples: Array<{
        en: string;
        trans: string;
        vi: string;
    }>;
    note: string;
}

export default function AddVocaModal({ children, onAdd, listFlashcard, token, filteredFlashcards, setFilteredFlashcards }: AddVocabularyModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const defaultData: VocabularyData = {
        title: "",
        transcription: "",
        define: "",
        type_of_word: "",
        examples: [{ en: "", trans: "", vi: "" }],
        note: "",
    };
    const [formData, setFormData] = useState<VocabularyData>(defaultData);

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddExample = () => {
        setFormData((prev) => ({
            ...prev,
            examples: [...prev.examples, { en: "", trans: "", vi: "" }],
        }));
    };

    const handleRemoveExample = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index),
        }));
    };

    const handleExampleChange = (index: number, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            examples: prev.examples.map((example, i) => (i === index ? { ...example, [field]: value } : example)),
        }));
    };

    const handleAIGenerate = async () => {
        try {
            const optimizedPrompt = optimizedPromptFCSingle(formData.title, listFlashcard?.language);
            setIsGenerating(true);

            const req = await POST_API("/flashcards/create-ai", { prompt: optimizedPrompt, list_flashcard_id: listFlashcard._id }, "POST", token);
            if (req) {
                const res = await req.json();
                if (res.ok) {
                    toast.success("Tạo flashcard thành công từ AI");

                    setFilteredFlashcards([res?.flashcard, ...filteredFlashcards]);
                    setOpen(false);
                    // Reset form data with AI generated content
                    setFormData(defaultData);
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau", { description: error instanceof Error ? error.message : "Lỗi không xác định" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = () => {
        onAdd(formData);
        // Reset form
        setFormData({
            title: "",
            transcription: "",
            define: "",
            type_of_word: "",
            examples: [{ en: "", trans: "", vi: "" }],
            note: "",
        });
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleAIGenerate();
        }
    };

    const isFormValid = formData.title.trim() && formData.define.trim();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Thêm từ vựng mới
                    </DialogTitle>
                    <DialogDescription>Điền thông tin để thêm từ vựng mới vào bộ flashcard của bạn</DialogDescription>
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
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        Từ
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                            autoFocus
                                            autoComplete="off"
                                            onKeyDown={handleEnterKey}
                                            placeholder="Nhập từ hoặc câu tiếng Trung..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            disabled={isGenerating}
                                            className="dark:text-white gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                            {isGenerating ? <Loading /> : <Sparkles className="w-4 h-4" />}

                                            {isGenerating ? "Đang tạo..." : "Tạo bằng AI"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="transcription" className="text-sm font-medium flex items-center gap-1">
                                            <Languages className="w-3 h-3" />
                                            Phiên âm (transcription)
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="transcription"
                                                value={formData.transcription}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, transcription: e.target.value }))}
                                                placeholder="Nhập phiên âm..."
                                                className="flex-1 font-mono"
                                            />
                                            <Button variant="ghost" size="sm" className="px-2">
                                                <Volume2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type_of_word" className="text-sm font-medium">
                                            Loại từ
                                        </Label>
                                        <Select value={formData.type_of_word} onValueChange={(value) => setFormData((prev) => ({ ...prev, type_of_word: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại từ..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Từ">Từ</SelectItem>
                                                <SelectItem value="Câu">Câu</SelectItem>
                                                <SelectItem value="Cụm từ">Cụm từ</SelectItem>
                                                <SelectItem value="Thành ngữ">Thành ngữ</SelectItem>
                                                <SelectItem value="Câu hỏi">Câu hỏi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="define" className="text-sm font-medium flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        Nghĩa tiếng Việt
                                        <Badge variant="destructive" className="text-xs">
                                            Bắt buộc
                                        </Badge>
                                    </Label>
                                    <Textarea
                                        id="define"
                                        value={formData.define}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, define: e.target.value }))}
                                        placeholder="Nhập nghĩa tiếng Việt..."
                                        rows={2}
                                        className="resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Examples Section */}
                        <Card className="border-green-100 bg-green-50/30 dark:border-white/10 dark:bg-slate-800/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                    Ví dụ
                                    <Badge variant="secondary" className="text-xs">
                                        Tùy chọn
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.examples.map((example, index) => (
                                    <div key={index} className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white dark:bg-slate-700 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Ví dụ {index + 1}</span>
                                            {formData.examples.length > 1 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveExample(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Input value={example.en} onChange={(e) => handleExampleChange(index, "title", e.target.value)} placeholder="Câu ví dụ tiếng Trung..." />
                                            <Input
                                                value={example.trans}
                                                onChange={(e) => handleExampleChange(index, "transcription", e.target.value)}
                                                placeholder="Phiên âm..."
                                                className="font-mono text-sm"
                                            />
                                            <Input value={example.vi} onChange={(e) => handleExampleChange(index, "translation", e.target.value)} placeholder="Dịch nghĩa..." />
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddExample}
                                    className="w-full gap-2 border-dashed border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:bg-green-800/50 hover:opacity-85">
                                    <Plus className="w-4 h-4" />
                                    Thêm ví dụ
                                </Button>
                            </CardContent>
                        </Card>

                        {/* note Section */}
                        <Card className="border-amber-100 bg-amber-50/30 dark:border-white/10 dark:bg-slate-800/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-600" />
                                    Ghi chú
                                    <Badge variant="secondary" className="text-xs">
                                        Tùy chọn
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={formData.note}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                                    placeholder="Thêm ghi chú, mẹo nhớ, hoặc thông tin bổ sung..."
                                    rows={3}
                                    className="resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-4" />

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid} className="gap-2 bg-primary hover:bg-primary/80 text-white">
                        <Plus className="w-4 h-4" />
                        Thêm từ vựng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
