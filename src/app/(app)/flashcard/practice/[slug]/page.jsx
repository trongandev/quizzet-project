"use client";
import { GET_API } from "@/lib/fetchAPI";
import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Switch, message } from "antd";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { BiSlideshow } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Lightbulb, Send, Speaker, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
    LISTENING: 3,
    FILL_BLANK: 4,
};

export default function PractiveFlashcard({ params }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0);
    const [loadingAudio, setLoadingAudio] = useState(null);
    const [speakLang, setSpeakLang] = useState(1);
    const [feature, setFeature] = useState(FEATURES.FLASHCARD);
    const [showAns, setShowAns] = useState(false);
    const [flashcards, setFlashcards] = useState([]);
    const [inputAnswer, setInputAnswer] = useState("");
    const [progress, setProgress] = useState({ known: [], unknown: [] });
    const [quizOptions, setQuizOptions] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [voicePerson, setVoicePerson] = useState();
    // random moder
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [isRandomFeature, setIsRandomFeature] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isCorrectAns, setIsCorrectAns] = useState(null);
    const [language, setLanguage] = useState({});
    const router = useRouter();
    const shuffle = (array) => {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };
    // Fetch flashcards data

    useEffect(() => {
        const fetchFlashCards = async () => {
            const token = Cookies.get("token");
            const req = await GET_API(`/flashcards/${params?.slug}`, token);
            if (req.ok) {
                const result = req?.listFlashCards?.flashcards;

                setLanguage(req?.listFlashCards?.language);
                setFlashcards(shuffle(result));
                generateQuizOptions(result[0]);

                const savedVoiceString = JSON.parse(localStorage.getItem("defaultVoices") || "");
                const savedVoices = savedVoiceString[req?.listFlashCards?.language];
                setVoicePerson(savedVoices ? savedVoices : "en-US-GuyNeural");
            } else {
                messageApi.error(req.message);
            }
        };
        fetchFlashCards();
    }, [params?.slug]);

    useEffect(() => {
        if (flashcards.length > 0) {
            generateQuizOptions(flashcards[0]);
        }
    }, [flashcards]);

    const generateQuizOptions = useCallback(
        (currentCard) => {
            if (!currentCard || flashcards.length < 4) return;

            // Đáp án đúng
            const correctOption = currentCard.title;

            // Các đáp án sai
            const availableCards = flashcards.filter((card) => card._id !== currentCard._id);
            const wrongOptions = [];
            while (wrongOptions.length < 3 && availableCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCards.length);
                wrongOptions.push(availableCards[randomIndex].title);
                availableCards.splice(randomIndex, 1);
            }

            // Trộn đáp án đúng và đáp án sai
            const options = [correctOption, ...wrongOptions];
            setQuizOptions(options.sort(() => Math.random() - 0.5));
        },
        [flashcards]
    );

    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }));

    const speakWord = useCallback(
        async (text, id) => {
            try {
                setLoadingAudio(id);
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
                messageApi.error("Lỗi khi phát âm thanh: " + error.message);
            } finally {
                setLoadingAudio(null);
            }
        },
        [tts, voicePerson, messageApi]
    );

    // Navigation handlers
    const handleChangeIndex = useCallback(
        async (type) => {
            let newIndex;

            // if (isRandomMode) {
            //     // Generate random index different from current
            //     do {
            //         newIndex = Math.floor(Math.random() * flashcards.length);
            //     } while (newIndex === index && flashcards.length > 1);
            // } else {
            // }
            newIndex = type === "next" ? (index < flashcards.length - 1 ? index + 1 : 0) : index > 0 ? index - 1 : flashcards.length - 1;

            setIndex(newIndex);
            setIsFlipped(false);
            setInputAnswer("");
            setShowAns(false);

            if (feature === FEATURES.FLASHCARD || feature === FEATURES.LISTENING) {
                await speakWord(flashcards[newIndex].title, flashcards[newIndex]._id);
            }

            generateQuizOptions(flashcards[newIndex]);
        },
        [index, flashcards, feature, isRandomMode, isRandomFeature]
    );

    // Progress tracking
    const handleProgress = useCallback(
        (type) => {
            const currentId = flashcards[index]._id;
            if (type === "known") {
                setProgress((prev) => ({
                    ...prev,
                    known: [...new Set([...prev.known, currentId])],
                    unknown: prev.unknown.filter((id) => id !== currentId),
                }));
                handleChangeIndex("next");
            } else {
                setProgress((prev) => ({
                    ...prev,
                    unknown: [...new Set([...prev.unknown, currentId])],
                    known: prev.known.filter((id) => id !== currentId),
                }));
                handleChangeIndex("prev");
            }
        },
        [index, flashcards]
    );

    const handlePlayAudio = (method) => {
        if (method == "correct") {
            const audio = new Audio("/audio/correct.mp3");
            audio.play();
        } else if (method == "wrong") {
            const audio = new Audio("/audio/wrong.mp3");
            audio.play();
        }
    };

    // Quiz answer handler
    const handleQuizAnswer = async (selectedAnswer, idx) => {
        const isCorrect = selectedAnswer === flashcards[index].title;
        messageApi[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai rồi, thử lại nhé! ^^");
        setSelectedAnswers({
            ...selectedAnswers,
            [idx]: isCorrect ? "correct" : "incorrect",
        });
        if (isCorrect) {
            handlePlayAudio("correct");
            await speakWord(flashcards[index].title, flashcards[index]._id);

            setTimeout(() => {
                handleProgress("known");
                setSelectedAnswers({});
            }, 1000);
        } else {
            handlePlayAudio("wrong");
            setTimeout(() => {
                setSelectedAnswers((prev) => ({
                    ...prev,
                    [idx]: null,
                }));
            }, 820);
        }
    };

    // Listening practice handler
    const checkListeningAnswer = useCallback(() => {
        const isCorrect = inputAnswer.toLowerCase() === flashcards[index].title.toLowerCase();
        messageApi[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai rồi, thử lại nhé! ^^");
        setIsCorrectAns(isCorrect ? "correct" : "incorrect");
        if (isCorrect) {
            handlePlayAudio("correct");
            setTimeout(() => {
                handleProgress("known");
                setIsCorrectAns(null); // Reset về null thay vì false
            }, 1000);
        } else {
            handlePlayAudio("wrong");
            setTimeout(() => {
                setIsCorrectAns(null);
            }, 820);
        }
    }, [inputAnswer, flashcards, index, messageApi, handleProgress]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                    handleChangeIndex("prev");
                    break;
                case "arrowright":
                    handleChangeIndex("next");
                    break;
                case " ":
                    e.preventDefault();
                    if (feature === FEATURES.FLASHCARD) {
                        setIsFlipped((prev) => !prev);
                    } else if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        setShowAns((prev) => !prev);
                        if (!showAns) {
                            setInputAnswer(flashcards[index].title); // Hiển thị đáp án khi bấm space
                        }
                    }
                    break;
                case "enter":
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        checkListeningAnswer();
                    }
                    break;
                case "shift":
                    // Phát âm thanh với accent đang được chọn
                    speakWord(flashcards[index]?.title, flashcards[index]?._id);
                    break;
            }
        },
        [feature, handleChangeIndex, checkListeningAnswer, handleProgress]
    );

    if (!flashcards.length) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3">
                <p className="text-gray-500">Vui lòng thêm từ mới vào danh sách flashcard.</p>
                <BiSlideshow size={50} className="text-gray-400" />
                <h1>Không có từ nào trong bộ flashcard này</h1>
                <Button variant="secondary" onClick={() => router.back()}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="relative z-10  dark:bg-slate-700 py-5 px-3 flex justify-center items-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] focus-visible:outline-none min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
                {contextHolder}
                <div className="w-full flex items-center justify-center h-[90%] flex-col gap-2 md:pt-14">
                    <Button className="w-full md:w-auto block md:hidden" variant="outline" onClick={() => router.back()}>
                        <ArrowLeft /> Quay lại
                    </Button>

                    {/* Progress Display */}
                    <div className="space-y-2 block md:hidden w-full">
                        <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span>Đã học:</span>
                                <span>{progress.known.length}</span>
                            </div>

                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${(progress.known.length / flashcards.length) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-full flex flex-col gap-5">
                            {/* Main Flashcard Container */}
                            <div
                                className=" relative w-full h-[500px] border border-white/10 rounded-md  shadow-md bg-white dark:bg-slate-800/50 dark:text-white"
                                style={{ perspective: "1000px" }}
                                onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}>
                                {/* Flashcard Feature */}
                                {feature === FEATURES.FLASHCARD && (
                                    <div
                                        className={`rounded-lg  cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                                        style={{ transformStyle: "preserve-3d" }}>
                                        {/* Front Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5"
                                            style={{ backfaceVisibility: "hidden" }}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <p className="text-2xl font-semibold">{flashcards[index]?.title}</p>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        speakWord(flashcards[index]?.title, flashcards[index]?._id);
                                                    }}
                                                    className=""
                                                    variant="secondary">
                                                    {loadingAudio === flashcards[index]?._id ? <Spin indicator={<LoadingOutlined spin />} /> : <HiMiniSpeakerWave size={24} />}
                                                </Button>
                                            </div>
                                            <p className="text-gray-500 text-lg font-bold">{flashcards[index]?.transcription}</p>

                                            <p className="text-gray-500 text-sm">(Click to flip)</p>
                                        </div>

                                        {/* Back Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}>
                                            {isFlipped && <p className="text-lg ">{flashcards[index]?.define}</p>}

                                            {flashcards[index]?.example && (
                                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-800/50 dark:text-yellow-200 rounded-lg w-full">
                                                    {isFlipped && (
                                                        <>
                                                            {" "}
                                                            <p className="font-medium mb-2 inline-flex gap-2 items-center">
                                                                <Lightbulb />
                                                                Ví dụ:
                                                            </p>
                                                            <div className="text-yellow-800 dark:text-yellow-400/80">
                                                                <div className="mb-2">
                                                                    <p className="font-bold italic">{flashcards[index].example[0]?.en}</p>
                                                                    <p className="italic">{flashcards[index].example[0]?.vi}</p>
                                                                </div>
                                                                <div className="mb-2">
                                                                    <p className="font-bold italic">{flashcards[index].example[1]?.en}</p>
                                                                    <p className="italic">{flashcards[index].example[1]?.vi}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Quiz Feature */}
                                {feature === FEATURES.QUIZ && (
                                    <div className="p-5 h-full flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <h1 className="text-xl font-bold ">Chọn đáp án đúng</h1>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
                                        </div>
                                        <p className=" mb-4 text-gray-500"> (nếu không có đáp án đúng vui lòng bấm bỏ qua)</p>
                                        <p className="text-lg mb-6">{flashcards[index]?.define}</p>
                                        <div className="grid grid-cols-2 gap-5 flex-1">
                                            {quizOptions.map((option, idx) => (
                                                <Button
                                                    key={idx}
                                                    onClick={() => handleQuizAnswer(option, idx)}
                                                    disabled={selectedAnswers[idx]}
                                                    variant="secondary"
                                                    className={`h-full relative text-gray-700 dark:text-white  transition-colors
                                                                ${selectedAnswers[idx] === "correct" ? "!border-green-500 border-2 tada" : ""}
                                                                ${selectedAnswers[idx] === "incorrect" ? "!border-red-500 border-2 shake" : ""}
                                            `}>
                                                    <div className="absolute top-1 left-1 h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-900 dark:text-white   dark:bg-slate-900/50">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="flex-1 text-center px-2">{option}</p>
                                                </Button>
                                            ))}
                                            {quizOptions.length < 4 && <p className="text-red-500">Cảnh báo: Chưa đủ đáp án để trộn ngẫu nhiên (Yêu cầu trên 4)</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Listening Feature */}
                                {feature === FEATURES.LISTENING && (
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h1 className="text-xl font-bold ">Nghe và điền từ</h1>
                                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Listening</span>
                                        </div>
                                        <div className="flex gap-4 mb-6">
                                            <Button onClick={() => speakWord(flashcards[index]?.title, flashcards[index]?._id)} className="" variant="outline">
                                                <Volume2 />
                                            </Button>
                                        </div>
                                        <div className="flex-1">
                                            <p className=" mb-2">Định nghĩa:</p>
                                            <p className="text-gray-600 dark:text-white/70 mb-4">{flashcards[index]?.define}</p>
                                            <Input
                                                type="text"
                                                value={inputAnswer}
                                                onChange={(e) => setInputAnswer(e.target.value)}
                                                placeholder="Điền từ bạn nghe được"
                                                autoFocus
                                                className={`w-full h-14 dark:border-white/10 border outline-none focus-visible:ring-0 rounded-md transition-colors dark:bg-gray-500/50 text-third dark:text-white
            ${isCorrectAns === "correct" ? "!border-green-500 dark:!border-green-300 border-2" : ""}
            ${isCorrectAns === "incorrect" ? "!border-red-500 dark:!border-red-300 border-2 shake" : ""}
        `}
                                            />
                                            <div className="flex justify-end">
                                                <Button className="mt-3 text-white" onClick={checkListeningAnswer}>
                                                    <Send /> Kiểm tra
                                                </Button>
                                            </div>
                                        </div>
                                        <Button onClick={() => setInputAnswer(flashcards[index].title)} className="text-white" variant="outline" size="lg">
                                            <Eye />
                                            Hiển thị đáp án
                                        </Button>
                                    </div>
                                )}

                                {/* Fill in the blank Feature */}
                                {feature === FEATURES.FILL_BLANK && (
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h1 className="text-xl font-bold ">Điền từ còn thiếu</h1>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Practice</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className=" mb-4">{flashcards[index]?.define}</p>
                                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4">
                                                <p className="text-gray-600 dark:text-white/70 font-medium mb-2">Ví dụ:</p>
                                                <p className="text-lg">
                                                    {showAns ? flashcards[index]?.example?.[0]?.en : flashcards[index]?.example?.[0]?.en.replace(new RegExp(flashcards[index]?.title, "gi"), "______")}
                                                </p>
                                            </div>
                                            <Input
                                                type="text"
                                                value={inputAnswer}
                                                onChange={(e) => setInputAnswer(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === " ") {
                                                        e.stopPropagation(); // Prevent space key event from bubbling up
                                                    }
                                                }}
                                                placeholder="Điền từ còn thiếu..."
                                                autoFocus
                                                className={`h-14 dark:border-white/10 w-full border outline-none focus-visible:ring-0 rounded-md transition-colors dark:bg-gray-500/50 text-third dark:text-white
                                                ${isCorrectAns === "correct" ? "dark:!border-green-300 !border-green-500 border-2" : ""}
                                                ${isCorrectAns === "incorrect" ? "dark:!border-red-300 !border-red-500 border-2 shake" : ""}
                                            `}
                                            />
                                            <div className="flex justify-end mt-3">
                                                <Button className="text-white" onClick={checkListeningAnswer}>
                                                    <Send /> Kiểm tra
                                                </Button>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowAns(!showAns)} variant={showAns ? "outline" : "secondary"} className=" mt-4 text-white " size="lg">
                                            <Eye />
                                            {showAns ? "Ẩn đáp án" : "Hiển thị đáp án"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Controls */}

                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 rounded-md overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                                <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("unknown")}>
                                    <GrFormPrevious />
                                    <p className="text-sm">Lùi lại</p>
                                </div>
                                <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("known")}>
                                    <GrFormNext />
                                    <p className="text-sm">Tiến tới</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Selection Panel */}
                        <div className="w-full md:w-auto flex flex-col gap-4">
                            <div className="space-y-2">
                                <h2 className="font-medium">Cài đặt Random</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 dark:text-white">Bật Random</span>
                                            <Switch checked={isRandomMode} onChange={(checked) => setIsRandomMode(checked)} className="bg-gray-300 dark:bg-slate-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="font-medium">Chế độ học</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries({
                                        Flashcard: FEATURES.FLASHCARD,
                                        Quiz: FEATURES.QUIZ,
                                        Listening: FEATURES.LISTENING,
                                        "Fill Blank": FEATURES.FILL_BLANK,
                                    }).map(([name, value]) => (
                                        <Button className="dark:text-white" key={value} onClick={() => setFeature(value)} variant={feature === value ? "default" : "secondary"}>
                                            {name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Display */}
                            <div className="space-y-2 hidden md:block">
                                <h2 className="font-medium">Tiến trình</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span>Đã học:</span>
                                        <span>{progress.known.length}</span>
                                    </div>

                                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${(progress.known.length / flashcards.length) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Keyboard Shortcuts Guide */}
                            <div className="space-y-2">
                                <h2 className="font-medium">Phím tắt</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3 text-gray-500 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">→</kbd>
                                        <span className="">Tiến tới</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">←</kbd>
                                        <span className="">Lùi lại</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                        <span className="">Lật thẻ/Show đáp án</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Enter</kbd>
                                        <span className="">Kiểm tra đáp án</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Shift</kbd>
                                        <span className="">Phát âm thanh</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
