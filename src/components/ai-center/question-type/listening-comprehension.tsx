"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Play, Volume2, RotateCcw } from "lucide-react"
import { IListeningComprehensionQuestion } from "@/types/typeEnglishExam"
import { EdgeSpeechTTS } from "@lobehub/tts"
import { toast } from "sonner"

export function ListeningComprehensionQuestion({ question }: { question: IListeningComprehensionQuestion }) {
    const [loading, setLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playCount, setPlayCount] = useState(0)
    const [isSpeaking, setIsSpeaking] = useState(false) // ✅ Trạng thái đang phát TTS
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioUrlRef = useRef<string>("") // ✅ Ref để track audioUrl
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }))

    useEffect(() => {
        // Khi component mount, tạo audioUrl từ question.audio_text
        if (question.audio_text) {
            setLoading(true)
            tts.create({
                input: question.audio_text,
                options: {
                    voice: "en-GB-SoniaNeural",
                },
            })
                .then((response) => response.arrayBuffer())
                .then((audioBuffer) => {
                    const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
                    const url = URL.createObjectURL(blob)
                    // setAudioUrl(url)
                    audioUrlRef.current = url // Lưu vào ref để tránh tạo lại URL mỗi lần render
                    if (audioRef.current) {
                        audioRef.current.src = url
                    }
                })
                .catch((error) => {
                    console.error("TTS Error:", error)
                    toast.error("Lỗi khi tạo âm thanh:", {
                        description: error instanceof Error ? error.message : "Lỗi không xác định",
                        duration: 5000,
                        position: "top-center",
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [question, tts])

    const handleRestart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            setCurrentTime(0)
            setPlayCount((prev) => prev + 1)
            audioRef.current.play()
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("ended", (e) => {
                const target = e.currentTarget as HTMLAudioElement
                setCurrentTime(target.currentTime || 0)
                setDuration(target.duration || 0)
                setIsSpeaking(false)
            })
        }
    }, [audioRef])

    const handlePlayAudio = async () => {
        if (isSpeaking) return // ✅ Ngăn spam click
        setIsSpeaking(true) // ✅ Bắt đầu phát
        if (audioRef.current) {
            audioRef.current.src = audioUrlRef.current // Sử dụng ref để tránh tạo lại URL
            await audioRef.current.play()
            setPlayCount((prev) => prev + 1) // ✅ Tăng số lần đã nghe
        }
    }
    return (
        <div className="space-y-6">
            {/* Audio Player */}
            <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Volume2 className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Âm thanh</h3>
                        <Badge variant="secondary" className="bg-slate-700">
                            Đã nghe {playCount} lần
                        </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{question.question_text}</h3>

                    <div className="bg-slate-700 rounded-lg p-6">
                        {question.audio_text ? (
                            <>
                                <audio ref={audioRef} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
                                <div className="flex items-center gap-4 mb-4">
                                    <Button onClick={handlePlayAudio} disabled={isSpeaking || loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white">
                                        {isSpeaking ? (
                                            <>
                                                <Volume2 className="w-5 h-5 animate-pulse" />
                                                <span className="ml-2">Đang phát...</span>
                                            </>
                                        ) : (
                                            <Play className="w-5 h-5" />
                                        )}
                                    </Button>

                                    <Button variant="outline" onClick={handleRestart} className="border-slate-600 text-slate-300 bg-transparent">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Nghe lại
                                    </Button>

                                    <div className="flex-1 text-slate-300 text-sm">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-600 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-100" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Volume2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-400">File âm thanh sẽ được phát ở đây</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-300">Câu trả lời của bạn:</h4>
                            {/* <Badge variant="secondary" className="bg-slate-700">
                                {wordCount} từ
                            </Badge> */}
                        </div>

                        <Textarea value={question.correct_answer_text} className="bg-slate-700 border-slate-600 text-white min-h-[120px] text-lg leading-relaxed" placeholder="Nhập câu trả lời dựa trên nội dung âm thanh..." />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
