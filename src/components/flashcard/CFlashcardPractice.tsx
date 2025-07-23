"use client"
import React, { useEffect, useState, useCallback } from "react"
import { EdgeSpeechTTS } from "@lobehub/tts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, Eye, Lightbulb, Send, Volume2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Loading from "@/components/ui/loading"
import { Flashcard } from "@/types/type"
import { useUser } from "@/context/userContext"
import Cookies from "js-cookie"
import { TbConfetti } from "react-icons/tb"
import { POST_API } from "@/lib/fetchAPI"
const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
    LISTENING: 3,
    FILL_BLANK: 4,
}

interface ISessionRating {
    id: string
    quality: number
    userId: string
}
export default function CFlashcardPractice({ fc }: { fc: Flashcard[] }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0) // Vị trí hiện tại trong danh sách flashcards
    const [feature, setFeature] = useState(FEATURES.FLASHCARD)
    const [showAns, setShowAns] = useState(false)
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [inputAnswer, setInputAnswer] = useState("")
    const [quizOptions, setQuizOptions] = useState<string[]>([])
    const [loadingAudio, setLoadingAudio] = useState(false)
    const [sessionRatings, setSessionRatings] = useState<ISessionRating[]>([]) // Mảng lưu trữ các đánh giá trong phiên
    // random moder
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string | null }>({})
    const [isCorrectAns, setIsCorrectAns] = useState<"correct" | "incorrect" | null>(null)
    const [voiceSetting, setVoiceSetting] = useState<any>({})
    const [isShiftDisabled, setIsShiftDisabled] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const router = useRouter()
    const token = Cookies.get("token") || ""
    const { user } = useUser() || {}
    const userId = user?._id || ""
    const shuffle = (array: any) => {
        let currentIndex = array.length,
            randomIndex
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }
        return array
    }
    // Fetch flashcards data

    useEffect(() => {
        setFlashcards(fc)
        setFlashcards(shuffle(fc))
        generateQuizOptions(fc[0])

        const savedVoiceString = JSON.parse(localStorage.getItem("defaultVoices") || "{}")
        setVoiceSetting(savedVoiceString)
    }, [fc])

    useEffect(() => {
        if (flashcards.length > 0) {
            generateQuizOptions(flashcards[0])
        }
    }, [flashcards])

    useEffect(() => {
        if (sessionRatings.length > 0 && sessionRatings.length % 5 === 0) {
            handleCompleteSession() // Gửi các đánh giá hiện có
        }
    }, [sessionRatings]) // Chạy lại khi sessionRatings thay đổi

    const generateQuizOptions = useCallback(
        (currentCard: Flashcard) => {
            if (!currentCard || flashcards.length < 4) return

            // Đáp án đúng
            const correctOption = currentCard.title

            // Các đáp án sai
            const availableCards = flashcards.filter((card) => card._id !== currentCard._id)
            const wrongOptions = []
            while (wrongOptions.length < 3 && availableCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCards.length)
                wrongOptions.push(availableCards[randomIndex].title)
                availableCards.splice(randomIndex, 1)
            }

            // Trộn đáp án đúng và đáp án sai
            const options = [correctOption, ...wrongOptions]
            setQuizOptions(options.sort(() => Math.random() - 0.5))
        },
        [flashcards]
    )
    const currentCard = flashcards[currentIndex]

    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }))

    const speakWord = useCallback(
        async (text: string, language: string): Promise<void> => {
            return new Promise(async (resolve, reject) => {
                try {
                    setLoadingAudio(true)
                    setIsSpeaking(true) // ✅ Bắt đầu phát âm

                    const response = await tts.create({
                        input: text,
                        options: {
                            voice: voiceSetting[language] || "en-US",
                        },
                    })

                    const audioBuffer = await response.arrayBuffer()
                    const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
                    const url = URL.createObjectURL(blob)
                    const audio = new Audio(url)

                    audio.addEventListener("ended", () => {
                        URL.revokeObjectURL(url)
                        setIsSpeaking(false) // ✅ Kết thúc phát âm
                        resolve() // ✅ Resolve promise khi audio kết thúc
                    })

                    audio.addEventListener("error", () => {
                        setIsSpeaking(false)
                        reject(new Error("Audio playback failed"))
                    })

                    await audio.play()
                } catch (error: any) {
                    console.error("TTS Error:", error)
                    setIsSpeaking(false) // ✅ Reset state khi có lỗi
                    toast.error("Không có kết nối mạng", {
                        description: error.message,
                        duration: 3000,
                        position: "top-center",
                    })
                    reject(error)
                } finally {
                    setTimeout(() => {
                        setLoadingAudio(false)
                    }, 500)
                }
            })
        },
        [tts, voiceSetting]
    )

    // Navigation handlers
    const setDefaultValue = useCallback(() => {
        setIsFlipped(false)
        setInputAnswer("")
        setShowAns(false)
    }, [])

    const handlePlayAudio = (method: string) => {
        if (method == "correct") {
            const audio = new Audio("/audio/correct.mp3")
            audio.play()
        } else if (method == "wrong") {
            const audio = new Audio("/audio/wrong.mp3")
            audio.play()
        }
    }

    const handleChangeIndex = useCallback(async () => {
        const newIndex = currentIndex + 1
        setCurrentIndex(newIndex)
        setDefaultValue() // Reset các giá trị về mặc định
        if (feature === FEATURES.FLASHCARD || feature === FEATURES.LISTENING) {
            await speakWord(flashcards[newIndex].title, flashcards[newIndex].language || "english")
        }

        generateQuizOptions(flashcards[newIndex])
    }, [currentIndex, flashcards, feature, speakWord, generateQuizOptions, setDefaultValue])

    // === 3. Xử lý đánh giá chất lượng thẻ (0-5) ===
    const handleRate = async (quality: number) => {
        const newRating = { id: currentCard._id, quality: quality, userId: userId }
        setSessionRatings([...sessionRatings, newRating]) // Cập nhật mảng đánh giá

        if (flashcards && currentIndex < flashcards.length - 1) {
            handleChangeIndex()
        } else {
            if (sessionRatings.length > 0) {
                setIsSuccess(true)
                toast.success("Đã hoàn thành phiên ôn tập!", {
                    duration: 5000,
                })
                handleCompleteSession()
            }
        }
    }

    const handleQuizAnswer = async (selectedAnswer: string, idx: number) => {
        const isCorrect = selectedAnswer === currentCard.title

        // ✅ Set selected answer ngay lập tức để disable buttons
        setSelectedAnswers({
            ...selectedAnswers,
            [idx]: isCorrect ? "correct" : "incorrect",
        })

        toast[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai mất rồi :(", {
            duration: 2000,
            position: "top-center",
        })

        if (isCorrect) {
            handlePlayAudio("correct")

            try {
                // ✅ Chờ phát âm hoàn thành
                await speakWord(currentCard.title, currentCard.language || "english")

                handleRate(5) // Đánh giá 5 sao cho thẻ flashcard
                setSelectedAnswers({}) // ✅ Reset selected answers
            } catch (error) {
                console.error("Speech error:", error)
                // Nếu phát âm lỗi, vẫn cho phép tiếp tục
                handleRate(5)
                setSelectedAnswers({})
            }
        } else {
            handlePlayAudio("wrong")

            try {
                // ✅ Chờ phát âm hoàn thành cho đáp án đúng
                await speakWord(currentCard.title, currentCard.language || "english")

                handleRate(0) // Đánh giá 0 sao cho thẻ flashcard
                setSelectedAnswers({}) // ✅ Reset để cho phép chọn lại
            } catch (error) {
                console.error("Speech error:", error)
                handleRate(0)
                setSelectedAnswers({})
            }
        }
    }

    // Listening practice handler
    const checkListeningAnswer = useCallback(() => {
        const isCorrect = inputAnswer.toLowerCase() === currentCard.title.toLowerCase()
        toast[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai mất rồi :((", {
            duration: 2000,
            position: "top-center",
        })
        setIsCorrectAns(isCorrect ? "correct" : "incorrect")
        if (isCorrect) {
            handlePlayAudio("correct")
            setTimeout(() => {
                handleRate(5) // Đánh giá 5 sao cho thẻ flashcard
                setIsCorrectAns(null) // Reset về null thay vì false
            }, 1000)
        } else {
            handlePlayAudio("wrong")
            handleRate(0) // Đánh giá 0 sao cho thẻ flashcard
            setTimeout(() => {
                setIsCorrectAns(null)
            }, 820)
        }
    }, [inputAnswer, flashcards, currentIndex])

    const handleCompleteSession = async () => {
        // ✅ Sử dụng parameter hoặc fallback về state
        if (sessionRatings.length === 0) {
            toast.error("Không có đánh giá nào để gửi")
            return
        }

        setSessionRatings([]) // Clear state
        setCurrentIndex(0) // Reset current index
        setFlashcards((prev) => (prev ? prev.slice(sessionRatings.length) : []))
        toast.loading("Đang gửi dữ liệu ôn tập...", {
            position: "top-center",
            id: "send-session",
        })

        try {
            const res = await POST_API(`/flashcards/batch-rate`, { cards: sessionRatings }, "PUT", token)
            const result = await res?.json()

            if (res?.ok) {
                toast.success("Đã gửi dữ liệu ôn tập thành công!", {
                    duration: 3000,
                    position: "top-center",
                    id: "send-session",
                })
            } else {
                toast.error(`Lỗi khi gửi dữ liệu ôn tập: ${result?.message || "Lỗi không xác định."}`, {
                    duration: 5000,
                    position: "top-center",
                    id: "send-session",
                })
            }
        } catch (error: any) {
            console.error("Lỗi khi gửi batch-rate:", error.message || "Lỗi không xác định.")
            toast.error(`Lỗi khi gửi dữ liệu ôn tập`, {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
                duration: 5000,
                position: "top-center",
                id: "send-session",
            })
        }
    }

    // Keyboard navigation
    const handleKeyDown = useCallback(
        async (e: any) => {
            switch (e.key.toLowerCase()) {
                case "alt":
                    e.preventDefault()
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        setShowAns((prev) => !prev)
                        if (!showAns) {
                            setInputAnswer(currentCard.title) // Hiển thị đáp án khi bấm space
                        }
                    }
                    break
                case " ":
                    if (feature === FEATURES.FLASHCARD) {
                        setIsFlipped((prev) => !prev)
                    }
                    break
                case "enter":
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        checkListeningAnswer()
                    }
                    break
                case "shift":
                    // Phát âm thanh với accent đang được chọn
                    if (!isShiftDisabled) {
                        setIsShiftDisabled(true)
                        speakWord(currentCard?.title, currentCard?.language || "english")
                        setTimeout(() => {
                            setIsShiftDisabled(false)
                        }, 2000)
                    }
                    break
            }
        },
        [feature, checkListeningAnswer]
    )

    if (flashcards === null || flashcards === undefined) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3">
                <p className="text-gray-500">Vui lòng thêm từ mới vào danh sách flashcard.</p>
                <Eye size={50} className="text-gray-400" />
                <h1>Không có từ nào trong bộ flashcard này</h1>
                <Button variant="secondary" onClick={() => router.back()}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        )
    }

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
        )
    }

    return (
        <div className="relative z-10 bg-gray-200 dark:bg-slate-700  px-3 flex justify-center items-center py-5">
            <div className="w-full md:w-[1000px] xl:w-[1200px] focus-visible:outline-none min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
                <div className="w-full flex items-center justify-center min-h-[80vh] flex-col gap-2">
                    <div className="w-full text-left">
                        <Button className="w-full md:w-auto" variant="outline" onClick={() => router.back()}>
                            <ArrowLeft /> Quay lại
                        </Button>
                    </div>

                    {/* Progress Display */}
                    <div className="space-y-2 block md:hidden w-full">
                        <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span>Đã học:</span>
                                <span>
                                    {sessionRatings.length}/{flashcards.length}
                                </span>
                            </div>

                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${sessionRatings.length / 0.05}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-full flex flex-col gap-5">
                            {/* Main Flashcard Container */}
                            <div className=" relative w-full h-[500px] border border-white/10 rounded-md  shadow-md bg-white dark:bg-slate-800/50 dark:text-white" style={{ perspective: "1000px" }} onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}>
                                {/* Flashcard Feature */}
                                {feature === FEATURES.FLASHCARD && (
                                    <div className={`rounded-lg  cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                                        {/* Front Side */}
                                        <div className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5" style={{ backfaceVisibility: "hidden" }}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <p className="text-2xl font-semibold">{currentCard?.title}</p>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        speakWord(currentCard?.title, currentCard?.language || "english")
                                                    }}
                                                    className=""
                                                    disabled={loadingAudio}
                                                    variant="outline"
                                                >
                                                    {loadingAudio ? <Loading /> : <Volume2 size={24} />}
                                                </Button>
                                            </div>
                                            <p className="text-gray-500 text-lg font-bold">{currentCard?.transcription}</p>

                                            <p className="text-gray-500 text-sm">(Click to flip)</p>
                                        </div>

                                        {/* Back Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}
                                        >
                                            {isFlipped && <p className="text-lg ">{currentCard?.define}</p>}

                                            {currentCard?.example && (
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
                                                                    <p className="font-bold italic">{currentCard.example[0]?.en}</p>
                                                                    <p className="italic">{currentCard.example[0]?.vi}</p>
                                                                </div>
                                                                <div className="mb-2">
                                                                    <p className="font-bold italic">{currentCard.example[1]?.en}</p>
                                                                    <p className="italic">{currentCard.example[1]?.vi}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center mt-3">
                                                <Button
                                                    className="text-white"
                                                    disabled={flashcards.length < currentIndex}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleChangeIndex()
                                                    }}
                                                >
                                                    Tiếp tục <ChevronRight />
                                                </Button>
                                            </div>
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
                                        <p className="text-lg mb-6">{currentCard?.define}</p>
                                        <div className="grid grid-cols-2 gap-5 flex-1">
                                            {quizOptions.map((option, idx) => (
                                                <Button
                                                    key={idx}
                                                    onClick={() => handleQuizAnswer(option, idx)}
                                                    disabled={
                                                        Object.keys(selectedAnswers).length > 0 || // ✅ Disable khi đã chọn đáp án
                                                        isSpeaking || // ✅ Disable khi đang phát âm
                                                        loadingAudio // ✅ Disable khi đang load audio
                                                    }
                                                    variant="secondary"
                                                    className={`h-full relative text-gray-700 dark:text-white  transition-colors
                                                                ${selectedAnswers[idx] === "correct" ? "!border-green-500 border-2 tada" : ""}
                                                                ${selectedAnswers[idx] === "incorrect" ? "!border-red-500 border-2 shake" : ""}
                                            `}
                                                >
                                                    <div className="absolute top-1 left-1 h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-900 dark:text-white   dark:bg-slate-900/50">{idx + 1}</div>
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
                                            <Button onClick={() => speakWord(currentCard?.title, currentCard?.language || "english")} className="" variant="outline">
                                                <Volume2 />
                                            </Button>
                                        </div>
                                        <div className="flex-1">
                                            <p className=" mb-2">Định nghĩa:</p>
                                            <p className="text-gray-600 dark:text-white/70 mb-4">{currentCard?.define}</p>
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
                                        <Button onClick={() => setInputAnswer(currentCard.title)} className="text-white" variant="outline" size="lg">
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
                                            <p className=" mb-4">{currentCard?.define}</p>
                                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4">
                                                <p className="text-gray-600 dark:text-white/70 font-medium mb-2">Ví dụ:</p>
                                                <p className="text-lg">{showAns ? currentCard?.example?.[0]?.en : currentCard?.example?.[0]?.en.replace(new RegExp(currentCard?.title, "gi"), "______")}</p>
                                            </div>
                                            <Input
                                                type="text"
                                                value={inputAnswer}
                                                onChange={(e) => setInputAnswer(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === " ") {
                                                        e.stopPropagation() // Prevent space key event from bubbling up
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
                        </div>

                        {/* Feature Selection Panel */}
                        <div className="w-full md:w-auto flex flex-col gap-4">
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
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span>Còn:</span>
                                        <span>{flashcards.length} từ</span>
                                    </div>

                                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${sessionRatings.length / 0.05}%`,
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
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                        <span className="">Lật thẻ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Enter</kbd>
                                        <span className="">Kiểm tra đáp án</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Alt</kbd>
                                        <span className="">Hiển thị đáp án</span>
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
    )
}
