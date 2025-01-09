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
import { BsCheckCircleFill, BsEmojiAstonished, BsEmojiFrown, BsEmojiLaughing, BsXCircleFill } from "react-icons/bs";
const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
    LISTENING: 3,
    FILL_BLANK: 4,
};

const KNOWLEDGE_LEVELS = {
    UNKNOWN: "unknown", // Need 3 more reviews
    FAMILIAR: "familiar", // Need 2 more reviews
    KNOWN: "known", // Mastered
};

export default function PractiveFlashcard({ params }) {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feature, setFeature] = useState(FEATURES.FLASHCARD);
    const [isFlipped, setIsFlipped] = useState(false);
    const [inputAnswer, setInputAnswer] = useState("");
    const [showAns, setShowAns] = useState(false);
    const [quizOptions, setQuizOptions] = useState([]);
    const [isCorrectAns, setIsCorrectAns] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [language, setLanguage] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [speakLang, setSpeakLang] = useState(1);
    const [isCheckAns, setIsCheckAns] = useState(false);
    const [remainingFeatures, setRemainingFeatures] = useState({});
    const [wordRepetitions, setWordRepetitions] = useState({});
    const [sessionData, setSessionData] = useState({
        reviewQueue: [],
        masteredWords: new Set(),
        wordStatus: {},
        startTime: new Date(),
    });

    const fetchAndInitialize = async () => {
        const token = Cookies.get("token");
        const req = await GET_API(`/flashcards/${params?.slug}`, token);
        if (req.ok) {
            const shuffledCards = [...req?.listFlashCards?.flashcards].sort(() => Math.random() - 0.5);

            // Initialize all state objects first
            const initialStatus = {};
            const initialFeatures = {};
            const initialRepetitions = {};

            // Then populate them
            shuffledCards.forEach((card) => {
                initialStatus[card._id] = {
                    reviewsNeeded: 0,
                    correctAnswers: 0,
                    incorrectAnswers: 0,
                    featuresCompleted: [],
                };
                initialFeatures[card._id] = [FEATURES.QUIZ, FEATURES.LISTENING, FEATURES.FILL_BLANK];
                initialRepetitions[card._id] = 0;
            });

            // Now set all states
            setFlashcards(shuffledCards);
            setLanguage(req?.listFlashCards?.language);
            setSessionData((prev) => ({
                ...prev,
                wordStatus: initialStatus,
            }));
            setRemainingFeatures(initialFeatures);
            setWordRepetitions(initialRepetitions);
            setFeature(FEATURES.FLASHCARD);
            generateQuizOptions(shuffledCards[0]);

            // Auto-play audio for first card if it's flashcard
            if (shuffledCards[0]) {
                await speakWord(shuffledCards[0].title, speakLang, shuffledCards[0]._id);
            }
        } else {
            messageApi.error(req.message);
        }
    };

    const generateQuizOptions = useCallback(
        (currentCard) => {
            if (!currentCard || flashcards?.length < 4) return;

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

    useEffect(() => {
        if (flashcards.length > 0) {
            generateQuizOptions(flashcards[0]);
        }
    }, [flashcards]);
    // Add this to useEffect
    useEffect(() => {
        fetchAndInitialize();
    }, [params?.slug]);

    // khi người dùng rời khỏi trang cũng là lúc gửi dữ liệu lên server
    useEffect(() => {
        return async () => {
            const progressData = {
                listId: params?.slug,
                cardsProgress: Object.entries(sessionData.wordStatus).map(([cardId, status]) => ({
                    flashcardId: cardId,
                    sessionData: {
                        correctAnswers: status.correctAnswers,
                        incorrectAnswers: status.incorrectAnswers,
                        timeSpent: new Date() - sessionData.startTime,
                        masteryLevel: status.correctAnswers >= 2 ? "known" : status.correctAnswers >= 1 ? "familiar" : "unknown",
                    },
                })),
            };
            console.log(progressData);
        };
    }, []);

    // Handle knowledge level selection
    const handleKnowledgeLevel = async (level) => {
        const currentCard = flashcards[currentIndex];
        const status = sessionData.wordStatus[currentCard._id];

        // Set repetitions based on knowledge level
        const repetitionsNeeded = {
            [KNOWLEDGE_LEVELS.UNKNOWN]: 3,
            [KNOWLEDGE_LEVELS.FAMILIAR]: 2,
            [KNOWLEDGE_LEVELS.KNOWN]: 1,
        }[level];

        setWordRepetitions((prev) => ({
            ...prev,
            [currentCard._id]: repetitionsNeeded,
        }));

        generateQuizOptions(currentCard);

        // Update word status
        const newStatus = {
            ...status,
            lastReviewTime: new Date(),
            reviewsNeeded: repetitionsNeeded,
        };

        setSessionData((prev) => ({
            ...prev,
            wordStatus: {
                ...prev.wordStatus,
                [currentCard._id]: newStatus,
            },
        }));

        // Randomly select next feature (excluding FLASHCARD)
        const availableFeatures = remainingFeatures[currentCard._id];
        if (availableFeatures.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableFeatures.length);
            const nextFeature = availableFeatures[randomIndex];
            setFeature(nextFeature);
        }

        // Reset states
        setIsFlipped(false);
        setInputAnswer("");
        setShowAns(false);
        setIsCorrectAns(null);
    };

    const [disableAudio, setDisableAudio] = useState(false);

    // Handle audio playback
    const speakWord = async (text, type, id) => {
        if (disableAudio) return;
        else {
            setLoadingAudio(id);
            setDisableAudio(true);

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
            setDisableAudio(false);
        }
    };

    const handlePlayAudio = (method) => {
        if (method == "correct") {
            const audio = new Audio("/audio/correct.mp3");
            audio.play();
        } else if (method == "wrong") {
            const audio = new Audio("/audio/wrong.mp3");
            audio.play();
        }
    };

    const checkAnswer = useCallback(
        (givenAnswer, idx = null) => {
            setIsCheckAns(true);
            const currentCard = flashcards[currentIndex];
            const isCorrect = givenAnswer.toLowerCase() === currentCard.title.toLowerCase();
            setIsCorrectAns(isCorrect ? "correct" : "incorrect");
            messageApi[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai rồi, thử lại nhé! ^^");

            setSelectedAnswers({
                ...selectedAnswers,
                [idx]: isCorrect ? "correct" : "incorrect",
            });
            if (isCorrect) {
                handlePlayAudio("correct");
                if (feature === FEATURES.QUIZ) {
                    speakWord(currentCard.title, speakLang, currentCard._id);
                }
                const currentFeature = feature;
                const updatedFeatures = remainingFeatures[currentCard._id].filter((f) => f !== currentFeature);
                setRemainingFeatures((prev) => ({
                    ...prev,
                    [currentCard._id]: updatedFeatures,
                }));
                // Update word status
                setSessionData((prev) => ({
                    ...prev,
                    wordStatus: {
                        ...prev.wordStatus,
                        [currentCard._id]: {
                            ...prev.wordStatus[currentCard._id],
                            correctAnswers: prev.wordStatus[currentCard._id].correctAnswers + 1,
                            featuresCompleted: [...prev.wordStatus[currentCard._id].featuresCompleted, currentFeature],
                        },
                    },
                }));

                // Move to next word or feature
                setTimeout(() => {
                    if (updatedFeatures.length > 0) {
                        // Still has features to complete, randomly select next
                        const nextFeatureIndex = Math.floor(Math.random() * updatedFeatures.length);
                        setFeature(updatedFeatures[nextFeatureIndex]);
                    } else {
                        // All features completed for this word
                        setWordRepetitions((prev) => ({
                            ...prev,
                            [currentCard._id]: Math.max(0, prev[currentCard._id] - 1),
                        }));

                        // Move to next word if available
                        if (currentIndex < flashcards.length - 1) {
                            setCurrentIndex((prev) => prev + 1);
                            setFeature(FEATURES.FLASHCARD);
                        }
                    }
                    setIsCheckAns(false);
                    setSelectedAnswers({});
                    setIsCorrectAns(null);
                    setInputAnswer("");
                }, 1000);
            } else {
                handlePlayAudio("wrong");
                // Reset progress for current feature
                setTimeout(() => {
                    setIsCheckAns(false);
                    setInputAnswer("");
                    setIsCorrectAns(null);
                    if (idx !== null) {
                        setSelectedAnswers((prev) => ({
                            ...prev,
                            [idx]: null,
                        }));
                    }
                }, 820);
            }
        },
        [currentIndex, flashcards, feature, remainingFeatures, sessionData]
    );

    // Keyboard handlers
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter") {
                if (feature !== FEATURES.FLASHCARD && !isCheckAns) {
                    checkAnswer(inputAnswer);
                }
            } else if (e.key === "Shift") {
                const currentCard = flashcards[currentIndex];
                if (currentCard) {
                    speakWord(currentCard.title);
                }
            } else if (e.key === " " && feature === FEATURES.FLASHCARD) {
                e.preventDefault();
                setIsFlipped((prev) => !prev);
            }
        },
        [feature, checkAnswer, inputAnswer, currentIndex, flashcards]
    );
    const currentCard = flashcards[currentIndex];

    useEffect(() => {
        if (currentCard && feature === FEATURES.FLASHCARD) {
            setTimeout(() => {
                speakWord(currentCard.title, speakLang, currentCard._id);
            }, 500);
        }
    }, [feature, currentIndex]);

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
                            className="relative w-full h-[500px] border  shadow-md bg-white rounded-md"
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
                                            <p className="text-2xl font-semibold">{currentCard.title}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speakWord(currentCard?.title, speakLang, currentCard?._id);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                                disabled={loadingAudio}>
                                                {loadingAudio === currentCard?._id ? <Spin indicator={<LoadingOutlined spin />} /> : <HiMiniSpeakerWave size={24} />}
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-lg font-bold">{currentCard?.transcription}</p>

                                        <p className="text-gray-500 text-sm">(Click to flip)</p>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-5 backface-hidden"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}>
                                        {isFlipped && <p className="text-lg text-gray-700">{currentCard?.define}</p>}

                                        {currentCard?.example && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                                                {isFlipped && (
                                                    <>
                                                        {" "}
                                                        <p className="font-medium mb-2">Ví dụ:</p>
                                                        <div className="mb-2">
                                                            <p className="font-bold italic text-gray-600">{currentCard?.example[0]?.en}</p>
                                                            <p className="italic text-gray-600">{currentCard?.example[0]?.vi}</p>
                                                        </div>
                                                        <div className="mb-2">
                                                            <p className="font-bold italic text-gray-600">{currentCard?.example[1]?.en}</p>
                                                            <p className="italic text-gray-600">{currentCard?.example[1]?.vi}</p>
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
                                            <h1 className="text-xl font-bold text-gray-700">Chọn đáp án đúng</h1>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
                                    </div>
                                    <p className=" mb-4 text-gray-500"> (nếu không có đáp án đúng vui lòng bấm bỏ qua)</p>
                                    <p className="text-lg mb-6">{currentCard?.define}</p>
                                    <div className="grid grid-cols-2 gap-5 flex-1">
                                        {quizOptions.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => checkAnswer(option, idx)}
                                                disabled={selectedAnswers[idx]}
                                                className={`
                                              flex items-center h-full border rounded-lg group 
                                              hover:border-primary transition-colors disabled:!bg-transparent
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
                                            onClick={() => speakWord(currentCard?.title, 1, currentCard?._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-primary">
                                            <HiMiniSpeakerWave />
                                            <span>UK</span>
                                        </button>
                                        <button
                                            onClick={() => speakWord(currentCard?.title, 2, currentCard?._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-primary">
                                            <HiMiniSpeakerWave />
                                            <span>US</span>
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 mb-2">Định nghĩa:</p>
                                        <p className="text-gray-600 mb-4">{currentCard?.define}</p>
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
                                            <button className="btn btn-primary mt-3 flex items-center  gap-2" onClick={() => checkAnswer(inputAnswer)}>
                                                <IoSend /> Gửi
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => setInputAnswer(currentCard.title)} className="flex items-center gap-2 text-gray-600 hover:text-primary mt-4">
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
                                        <p className="text-gray-700 mb-4">{currentCard?.define}</p>
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <p className="text-gray-600 font-medium mb-2">Ví dụ:</p>
                                            <p className="text-lg">
                                                {showAns ? currentCard.example?.[0]?.en : currentCard.example?.[0]?.en.replace(currentCard.title.toLowerCase(), "_".repeat(currentCard.title.length))}
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
                                            <button className="btn btn-primary mt-3 flex items-center  gap-2" onClick={() => checkAnswer(inputAnswer)}>
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
                        {feature === FEATURES.FLASHCARD && (
                            <div className="bg-[#f3f4f6] rounded-md overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                                <div
                                    className="flex-1 p-3 hover:bg-[#FFCDD2] text-red-500 flex flex-col gap-1 justify-center items-center cursor-pointer"
                                    onClick={() => handleKnowledgeLevel("unknown")}>
                                    <BsEmojiFrown />
                                    <p className="text-sm">Chưa biết</p>
                                </div>
                                <div
                                    className="flex-1 p-3 hover:bg-[#FFF9C4] text-yellow-500  flex flex-col gap-1 justify-center items-center cursor-pointer"
                                    onClick={() => handleKnowledgeLevel("familiar")}>
                                    <BsEmojiAstonished />
                                    <p className="text-sm">Tương đối</p>
                                </div>
                                <div
                                    className="flex-1 p-3 hover:bg-[#C8E6C9] text-green-500 flex flex-col gap-1 justify-center items-center cursor-pointer"
                                    onClick={() => handleKnowledgeLevel("known")}>
                                    <BsEmojiLaughing />
                                    <p className="text-sm">Đã biết</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Feature Selection Panel */}
                    <div className="w-full md:w-auto flex flex-col gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <HiMiniSpeakerWave size={20} />
                                <span>Phát âm giọng UK, US</span>
                            </div>
                            <Switch
                                checkedChildren={speakLang === 1 && "UK"}
                                unCheckedChildren={speakLang === 2 && "US"}
                                checked={speakLang === 1}
                                onChange={(checked) => setSpeakLang(checked ? 1 : 2)}
                            />
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
                                    <button key={value} className={`px-4 py-2 rounded-lg transition-colors cursor-default ${feature === value ? "bg-primary text-white" : "bg-gray-100"}`}>
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
                                    <span>Tổng số câu</span>
                                    <span>{`${currentIndex + 1}/${flashcards.length}`}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Keyboard Shortcuts Guide */}
                        <div className="space-y-2">
                            <h2 className="font-medium">Phím tắt</h2>
                            <div className="bg-gray-100 p-4 rounded-lg space-y-3">
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
                        <div className="">
                            <p className="font-medium">Đây là phiên bản beta còn rất nhiều bất cập mong bạn thông cảm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
