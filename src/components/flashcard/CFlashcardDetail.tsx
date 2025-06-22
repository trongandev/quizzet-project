"use client";
import { GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import React, { useEffect, useState, useCallback } from "react";
import { message, Modal, Popconfirm, Popover, Select, Spin, Switch } from "antd";
import { FaBrain, FaTrash } from "react-icons/fa6";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { MdEdit, MdOutlineQuestionMark } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { languageOption } from "@/lib/languageOption";
import { optimizedPromptFCMore, optimizedPromptFCSingle } from "@/lib/optimizedPrompt";
import ItemFC from "./ItemFCDetail";
import ItemFCSimple from "./ItemFCSimple";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, ArrowLeft, BookOpen, Brain, CheckCircle, Clock, Flag, Flame, Grid3x3, PencilLine, Plus, RotateCcw, Target, Timer, Trash2, TrendingUp, User } from "lucide-react";
import { EditFlashcardModal } from "./EditFlashcardModal";
import AddVocaModal from "./AddVocaModal";
import { Badge } from "../ui/badge";
import { Flashcard, IEditFlashcard, IListFlashcard } from "@/types/type";
import VocaCardItem from "./VocaCardItem";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Loading from "../ui/loading";
const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: "🇺🇸",
        chinese: "🇨🇳",
        japan: "🇯🇵",
        korea: "🇰🇷",
    };
    return flags[lang] || "🌐";
};

const getLanguageName = (lang: string) => {
    const names: { [key: string]: string } = {
        english: "English",
        chinese: "中文",
        japan: "日本語",
        korea: "한국어",
    };
    return names[lang] || "Khác";
};

export default function CFlashcardDetail({ id_flashcard }: any) {
    const [isOpenVocaModal, setIsOpenVocaModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [flashcard, setFlashcard] = useState<Flashcard>(); // các flashcard
    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>();
    const [listFlashcard, setListFlashcard] = useState<IListFlashcard>(); // danh sách flashcard
    const [editListFlashcard, setEditListFlashcard] = useState<IEditFlashcard>(); // danh sách flashcard

    const token = Cookies.get("token") || "";
    const router = useRouter();
    const sortFlashcards = (flashcards: any) => {
        return flashcards?.sort(({ a, b }: any) => {
            return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime();
        });
    };
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API_WITHOUT_COOKIE(`/flashcards/${id_flashcard}`);
            if (req.ok) {
                const sortedFlashcards = sortFlashcards(req?.listFlashCards?.flashcards);
                setFlashcard(sortedFlashcards);

                setFilteredFlashcards(sortedFlashcards);
                setListFlashcard(req?.listFlashCards);
                setEditListFlashcard({
                    _id: req?.listFlashCards?._id,
                    title: req?.listFlashCards?.title,
                    language: req?.listFlashCards?.language,
                    desc: req?.listFlashCards?.desc,
                    public: req?.listFlashCards?.public,
                });
            }
        };
        fetchAPI();
    }, [id_flashcard]);

    const handleAddVoca = async (values: any) => {
        // try {
        //     setLoading(true);
        //     const req = await POST_API("/flashcards", { ...newFlashcard, list_flashcard_id: listFlashcard._id }, "POST", token);
        //     const res = await req.json();
        //     if (req.ok) {
        //         setOpen(false);
        //         setFilteredFlashcards([res?.flashcard, ...flashcard]);
        //         setNewFlashcard(defaultFlashcard);
        //     }
        // } catch (error) {
        //     messageApi.error(error.message);
        // } finally {
        //     setLoading(false);
        // }
        console.log("Adding vocabulary:", values);
    };
    const handleDeleteListFlashcard = async () => {
        try {
            setLoadingConfirm(true);
            const req = await POST_API(`/list-flashcards/${id_flashcard}`, {}, "DELETE", token);
            const res = await req?.json();
            if (req?.ok) {
                router.back();
            } else {
                toast.error("Xoá flashcard không thành công", {
                    description: res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau",
                    duration: 3000,
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error deleting list flashcard:", error);
            toast.error("Xoá bộ flashcard không thành công", {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
                duration: 3000,
                position: "top-center",
            });
        } finally {
            setLoadingConfirm(false);
        }
    };

    return (
        <div className="w-full space-y-5 relative z-[10] dark:bg-slate-700">
            <div className="bg-white dark:bg-slate-800 p-5 border-b border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between flex-col md:flex-row gap-5 md:gap-0">
                    <div className="flex items-center gap-5">
                        <Button className="" variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft /> Quay lại
                        </Button>
                        <div className="">
                            <h1 className="text-primary text-2xl font-bold">Flashcard: {listFlashcard?.title}</h1>
                            <p className="text-gray-400 dark:text-white/50 text-sm">{listFlashcard?.desc || "Không có mô tả..."} </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3 flex-wrap dark:text-white/80">
                        <EditFlashcardModal>
                            <Button className="dark:text-white">
                                <PencilLine /> Chỉnh Sửa
                            </Button>
                        </EditFlashcardModal>
                        <AddVocaModal onAdd={handleAddVoca} token={token} filteredFlashcards={filteredFlashcards} setFilteredFlashcards={setFilteredFlashcards} listFlashcard={listFlashcard}>
                            <Button className="dark:text-white">
                                <Plus /> Thêm
                            </Button>
                        </AddVocaModal>
                        <Button className="dark:text-white">
                            <Grid3x3 /> Thêm nhiều
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 /> Xóa
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Bạn có chắc muốn xóa flashcard này không?</AlertDialogTitle>
                                    <AlertDialogDescription>Sau khi xóa bạn sẽ không thể khôi phục lại được nữa</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Từ chối</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteListFlashcard(listFlashcard?._id || "")} disabled={loadingConfirm} className="dark:text-white">
                                        {loadingConfirm && <Loading />}Xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-white/60">
                    <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        <span>Ngôn ngữ:</span>
                        <Badge variant="secondary" className="gap-1">
                            {getLanguageFlag(listFlashcard?.language || "")}
                            {getLanguageName(listFlashcard?.language || "")}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Người chia sẻ:</span>
                        <span className="font-medium">{listFlashcard?.userId?.displayName || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Tổng số thẻ:</span>
                        <Badge variant="outline">{listFlashcard?.flashcards?.length || 0}</Badge>
                    </div>
                </div>
            </div>

            <div className="px-5">
                <div className="">
                    {/* Header with Layout Controls */}
                    {/* <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Layout:</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <Button variant={statsLayout === "1x1" ? "default" : "ghost"} size="sm" onClick={() => setStatsLayout("1x1")} className="h-8 px-3 text-xs">
                                    1×1
                                </Button>
                                <Button variant={statsLayout === "2x1" ? "default" : "ghost"} size="sm" onClick={() => setStatsLayout("2x1")} className="h-8 px-3 text-xs">
                                    2×1
                                </Button>
                                <Button variant={statsLayout === "3x1" ? "default" : "ghost"} size="sm" onClick={() => setStatsLayout("3x1")} className="h-8 px-3 text-xs">
                                    3×1
                                </Button>
                            </div>
                        </div>
                    </div> */}

                    {/* Statistics Cards with Dynamic Layout */}
                    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`}>
                        {/* Total Cards - Enhanced */}
                        <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 dark:from-blue-800/50 dark:to-blue-900/50 dark:border-white/10`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    Tổng
                                </Badge>
                            </div>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-1">{listFlashcard?.flashcards?.length}</div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Tất cả từ vựng</div>
                            <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +2 tuần này
                            </div>
                        </div>

                        {/* Learned Cards */}
                        <div className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800/50 dark:to-green-900/50 dark:border-white/10 rounded-xl p-6 border border-green-200 `}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-green-100 text-green-800">Hoàn thành</Badge>
                            </div>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-400 mb-1">0</div>
                            <div className="text-sm text-green-700 dark:text-green-300">Đã học thuộc</div>
                            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                            </div>
                        </div>

                        {/* Known Cards */}
                        <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 dark:from-purple-800/50 dark:to-purple-900/50 dark:border-white/10`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-purple-100 text-purple-800">Ghi nhớ</Badge>
                            </div>
                            <div className="text-3xl font-bold text-purple-900 mb-1 dark:text-purple-300">0</div>
                            <div className="text-sm text-purple-700 dark:text-purple-400">Đã nhớ lâu</div>
                            <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Cần ôn lại
                            </div>
                        </div>

                        {/* Review Cards */}
                        <div className={`bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 dark:from-orange-800/50 dark:to-orange-900/50 dark:border-white/10`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-orange-600 rounded-lg">
                                    <RotateCcw className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-orange-100 text-orange-800">Cần ôn</Badge>
                            </div>
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-400 mb-1">{listFlashcard?.flashcards?.length}</div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">Cần ôn tập</div>
                            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Ưu tiên cao
                            </div>
                        </div>

                        {/* Accuracy Percentage */}
                        <div className={`bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 dark:from-indigo-800/50 dark:to-indigo-900/50 dark:border-white/10`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-indigo-100 text-indigo-800">Độ chính xác</Badge>
                            </div>
                            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400 mb-1">0%</div>
                            <div className="text-sm text-indigo-700 dark:text-indigo-300">Tỷ lệ đúng</div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 bg-indigo-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                                <span className="text-xs text-indigo-600 dark:text-indigo-400">0/10</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600 dark:text-white/60">Học hôm nay:</span>
                                <span className="font-medium text-gray-900 dark:text-white/80">0 từ</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="text-orange-600" />

                                <span className="font-medium ">0 ngày</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <Timer />
                                <span className="font-medium ">0 phút</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center px-5 gap-5">
                <Link href={`/flashcard/practice/${id_flashcard}`} className="flex-1">
                    <Button className="w-full h-16 dark:text-white text-xl uppercase hover:scale-105 transition-all duration-300">Luyện tập</Button>
                </Link>
                <Link href={`/flashcard/practice-science/${id_flashcard}`} className="flex-1">
                    <Button variant="outline" className="w-full h-16 dark:text-white text-xl uppercase hover:scale-105 transition-all duration-300">
                        Luyện tập theo khoa học (beta)
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
                {filteredFlashcards && filteredFlashcards?.length > 0 ? (
                    filteredFlashcards.map((item: Flashcard) => <VocaCardItem key={item._id} {...item} />)
                ) : (
                    <div className="col-span-2 text-center text-gray-500 h-60 flex items-center justify-center">Không có từ vựng nào trong flashcard này</div>
                )}
            </div>
        </div>
    );
}
