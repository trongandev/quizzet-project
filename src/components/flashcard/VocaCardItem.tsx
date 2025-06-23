"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Volume2, BookOpen, MessageCircle, Lightbulb, MoreVertical, Edit3, ChevronUp, ChevronDown } from "lucide-react";
import { Flashcard } from "@/types/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import handleCompareDate from "@/lib/CompareDate";
import { toast } from "sonner";
import Loading from "../ui/loading";

interface Props {
    data: Flashcard;
    speakWord: (word: string, id?: string) => void;
    loadingAudio: any;
}
export default function VocaCardItem({ data, speakWord, loadingAudio }: Props) {
    const [showExamples, setShowExamples] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [editData, setEditData] = useState({
        title: data.title,
        transcription: data.transcription,
        define: data.define,
        type_of_word: data.type_of_word,
        note: data.note || "",
        example: data.example || [],
    });
    const getStatusColor = (status: string) => {
        switch (status) {
            case "learning":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "review":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "mastered":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "learning":
                return "Cần ôn tập";
            case "review":
                return "Đang học";
            case "mastered":
                return "Đã thành thạo";
            default:
                return "Chưa học";
        }
    };

    return (
        <Card className="md:w-full max-w-2xl md:max-w-full mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500 dark:border-l-blue-400 overflow-hidden h-full">
            <CardContent className="p-0 dark:bg-slate-800/50 h-full">
                {/* Header with status */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <Badge className={`${getStatusColor(data.status)} font-medium`}>{getStatusText(data.status)}</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70">
                        <span>Ghi nhớ: {data.progress?.percentage}%</span>
                        <span>•</span>
                        {data?.created_at && <span>{handleCompareDate(data?.created_at)}</span>}
                    </div>
                    {/* Action Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="text-red-600" onClick={() => onDelete(data.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Main content */}
                <div className="px-4 pb-4">
                    {/* Chinese sentence - Main focus */}
                    <div className="mb-4">
                        <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white/80 leading-relaxed mb-2">{data.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <p className="text-base text-blue-600 font-mono">{data.transcription}</p>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700" disabled={loadingAudio} onClick={() => speakWord(data.title, data._id)}>
                                        {loadingAudio ? <Loading /> : <Volume2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Type indicator */}
                        <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded">{data.type_of_word}</span>
                        </div>

                        {/* Vietnamese meaning */}
                        <div className="bg-blue-50 dark:bg-blue-800/50 rounded-lg p-3 mb-4">
                            <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-300 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900 mb-1 dark:text-blue-200">Định nghĩa:</p>
                                    <p className="text-gray-700 leading-relaxed dark:text-blue-100">{data.define}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Examples section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white/80 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-gray-600 dark:text-white/60" />
                                Ví dụ ({data.example?.length})
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowExamples(!showExamples)} className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400">
                                {showExamples ? <ChevronUp /> : <ChevronDown />} {showExamples ? "Thu gọn" : "Xem ví dụ"}
                            </Button>
                        </div>

                        {showExamples && (
                            <div className="space-y-4">
                                {data.example.map((exa, index: any) => (
                                    <div key={index} className="border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                                        <div className="space-y-2">
                                            {/* Chinese exa */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500 dark:text-white/80 min-w-[20px]">{index + 1}.</span>
                                                <p className="text-gray-900 flex-1 dark:text-white/80">{exa.en}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={loadingAudio}
                                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-white/60 dark:hover:text-gray-300"
                                                    onClick={() => speakWord(exa.en, index)}>
                                                    {loadingAudio ? <Loading /> : <Volume2 className="w-3 h-3" />}
                                                </Button>
                                            </div>

                                            {/* Pinyin */}
                                            <div className="ml-6">
                                                <p className="text-sm text-blue-600 dark:text-blue-300 font-mono mb-1">{exa.trans}</p>
                                                <p className="text-sm text-gray-600 dark:text-white/60 italic">{exa.vi}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes section */}
                    {data.note && (
                        <>
                            <Separator className="my-4" />
                            <div className="bg-amber-50 dark:bg-amber-800/50 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-200 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1 dark:text-amber-200">Ghi chú:</p>
                                        <p className="text-sm text-gray-700 dark:text-amber-100 leading-relaxed">{data.note}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
