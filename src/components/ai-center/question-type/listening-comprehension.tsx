"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, Volume2, RotateCcw } from "lucide-react"
import { IListeningComprehensionQuestion } from "@/types/typeEnglishExam"
import { EdgeSpeechTTS } from "@lobehub/tts"
import { toast } from "sonner"

export function ListeningComprehensionQuestion({ question }: { question: IListeningComprehensionQuestion }) {
    const [audioUrl, setAudioUrl] = useState<string>("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playCount, setPlayCount] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }))
    useEffect(() => {
        const getAudio = async () => {
            try {
                const response = await tts.create({
                    input: question.audio_text,
                    options: {
                        voice: "en-US",
                    },
                })

                const audioBuffer = await response.arrayBuffer()
                const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
                if (audioRef.current) {
                    audioRef.current.src = url
                }
            } catch (error: any) {
                console.error("TTS Error:", error)
                toast.error("Không có kết nối mạng", {
                    description: error.message,
                    duration: 3000,
                    position: "top-center",
                })
            } finally {
                setTimeout(() => {
                    setIsPlaying(false)
                }, 500)
            }
        }
        getAudio()
    }, [question.audio_text, tts])

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
                if (currentTime === 0) {
                    setPlayCount((prev) => prev + 1)
                }
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleRestart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            setCurrentTime(0)
            setPlayCount((prev) => prev + 1)
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    // const wordCount = answer
    //     ? answer
    //           .trim()
    //           .split(/\s+/)
    //           .filter((word) => word.length > 0).length
    //     : 0

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

                    <div className="bg-slate-700 rounded-lg p-6">
                        {question.audio_text ? (
                            <>
                                <audio ref={audioRef} src={audioUrl} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onEnded={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

                                <div className="flex items-center gap-4 mb-4">
                                    <Button onClick={handlePlayPause} className="bg-purple-600 hover:bg-purple-700">
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                </CardContent>
            </Card>

            {/* Question */}
            <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">{question.question_text}</h3>

                    <div className="space-y-4">
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
