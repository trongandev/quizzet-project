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
    // random moder
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [isRandomFeature, setIsRandomFeature] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isCorrectAns, setIsCorrectAns] = useState(null);
    const [language, setLanguage] = useState({});
    // Fetch flashcards data
    useEffect(() => {
        const fetchFlashCards = async () => {
            const token = Cookies.get("token");
            const req = await GET_API(`/flashcards/${params?.slug}`, token);
            if (req.ok) {
                const result = req?.listFlashCards?.flashcards;
                setLanguage(req?.listFlashCards?.language);
                setFlashcards(result);
                generateQuizOptions(result[0]);
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

    const randomizeFeature = useCallback(() => {
        const features = [FEATURES.FLASHCARD, FEATURES.QUIZ, FEATURES.LISTENING, FEATURES.FILL_BLANK];
        const randomIndex = Math.floor(Math.random() * features.length);
        setFeature(features[randomIndex]);
    }, []);

    // Generate quiz options
    // const generateQuizOptions = useCallback(
    //     (currentCard) => {
    //         if (!currentCard || flashcards.length < 4) return;

    //         const options = [currentCard];
    //         const availableCards = flashcards.filter((card) => card._id !== currentCard._id);

    //         while (options.length < 4 && availableCards.length > 0) {
    //             const randomIndex = Math.floor(Math.random() * availableCards.length);
    //             options.push(availableCards[randomIndex]);
    //             availableCards.splice(randomIndex, 1);
    //         }

    //         // Shuffle options
    //         setQuizOptions(options.sort(() => Math.random() - 0.5));
    //     },
    //     [flashcards]
    // );

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

    // Handle audio playback
    const speakWord = async (text, type, id) => {
        setLoadingAudio(id);
        if (language == "english") {
            const req = await fetch(`${process.env.API_ENDPOINT}/proxy?audio=${text}&type=${type}`);
            const blob = await req.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
        } else {
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                if (language == "japan") utterance.lang = "ja-JP"; // Thiết lập ngôn ngữ tiếng Nhật
                if (language == "korea") utterance.lang = "ko-KR"; // Thiết lập ngôn ngữ tiếng Hàn
                if (language == "chinese") utterance.lang = "zh-CN"; // Thiết lập ngôn ngữ tiếng Trung
                window.speechSynthesis.speak(utterance);
            } else {
                alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech.");
            }
        }
        setLoadingAudio(null);
    };

    // Navigation handlers
    const handleChangeIndex = useCallback(
        async (type) => {
            let newIndex;

            if (isRandomMode) {
                // Generate random index different from current
                do {
                    newIndex = Math.floor(Math.random() * flashcards.length);
                } while (newIndex === index && flashcards.length > 1);
            } else {
                newIndex = type === "next" ? (index < flashcards.length - 1 ? index + 1 : 0) : index > 0 ? index - 1 : flashcards.length - 1;
            }

            setIndex(newIndex);
            setIsFlipped(false);
            setInputAnswer("");
            setShowAns(false);

            if (isRandomFeature) {
                randomizeFeature();
            }

            if (feature === FEATURES.FLASHCARD || feature === FEATURES.LISTENING) {
                await speakWord(flashcards[newIndex].title, speakLang, flashcards[newIndex]._id);
            }

            if (feature === FEATURES.QUIZ) {
                generateQuizOptions(flashcards[newIndex]);
            }
        },
        [index, flashcards, feature, speakLang, isRandomMode, isRandomFeature, randomizeFeature]
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
            } else {
                setProgress((prev) => ({
                    ...prev,
                    unknown: [...new Set([...prev.unknown, currentId])],
                    known: prev.known.filter((id) => id !== currentId),
                }));
            }
            handleChangeIndex("next");
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
            await speakWord(flashcards[index].title, speakLang, flashcards[index]._id);

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
                    }
                    break;
                case "enter":
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        checkListeningAnswer();
                    }
                    break;
                case "shift":
                    // Phát âm thanh với accent đang được chọn
                    speakWord(flashcards[index]?.title, speakLang, flashcards[index]?._id);
                    break;
            }
        },
        [feature, handleChangeIndex, checkListeningAnswer, handleProgress]
    );

    if (!flashcards.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="px-3 md:px-0 focus-visible:outline-none" onKeyDown={handleKeyDown} tabIndex={0}>
            {contextHolder}
            <div className="w-full flex items-center justify-center h-[90%] flex-col gap-5">
                <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full flex flex-col gap-5">
                        {/* Main Flashcard Container */}
                        <div
                            className="relative w-full h-[500px] border rounded-xl shadow-md overflow-hidden bg-white"
                            style={{ perspective: "1000px" }}
                            onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}>
                            {/* Flashcard Feature */}
                            {feature === FEATURES.FLASHCARD && (
                                <div
                                    className={`cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                                    style={{ transformStyle: "preserve-3d" }}>
                                    {/* Front Side */}
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center backface-hidden p-5" style={{ backfaceVisibility: "hidden" }}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <p className="text-2xl font-semibold">{flashcards[index]?.title}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speakWord(flashcards[index]?.title, speakLang, flashcards[index]?._id);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-full">
                                                {loadingAudio === flashcards[index]?._id ? <Spin indicator={<LoadingOutlined spin />} /> : <HiMiniSpeakerWave size={24} />}
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-lg font-bold">{flashcards[index]?.transcription}</p>

                                        <p className="text-gray-500 text-sm">(Click to flip)</p>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-5 backface-hidden"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}>
                                        <p className="text-lg text-gray-700">{flashcards[index]?.define}</p>
                                        {flashcards[index]?.example && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                                                <p className="font-medium mb-2">Ví dụ:</p>
                                                <div className="mb-2">
                                                    <p className="font-bold italic text-gray-600">{flashcards[index].example[0]?.en}</p>
                                                    <p className="italic text-gray-600">{flashcards[index].example[0]?.vi}</p>
                                                </div>
                                                <div className="mb-2">
                                                    <p className="font-bold italic text-gray-600">{flashcards[index].example[1]?.en}</p>
                                                    <p className="italic text-gray-600">{flashcards[index].example[1]?.vi}</p>
                                                </div>
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
                                            <h1 className="text-xl font-bold text-gray-700">Chọn đáp án đúng</h1>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
                                    </div>
                                    <p className=" mb-4 text-gray-500"> (nếu không có đáp án đúng vui lòng bấm bỏ qua)</p>
                                    <p className="text-lg mb-6">{flashcards[index]?.define}</p>
                                    <div className="grid grid-cols-2 gap-5 flex-1">
                                        {quizOptions.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuizAnswer(option, idx)}
                                                className={`
                                              flex items-center h-full border rounded-lg group 
                                              hover:border-primary transition-colors
                                              ${selectedAnswers[idx] === "correct" ? "!border-green-500 border-2 tada" : ""}
                                              ${selectedAnswers[idx] === "incorrect" ? "!border-red-500 border-2 shake" : ""}
                                            `}>
                                                <div
                                                    className={`
                                              w-[50px] h-full flex items-center justify-center border-r
                                              group-hover:border-r-primary transition-colors
                                              ${selectedAnswers[idx] === "correct" ? "!border-r-green-500" : ""}
                                              ${selectedAnswers[idx] === "incorrect" ? "!border-r-red-500" : ""}
                                            `}>
                                                    {idx + 1}
                                                </div>
                                                <p className="flex-1 text-center px-2">{option}</p>
                                            </button>
                                        ))}
                                        {quizOptions.length < 4 && <p className="text-red-500">Cảnh báo: Chưa đủ đáp án để trộn ngẫu nhiên (Yêu cầu trên 4)</p>}
                                    </div>
                                </div>
                            )}

                            {/* Listening Feature */}
                            {feature === FEATURES.LISTENING && (
                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-xl font-bold text-gray-700">Nghe và điền từ</h1>
                                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Listening</span>
                                    </div>
                                    <div className="flex gap-4 mb-6">
                                        <button
                                            onClick={() => speakWord(flashcards[index]?.title, 1, flashcards[index]?._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-primary">
                                            <HiMiniSpeakerWave />
                                            <span>US</span>
                                        </button>
                                        <button
                                            onClick={() => speakWord(flashcards[index]?.title, 2, flashcards[index]?._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-primary">
                                            <HiMiniSpeakerWave />
                                            <span>UK</span>
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 mb-2">Định nghĩa:</p>
                                        <p className="text-gray-600 mb-4">{flashcards[index]?.define}</p>
                                        <input
                                            type="text"
                                            value={inputAnswer}
                                            onChange={(e) => setInputAnswer(e.target.value)}
                                            placeholder="Điền từ bạn nghe được"
                                            autoFocus
                                            className={`w-full p-3 border transition-colors
            ${isCorrectAns === "correct" ? "!border-green-500 border-2" : ""}
            ${isCorrectAns === "incorrect" ? "!border-red-500 border-2 shake" : ""}
        `}
                                        />
                                        <div className="flex justify-end">
                                            <button className="btn btn-primary mt-3 flex items-center  gap-2" onClick={checkListeningAnswer}>
                                                <IoSend /> Gửi
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => setInputAnswer(flashcards[index].title)} className="flex items-center gap-2 text-gray-600 hover:text-primary mt-4">
                                        <BiSlideshow />
                                        <span>Hiển thị đáp án</span>
                                    </button>
                                </div>
                            )}

                            {/* Fill in the blank Feature */}
                            {feature === FEATURES.FILL_BLANK && (
                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-xl font-bold text-gray-700">Điền từ còn thiếu</h1>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Practice</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 mb-4">{flashcards[index]?.define}</p>
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <p className="text-gray-600 font-medium mb-2">Ví dụ:</p>
                                            <p className="text-lg">
                                                {showAns ? flashcards[index]?.example?.[0]?.en : flashcards[index]?.example?.[0]?.en.replace(new RegExp(flashcards[index]?.title, "gi"), "______")}
                                            </p>
                                        </div>
                                        <input
                                            type="text"
                                            value={inputAnswer}
                                            onChange={(e) => setInputAnswer(e.target.value)}
                                            placeholder="Điền từ còn thiếu..."
                                            autoFocus
                                            className={`w-full p-3 border transition-colors
                                                ${isCorrectAns === "correct" ? "!border-green-500 border-2" : ""}
                                                ${isCorrectAns === "incorrect" ? "!border-red-500 border-2 shake" : ""}
                                            `}
                                        />
                                        <div className="flex justify-end">
                                            <button className="btn btn-primary mt-3 flex items-center  gap-2" onClick={checkListeningAnswer}>
                                                <IoSend /> Gửi
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAns(!showAns)} className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-4">
                                        <BiSlideshow />
                                        <span>{showAns ? "Ẩn đáp án" : "Hiển thị đáp án"}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Navigation Controls */}

                        <div className="bg-gray-100 rounded-xl overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                            {/* <div
                                className="flex-1 p-3 h-full hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer"
                                onClick={() => handleChangeIndex("prev")}>
                                <GrFormPrevious />

                                <p className="text-sm">Lùi lại</p>
                            </div> */}
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("unknown")}>
                                <GrFormPrevious />
                                <p className="text-sm">Chưa biết</p>
                            </div>
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("known")}>
                                <GrFormNext />
                                <p className="text-sm">Đã biết</p>
                            </div>

                            {/* <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleChangeIndex("next")}>
                                <GrFormNext />
                                <p className="text-sm">Tiến tới</p>
                            </div> */}
                        </div>
                    </div>

                    {/* Feature Selection Panel */}
                    <div className="w-full md:w-auto flex flex-col gap-4">
                        {feature === FEATURES.FLASHCARD && language == "english" && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <HiMiniSpeakerWave size={20} />
                                    <span>Phát âm giọng UK, US</span>
                                </div>
                                <Switch
                                    checkedChildren={speakLang === 1 && "US"}
                                    unCheckedChildren={speakLang === 2 && "UK"}
                                    checked={speakLang === 1}
                                    onChange={(checked) => setSpeakLang(checked ? 1 : 2)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <h2 className="font-medium">Cài đặt Random</h2>
                            <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Random câu hỏi</span>
                                        <Switch checked={isRandomMode} onChange={(checked) => setIsRandomMode(checked)} className="bg-gray-300" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Random chế độ học</span>
                                        <Switch checked={isRandomFeature} onChange={(checked) => setIsRandomFeature(checked)} className="bg-gray-300" />
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
                                    <button
                                        key={value}
                                        onClick={() => setFeature(value)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${feature === value ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Progress Display */}
                        <div className="space-y-2">
                            <h2 className="font-medium">Tiến trình</h2>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span>Hiểu:</span>
                                    <span>{progress.known.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Chưa hiểu:</span>
                                    <span>{progress.unknown.length}</span>
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                            <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white rounded shadow text-sm">→</kbd>
                                    <span className="text-gray-600">Hiểu</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white rounded shadow text-sm">←</kbd>
                                    <span className="text-gray-600">Không biết</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white rounded shadow text-sm">Space</kbd>
                                    <span className="text-gray-600">Lật thẻ </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white rounded shadow text-sm">Enter</kbd>
                                    <span className="text-gray-600">Kiểm tra đáp án</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white rounded shadow text-sm">Shift</kbd>
                                    <span className="text-gray-600">Phát âm thanh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
