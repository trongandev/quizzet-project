"use client";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Switch, message } from "antd";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { BiSlideshow } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { TbConfetti } from "react-icons/tb";
import { BsCheckCircleFill, BsEmojiAstonished, BsEmojiDizzy, BsEmojiExpressionless, BsEmojiFrown, BsEmojiLaughing, BsEmojiNeutral, BsEmojiSunglasses, BsXCircleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { ArrowLeft, Eye, MoveDown, MoveRight, Send, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Flashcard } from "@/types/type";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
const rateOptions = [
    {
        label: "Quên hoàn toàn",
        mean: "Bạn không nhớ gì cả, hoàn toàn quên từ này.",
        color: "bg-red-600 hover:bg-red-700 text-red-400",
        icon: BsEmojiDizzy,
    },
    {
        label: "Rất khó nhớ",
        mean: "Bạn trả lời sai, nhưng có chút nhận biết khi thấy đáp án.",
        color: "bg-red-500 hover:bg-red-600 text-red-200",
        icon: BsEmojiFrown,
    },
    {
        label: "Khó nhớ",
        mean: "Bạn trả lời sai, nhưng thấy dễ nhớ khi nhìn đáp án.",
        color: "bg-orange-500 hover:bg-orange-600 text-orange-200",
        icon: BsEmojiExpressionless,
    },
    {
        label: "Bình thường",
        mean: "Bạn trả lời đúng, nhưng có chút do dự.",
        color: "bg-yellow-500 hover:bg-yellow-600 text-yellow-200",
        icon: BsEmojiNeutral,
    },
    {
        label: "Dễ nhớ",
        mean: "Bạn trả lời đúng, chỉ có chút do dự nhỏ.",
        color: "bg-green-500 hover:bg-green-600 text-green-200",
        icon: BsEmojiLaughing,
    },
    {
        label: "Hoàn hảo",
        mean: "Bạn trả lời đúng hoàn hảo, không chút do dự.",
        color: "bg-emerald-600 hover:bg-emerald-700 text-emerald-200",
        icon: BsEmojiSunglasses,
    },
];

export default function PractiveFlashcard({ params }: { params: { slug: string } }) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>(); // Danh sách flashcards
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // Vị trí hiện tại trong danh sách flashcards
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [voicePerson, setVoicePerson] = useState<any>(); // Giọng nói mặc định được lấy trong localStorage
    const [sessionRatings, setSessionRatings] = useState<Array<{ id: string; quality: number; userId: string }>>([]); // Mảng lưu trữ các đánh giá trong phiên
    const token = Cookies.get("token") || "";
    const { user } = useUser() || {};
    const userId = user?._id || "";
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const fetchAndInitialize = async () => {
            const req = await GET_API(`/flashcards/practice`, token);
            if (req.ok) {
                const savedVoiceString = JSON.parse(localStorage.getItem("defaultVoices") || "");
                const savedVoices = savedVoiceString[req?.listFlashCards?.language];
                setVoicePerson(savedVoices ? savedVoices : "en-US-GuyNeural");

                setFlashcards(req?.listFlashCards);
                // Auto-play audio for first card if it's flashcard
                // if (req?.listFlashCards) {
                //     await speakWord(req?.listFlashCards?.flashcards[0].title);
                // }
            } else {
                toast.error("Lỗi khi tải flashcards: ", {
                    description: req?.message,
                    duration: 5000,
                    position: "top-center",
                });
            }
        };
        fetchAndInitialize();
        setLoading(false);
    }, [params?.slug, token]);

    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }));

    const speakWord = useCallback(
        async (text: string) => {
            try {
                setLoadingAudio(true);
                const response = await tts.create({
                    input: text,
                    options: {
                        voice: voicePerson,
                    },
                });

                const audioBuffer = await response.arrayBuffer();
                const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                audio.addEventListener("ended", () => {
                    URL.revokeObjectURL(url);
                });

                await audio.play();
            } catch (error) {
                console.error("TTS Error:", error);
                toast.error("Lỗi khi phát âm thanh:", {
                    description: error instanceof Error ? error.message : "Lỗi không xác định",
                    duration: 5000,
                    position: "top-center",
                });
            } finally {
                setTimeout(() => {
                    setLoadingAudio(false);
                }, 500);
            }
        },
        [tts, voicePerson]
    );

    // Keyboard handlers
    const handleKeyDown = useCallback(
        (e: any) => {
            if (loadingAudio) return; // Nếu đang phát âm thanh, không xử lý phím
            if (e.key === "Enter") {
            } else if (e.key === "Shift") {
                if (flashcards && flashcards.length > 0) {
                    const currentCard = flashcards[currentIndex];
                    if (currentCard) {
                        speakWord(currentCard.title);
                    }
                }
            } else if (e.key === "1") {
                handleRate(0);
            } else if (e.key === "2") {
                handleRate(1); // Rate option 2 = index 1
            } else if (e.key === "3") {
                handleRate(2); // ✅ Sửa: Rate option 3 = index 2
            } else if (e.key === "4") {
                handleRate(3); // Rate option 4 = index 3
            } else if (e.key === "5") {
                handleRate(4); // Rate option 5 = index 4
            } else if (e.key === "6") {
                handleRate(5); // Rate option 6 = index 5
            }
        },
        [currentIndex, flashcards]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading className="h-14 w-14" />
            </div>
        );
    }

    if ((!flashcards || !flashcards.length) && !loading) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3 text-gray-500 dark:text-gray-400">
                <BiSlideshow size={50} className="" />
                <p className="">Bạn chăm chỉ quá ^^</p>
                <p className="">Bạn đã học hết các từ vựng hôm nay, hãy chờ tới ngày mai</p>
                <h1>Quay lại và thêm từ mới nàooooo!</h1>
                <div className="flex gap-5 items-center">
                    <Button variant="secondary" onClick={() => router.back()}>
                        <ArrowLeft /> Quay lại
                    </Button>
                    {/* <Button variant="secondary" onClick={() => router.push(`/flashcard/practice/${params.slug}`)}>
                        <Target /> Ôn tập từ
                    </Button> */}
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    // === 3. Xử lý đánh giá chất lượng thẻ (0-5) ===
    const handleRate = (quality: number) => {
        if (loadingAudio) return;
        if (flashcards && flashcards.length === 0) return;

        // ✅ Tạo rating mới
        const newRating = { id: flashcards[currentIndex]._id, quality: quality, userId: userId };

        // ✅ Tính toán array mới trực tiếp
        const updatedSessionRatings = [...sessionRatings, newRating];

        // ✅ Update state
        setSessionRatings(updatedSessionRatings);

        toast.success(`Đã đánh giá thẻ với chất lượng ${quality}`, {
            duration: 3000,
            position: "top-center",
        });

        // Chuyển sang thẻ tiếp theo
        setIsFlipped(false);
        speakWord((flashcards && flashcards[currentIndex + 1]?.title) || "");

        if (flashcards && currentIndex < flashcards.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
            // ✅ Sử dụng updatedSessionRatings thay vì sessionRatings
            if (updatedSessionRatings.length > 0) {
                setIsSuccess(true);
                toast.success("Đã hoàn thành phiên ôn tập!", {
                    duration: 5000,
                });
                // ✅ Truyền updatedSessionRatings vào function
                handleCompleteSession(updatedSessionRatings);
            }
        }

        // // // Tùy chọn: Tự động gửi dữ liệu sau mỗi N thẻ
        // if (updatedSessionRatings.length + 1 >= 5) {
        //     // Ví dụ: gửi sau mỗi 5 thẻ
        //     console.log("gửi the");

        //     handleCompleteSession(); // Gửi các đánh giá hiện có
        // }
    };

    // ✅ Update handleCompleteSession để nhận parameter
    const handleCompleteSession = async (ratingsToSend?: Array<{ id: string; quality: number; userId: string }>) => {
        // ✅ Sử dụng parameter hoặc fallback về state
        const dataToSend = ratingsToSend || sessionRatings;

        if (dataToSend.length === 0) {
            toast.error("Không có đánh giá nào để gửi");
            return;
        }

        setSessionRatings([]); // Clear state
        setCurrentIndex(1); // Reset current index

        toast.loading("Đang gửi dữ liệu ôn tập...", {
            duration: 5000,
            position: "top-center",
            id: "send-session",
        });

        try {
            const res = await POST_API(`/flashcards/batch-rate`, { cards: dataToSend }, "PUT", token);
            const result = await res?.json();

            if (res?.ok) {
                toast.success("Đã gửi dữ liệu ôn tập thành công!", {
                    duration: 10000,
                    position: "top-center",
                    id: "send-session",
                });

                setCurrentIndex(0);
                setFlashcards((prev) => (prev ? prev.slice(dataToSend.length) : []));
            } else {
                toast.error(`Lỗi khi gửi dữ liệu ôn tập: ${result?.message || "Lỗi không xác định."}`, {
                    duration: 5000,
                    position: "top-center",
                    id: "send-session",
                });
            }
        } catch (error: any) {
            console.error("Lỗi khi gửi batch-rate:", error.message || "Lỗi không xác định.");
            toast.error(`Lỗi khi gửi dữ liệu ôn tập`, {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
                duration: 5000,
                position: "top-center",
                id: "send-session",
            });
        }
    };

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3 text-gray-500 dark:text-gray-400">
                <TbConfetti size={50} className="" />
                <p className="">Chúc mừng bạn đã hoàn thành phiên ôn tập!</p>
                <p className="">Hãy tiếp tục học tập và nâng cao kiến thức của mình nhé!</p>
                <Button variant="secondary" onClick={() => router.back()}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className=" py-5 pt-20  w-full">
                <div className="px-3 md:px-20 focus-visible:outline-none text-third dark:text-white min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
                    <div className="w-full flex items-center justify-center h-[90%] flex-col gap-5">
                        <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                            <div className="w-full flex flex-col gap-5">
                                {/* Main Flashcard Container */}
                                <div
                                    className="relative w-full h-[500px] border border-white/10  shadow-md bg-white text-white dark:bg-slate-800/50 rounded-md"
                                    style={{ perspective: "1000px" }}
                                    onClick={() => setIsFlipped(!isFlipped)}>
                                    {/* Flashcard Feature */}
                                    <div
                                        className={`cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                                        style={{ transformStyle: "preserve-3d" }}>
                                        {/* Front Side */}
                                        <div
                                            className="absolute inset-0 bg-white dark:bg-slate-800/50 rounded-md flex flex-col items-center justify-center backface-hidden p-5"
                                            style={{ backfaceVisibility: "hidden" }}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <p className="text-2xl font-semibold text-slate-800 dark:text-white/80">{currentCard.title}</p>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        speakWord(currentCard?.title);
                                                    }}
                                                    className="h-10 w-10 dark:text-white rounded-full"
                                                    disabled={loadingAudio}
                                                    variant="outline">
                                                    {loadingAudio ? <Loading /> : <HiMiniSpeakerWave size={24} />}
                                                </Button>
                                            </div>
                                            <p className="text-gray-500 dark:text-white text-lg font-bold">{currentCard?.transcription}</p>

                                            <p className="text-gray-500 text-sm">(Click to flip)</p>
                                        </div>

                                        {/* Back Side */}
                                        <div
                                            className="absolute inset-0 bg-white rounded-md dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}>
                                            {isFlipped && <p className="text-lg text-gray-700 dark:text-white">{currentCard?.define}</p>}

                                            {currentCard?.example && (
                                                <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg w-full text-third dark:text-white/70">
                                                    {isFlipped && (
                                                        <>
                                                            {" "}
                                                            <p className="font-medium mb-2  ">Ví dụ:</p>
                                                            <div className="mb-2">
                                                                <p className="font-bold italic">{currentCard?.example[0]?.en}</p>
                                                                <p className="italic">{currentCard?.example[0]?.vi}</p>
                                                            </div>
                                                            <div className="mb-2">
                                                                <p className="font-bold italic">{currentCard?.example[1]?.en}</p>
                                                                <p className="italic">{currentCard?.example[1]?.vi}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Controls */}
                                <div className="bg-white rounded-md overflow-hidden w-full flex shadow-md text-2xl border border-white/10 dark:bg-slate-800/50">
                                    {rateOptions.map((option, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger className="w-full">
                                                <div
                                                    key={index}
                                                    className={`flex-1 w-full p-3 hover:${option.color} text-white flex flex-col gap-1 justify-center items-center cursor-pointer `}
                                                    onClick={() => handleRate(index)}>
                                                    <option.icon />
                                                    <p className="text-sm">
                                                        {index + 1}: {option.label}
                                                    </p>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs dark:text-gray-200 text-gray-500">{option.mean}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Selection Panel */}
                            <div className="w-full md:w-auto flex flex-col gap-4">
                                <div className="space-y-2">
                                    <h2 className="font-medium">Chế độ học</h2>

                                    <Button className="dark:text-white" variant="secondary" disabled>
                                        FLASHCARD
                                    </Button>
                                </div>

                                {/* Progress Display */}
                                <div className="space-y-2">
                                    <h2 className="font-medium">Tiến trình</h2>
                                    <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span>Tổng số câu</span>
                                            <span>{`${currentIndex + 1}/${flashcards.length}`}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full">
                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Keyboard Shortcuts Guide */}
                                <div className="space-y-2 md:w-[250px]">
                                    <h2 className="font-medium">Phím tắt</h2>
                                    <div className="bg-gray-100 dark:text-white/50 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3">
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                            <span className="">Lật thẻ </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Shift</kbd>
                                            <span className="">Phát âm</span>
                                        </div>
                                        {["Quên hoàn toàn", "Rất khó nhớ", "Khó nhớ", "Bình thường", "Dễ nhớ", "Hoàn hảo"].map((label, index) => (
                                            <div className="flex items-center gap-2" key={index}>
                                                <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">{index + 1}</kbd>
                                                <span className="text-sm">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className=""></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
