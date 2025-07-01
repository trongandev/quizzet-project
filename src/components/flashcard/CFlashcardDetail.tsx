"use client";
import { POST_API } from "@/lib/fetchAPI";
import { useFlashcard } from "@/hooks/useOptimizedFetch";
import React, { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/userContext";
// import { languageOption } from "@/lib/languageOption";
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
import { AlertCircle, ArrowLeft, BookOpen, Brain, Flag, GalleryVerticalEnd, Gift, Grid3x3, PencilLine, Plus, RotateCcw, Target, Trash2, User, Volume2 } from "lucide-react";
import { EditListFlashcardModal } from "./EditListFlashcardModal";
import AddVocaModal from "./AddVocaModal";
import { Badge } from "../ui/badge";
import { Flashcard, IEditFlashcard, IListFlashcard } from "@/types/type";
import VocaCardItem from "./VocaCardItem";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Loading from "../ui/loading";
import VoiceSelectionModal from "./VoiceSelectionModal";
import { revalidateCache } from "@/lib/revalidate";
import AddMoreVocaModal from "./AddMoreVocaModal";

const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: "🇺🇸",
        chinese: "🇨🇳",
        japan: "🇯🇵",
        korea: "🇰🇷",
        vietnamese: "🇻🇳",
        germany: "🇩🇪",
        france: "🇫🇷",
    };
    return flags[lang] || "🌐";
};

const getLanguageName = (lang: string) => {
    const names: { [key: string]: string } = {
        english: "English",
        chinese: "中文",
        japan: "日本語",
        korea: "한국어",
        vietnamese: "Tiếng Việt",
        germany: "Deutsch",
        france: "Français",
    };
    return names[lang] || "Khác";
};

export default function CFlashcardDetail({ id_flashcard, initialData, statusCounts }: any) {
    const [loading, setLoading] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [flashcard, setFlashcard] = useState<Flashcard>(); // các flashcard
    const [loadingAudio, setLoadingAudio] = useState(null);
    const [disableAudio, setDisableAudio] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState("");
    const token = Cookies.get("token") || "";
    const router = useRouter();
    const { user } = useUser() || {};
    const sortFlashcards = (flashcards: any) => {
        return flashcards?.sort((a: any, b: any) => {
            return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime();
        });
    };

    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(() => {
        return initialData?.flashcards ? sortFlashcards(initialData.flashcards) : [];
    });
    const [listFlashcard, setListFlashcard] = useState<IListFlashcard>(initialData);
    const [editListFlashcard, setEditListFlashcard] = useState<IEditFlashcard | undefined>(
        initialData
            ? {
                  _id: initialData._id,
                  title: initialData.title,
                  language: initialData.language,
                  desc: initialData.desc,
                  public: initialData.public,
              }
            : undefined
    );

    const { data: fetchedData, loading: fetchLoading } = useFlashcard(id_flashcard, initialData);

    useEffect(() => {
        if (fetchedData && fetchedData !== initialData) {
            const sortedFlashcards = sortFlashcards(fetchedData.flashcards);
            setFlashcard(sortedFlashcards);
            setListFlashcard(fetchedData);

            setFilteredFlashcards((prevFiltered) => {
                const initialLength = initialData?.flashcards?.length || 0;
                const hasLocalChanges = prevFiltered.length > initialLength;

                if (hasLocalChanges) {
                    return prevFiltered; // Giữ nguyên local changes
                } else {
                    return sortedFlashcards; // Update với data mới
                }
            });

            setEditListFlashcard({
                _id: fetchedData._id,
                title: fetchedData.title,
                language: fetchedData.language,
                desc: fetchedData.desc,
                public: fetchedData.public,
            });
        }
    }, [fetchedData, initialData]);

    const handleAddNewFlashcard = useCallback((newFlashcard: Flashcard) => {
        setFilteredFlashcards((prev) => [newFlashcard, ...prev]);

        setListFlashcard((prev) => ({
            ...prev,
            flashcards: [newFlashcard, ...(prev?.flashcards || [])],
        }));
    }, []);

    const summaryUsers = [
        { label: "Tất cả thẻ", filter: "all", value: listFlashcard?.flashcards?.length || 0, icon: <GalleryVerticalEnd />, color: "indigo" },
        { label: "Đã nhớ", filter: "learned", value: statusCounts?.learned || 0, icon: <BookOpen />, color: "green" },
        { label: "Đang ghi nhớ", filter: "remembered", value: statusCounts?.remembered || 0, icon: <Brain />, color: "blue" },
        { label: "Cần ôn tập", filter: "reviewing", value: statusCounts?.reviewing || 0, icon: <RotateCcw />, color: "red" },
    ];

    useEffect(() => {
        if (!listFlashcard?.language) return; // Đợi listFlashcard load xong

        const defaultVoices = {
            english: "en-GB-SoniaNeural",
            vietnamese: "vi-VN-HoaiMyNeural",
            germany: "de-DE-KatjaNeural",
            france: "fr-FR-DeniseNeural",
            japan: "ja-JP-NanamiNeural",
            korea: "ko-KR-SunHiNeural",
            chinese: "zh-CN-XiaoxiaoNeural",
        };

        // Lấy hoặc tạo mới defaultVoices trong localStorage
        let savedVoices;
        const savedVoiceString = localStorage.getItem("defaultVoices");

        if (savedVoiceString) {
            try {
                savedVoices = JSON.parse(savedVoiceString);
            } catch (error) {
                console.error("Error parsing saved voices:", error);
                savedVoices = defaultVoices;
                localStorage.setItem("defaultVoices", JSON.stringify(defaultVoices));
            }
        } else {
            savedVoices = defaultVoices;
            localStorage.setItem("defaultVoices", JSON.stringify(defaultVoices));
        }

        // Lấy voice cho ngôn ngữ hiện tại
        const currentVoice = savedVoices[listFlashcard.language as keyof typeof defaultVoices] || defaultVoices.english;
        setSelectedVoice(currentVoice);
    }, [listFlashcard?.language]);

    const handleDeleteListFlashcard = async () => {
        try {
            setLoadingConfirm(true);
            const req = await POST_API(`/list-flashcards/${id_flashcard}`, {}, "DELETE", token);
            const res = await req?.json();
            if (res?.ok) {
                router.back();
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

    const handleEditListFlashcard = async (values: any) => {
        try {
            setLoading(true);

            const req = await POST_API(`/list-flashcards/${values._id}`, values, "PATCH", token);
            const res = await req?.json();

            if (res.ok) {
                setListFlashcard(res.listFlashCard || values);

                // ✅ Revalidate multiple caches
                await revalidateCache({
                    tag: [`flashcard_${id_flashcard}`, "flashcards"],
                    path: `/flashcard/${id_flashcard}`,
                });

                // ✅ Revalidate public cache if needed
                if (values.public) {
                    await revalidateCache({
                        tag: "flashcard_public",
                    });
                }

                toast.success("Cập nhật thành công!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra", { description: error instanceof Error ? error.message : "Lỗi không xác định", duration: 3000, position: "top-center" });
        } finally {
            setLoading(false);
        }
    };
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }));

    const speakWord = useCallback(
        async (text: string, id: any) => {
            if (disableAudio) return;

            const voice = selectedVoice;

            try {
                setLoadingAudio(id);
                setDisableAudio(true);

                const response = await tts.create({
                    input: text,
                    options: {
                        voice: voice,
                    },
                });

                const audioBuffer = await response.arrayBuffer();
                const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                audio.addEventListener("ended", () => {
                    URL.revokeObjectURL(url);
                });

                audio.play();
            } catch (error) {
                console.error("TTS Error:", error);
                toast.error("Có lỗi sảy ra", {
                    description: error instanceof Error ? error.message : "Lỗi không xác định",
                    duration: 3000,
                    position: "top-center",
                });
            } finally {
                setLoadingAudio(null);
                setTimeout(() => {
                    setDisableAudio(false);
                }, 1000);
            }
        },
        [disableAudio, listFlashcard?.language, tts, selectedVoice]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                setLoadingConfirm(true);
                const req = await POST_API(`/flashcards/${id}`, { list_flashcard_id: listFlashcard?._id }, "DELETE", token);
                const res = await req?.json();

                if (res.ok) {
                    setFilteredFlashcards((prev) => prev.filter((item) => item._id !== id));

                    setListFlashcard((prev) => ({
                        ...prev,
                        flashcards: prev?.flashcards?.filter((item) => item._id !== id) || [],
                    }));

                    toast.success("Xóa flashcard thành công");
                }
            } catch (error) {
                console.error("Error deleting flashcard:", error);
                toast.error("Xóa flashcard không thành công");
            } finally {
                setLoadingConfirm(false);
            }
        },
        [listFlashcard?._id, token]
    );

    const handleFilter = (filter: string) => {
        if (!listFlashcard?.flashcards) return;

        let filtered = listFlashcard.flashcards;

        switch (filter) {
            case "learned":
                filtered = listFlashcard.flashcards.filter((item) => item.status === "learned");
                break;
            case "remembered":
                filtered = listFlashcard.flashcards.filter((item) => item.status === "remembered");
                break;
            case "reviewing":
                filtered = listFlashcard.flashcards.filter((item) => item.status === "reviewing");
                break;
            default:
                filtered = listFlashcard.flashcards;
        }

        setFilteredFlashcards(sortFlashcards(filtered));
    };

    if (fetchLoading && !initialData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (!listFlashcard && !fetchLoading) {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-3">
                <AlertCircle size={50} className="text-red-500" />
                <p>Không thể tải dữ liệu flashcard</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-5 relative z-[10] dark:bg-slate-700 bg-gray-200">
            <div className="bg-white dark:bg-slate-800 p-5 border-b border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex justify-between  items-start md:items-center flex-col md:flex-row gap-5 md:gap-0">
                    <div className="flex w-full md:items-center flex-col md:flex-row gap-5 justify-between md:justify-start flex-1">
                        <Button className="w-full md:w-auto" variant="outline" onClick={() => router.back()}>
                            <ArrowLeft /> Quay lại
                        </Button>
                        <div className="">
                            <h1 className="text-primary text-2xl font-bold">Flashcard: {listFlashcard?.title}</h1>
                            <p className="text-gray-400 dark:text-white/50 text-sm">{listFlashcard?.desc || "Không có mô tả..."} </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap dark:text-white/80">
                        <VoiceSelectionModal selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} language={listFlashcard?.language}>
                            <Button className="dark:text-white" variant="outline">
                                <Volume2 /> Chọn giọng nói
                            </Button>
                        </VoiceSelectionModal>

                        <div className={` items-center gap-2 md:gap-3 flex-wrap ${user?._id === String(listFlashcard?.userId._id) ? "flex" : "hidden"}`}>
                            <EditListFlashcardModal handleEditListFlashcard={handleEditListFlashcard} editListFlashcard={editListFlashcard} setEditListFlashcard={setEditListFlashcard} token={token}>
                                <Button className="dark:text-white" variant="outline" onClick={() => setEditListFlashcard({ ...listFlashcard })}>
                                    <PencilLine /> Chỉnh Sửa
                                </Button>
                            </EditListFlashcardModal>
                            <AddMoreVocaModal listFlashcard={listFlashcard} filteredFlashcards={filteredFlashcards} setFilteredFlashcards={setFilteredFlashcards} token={token}>
                                <Button className="dark:text-white" variant="outline">
                                    <Grid3x3 /> Thêm nhiều
                                </Button>
                            </AddMoreVocaModal>
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
                                        <AlertDialogAction onClick={handleDeleteListFlashcard} disabled={loadingConfirm} className="dark:text-white">
                                            {loadingConfirm && <Loading />}Xóa
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-6 flex-wrap text-sm text-gray-600 dark:text-white/60">
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
                    {user?._id === String(listFlashcard?.userId?._id) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                            {summaryUsers.map((item) => (
                                <div
                                    key={item.filter}
                                    onClick={() => handleFilter(item.filter)}
                                    className={`w-full h-24 px-5 bg-${item.color}-300/60 dark:bg-${item.color}-800/50 rounded-xl flex items-center justify-between border border-${item.color}-500/50 dark:border-white/10 shadow-sm shadow-${item.color}-500/50 hover:scale-105 transition-transform cursor-pointer duration-500  dark:hover:bg-${item.color}-700`}>
                                    <div className="">
                                        <p className="text-gray-600 dark:text-white/60">{item.label}</p>
                                        <h3 className="text-3xl font-bold text-slate-700 dark:text-white/80">{item.value}</h3>
                                    </div>
                                    <div className={`w-10 h-10 flex items-center justify-center bg-${item.color}-500 text-white rounded-full`}>{item.icon}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Stats Summary */}
                    {/* <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-white/10">
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
                    </div> */}
                </div>
            </div>
            <div className="flex items-center px-5 gap-2 md:gap-5 flex-wrap">
                <Link href={`/flashcard/practice/${id_flashcard}`} className="flex-1">
                    <Button variant="outline" className=" w-full h-16 dark:text-white text-md md:text-xl uppercase">
                        <Target /> ôn từ vựng
                    </Button>
                </Link>

                {user?._id === String(listFlashcard?.userId?._id) && (
                    <>
                        <AddVocaModal token={token} filteredFlashcards={filteredFlashcards} setFilteredFlashcards={setFilteredFlashcards} listFlashcard={listFlashcard}>
                            <Button className="dark:text-white h-16 text-md md:text-xl uppercase bg-gradient-to-r from-indigo-500 to-purple-500 text-white md:px-10">
                                <Plus size={24} /> Thêm từ vựng
                            </Button>
                        </AddVocaModal>
                        <Link href={`/flashcard/practice-science`} className="flex-1">
                            <Button variant="outline" className="w-full h-16 dark:text-white text-md md:text-xl uppercase">
                                <Gift></Gift>
                                Luyện tập
                            </Button>
                        </Link>
                    </>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:p-5 w-full px-3">
                {filteredFlashcards && filteredFlashcards?.length > 0 ? (
                    filteredFlashcards.map((item: Flashcard) => (
                        <VocaCardItem
                            key={item._id}
                            data={item}
                            speakWord={speakWord}
                            loadingAudio={loadingAudio}
                            handleDelete={handleDelete}
                            loadingConfirm={loadingConfirm}
                            setLoadingConfirm={setLoadingConfirm}
                        />
                    ))
                ) : (
                    <div className="col-span-3 text-center h-[80vh] flex flex-col gap-2 items-center justify-center">
                        <h1 className="text-xl">Không có từ vựng nào trong flashcard này</h1>
                        <p className="text-gray-500 ">Bạn hãy bấm vào nút thêm từ vựng để học nhé</p>
                    </div>
                )}
            </div>
        </div>
    );
}
