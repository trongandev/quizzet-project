"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Volume2, Play, Pause, Check, Star, Users, Globe } from "lucide-react";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { voices } from "@/lib/voiceOptions"; // Import danh sách giọng nói từ file voiceOptions.ts
import { Voice } from "@/types/type";
import { toast } from "sonner";

interface VoiceSelectionModalProps {
    children: React.ReactNode;
    selectedVoice: string;
    setSelectedVoice: (voiceId: string) => void;
    language: "chinese" | "english" | "french" | "germany" | "japan" | "korea" | "vietnamese"; // Thêm prop language nếu cần thiết
}

export default function VoiceSelectionModal({ children, selectedVoice, setSelectedVoice, language }: VoiceSelectionModalProps) {
    const [open, setOpen] = useState(false);
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [filterLanguage, setFilterLanguage] = useState<Voice[]>([]);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null); // Thêm state để track audio hiện tại
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "zh-CN" })); // Đổi locale thành zh-CN cho phù hợp
    useEffect(() => {
        const languageMap = {
            chinese: "中文",
            english: "English",
            french: "Français",
            germany: "Deutsch",
            japan: "日本語",
            korea: "한국어",
            vietnamese: "Tiếng Việt",
        };

        const filteredVoices = voices.filter((voice) => voice.language == languageMap[language]);
        setFilterLanguage(filteredVoices);
    }, [language, setSelectedVoice, selectedVoice]);
    const handlePlaySample = (text: string, voiceId: string) => {
        if (playingVoice === voiceId) {
            // Nếu đang phát cùng voice, thì dừng lại
            stopCurrentAudio();
        } else {
            // Nếu click voice khác, chuyển sang voice mới
            setPlayingVoice(voiceId);
            console.log(`Playing sample for voice: ${voiceId}`);
            speakWord(text, voiceId);
        }
    };

    // Thêm function để dừng audio hiện tại
    const stopCurrentAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            URL.revokeObjectURL(currentAudio.src);
            setCurrentAudio(null);
        }
        setPlayingVoice(null);
    };

    const speakWord = async (text: string, voiceId: string) => {
        try {
            // Dừng audio hiện tại trước khi phát audio mới
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                URL.revokeObjectURL(currentAudio.src);
                setCurrentAudio(null);
            }
            const response = await tts.create({
                input: text,
                options: {
                    voice: voiceId,
                },
            });

            const audioBuffer = await response.arrayBuffer();
            const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            // Lưu reference của audio hiện tại
            setCurrentAudio(audio);

            // Event listeners
            audio.addEventListener("ended", () => {
                URL.revokeObjectURL(url);
                setPlayingVoice(null);
                setCurrentAudio(null);
            });

            audio.addEventListener("error", (e) => {
                console.error("Audio playback error:", e);
                URL.revokeObjectURL(url);
                setPlayingVoice(null);
                setCurrentAudio(null);
            });

            // Phát audio
            await audio.play();
        } catch (error) {
            console.error("TTS Error:", error);
            setPlayingVoice(null);
            setCurrentAudio(null);
        }
    };

    // Cleanup khi component unmount hoặc dialog đóng
    const handleDialogChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            stopCurrentAudio(); // Dừng audio khi đóng dialog
        }
    };

    const handleSelectVoice = (sample: string, voiceId: string) => {
        setSelectedVoice(voiceId);
        // Check if current screen size is mobile
        if (window.innerWidth <= 768) {
            handlePlaySample(sample, voiceId);
        }
        try {
            const savedVoice = JSON.parse(localStorage.getItem("defaultVoices") || "");
            console.log("Saved voice:", savedVoice);
            savedVoice[language] = voiceId; // Lưu voice đã chọn vào localStorage
            localStorage.setItem("defaultVoices", JSON.stringify(savedVoice));
        } catch (error) {
            console.warn("LocalStorage not available, using session storage as fallback:", error);
            toast.error("Không thể lưu giọng nói đã chọn, vui lòng đổi trình duyệt Chome");
        }
    };

    const getFilteredVoices = () => {
        switch (activeTab) {
            case "popular":
                return filterLanguage.filter((voice) => voice.popular);
            case "premium":
                return filterLanguage.filter((voice) => voice.premium);
            case "male":
                return filterLanguage.filter((voice) => voice.gender === "male");
            case "female":
                return filterLanguage.filter((voice) => voice.gender === "female");
            default:
                return filterLanguage;
        }
    };

    const getCountryFlag = (country: string) => {
        const flags: { [key: string]: string } = {
            CN: "🇨🇳",
            TW: "🇹🇼",
            HK: "🇭🇰",
            US: "🇺🇸",
            UK: "🇬🇧",
            FR: "🇫🇷",
            DE: "🇩🇪",
            JP: "🇯🇵",
            KR: "🇰🇷",
            ES: "🇪🇸",
            AU: "🇦🇺",
            CA: "🇨🇦",
            AT: "🇦🇹 ",
            VN: "🇻🇳",
        };
        return flags[country] || "🌐";
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-blue-600" />
                        Chọn giọng nói
                    </DialogTitle>
                    <DialogDescription>Lựa chọn giọng nói phù hợp để cải thiện trải nghiệm học tập của bạn, một số giọng cần thời gian để phát âm</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                        <TabsTrigger value="all" className="gap-1">
                            <Globe className="w-3 h-3" />
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger value="popular" className="gap-1 hidden md:flex">
                            <Star className="w-3 h-3" />
                            Phổ biến
                        </TabsTrigger>
                        <TabsTrigger value="premium" className="gap-1 hidden md:flex">
                            <Badge variant="secondary" className="w-2 h-2 p-0" />
                            Premium
                        </TabsTrigger>
                        <TabsTrigger value="male" className="gap-1">
                            <Users className="w-3 h-3" />
                            Nam
                        </TabsTrigger>
                        <TabsTrigger value="female" className="gap-1">
                            <Users className="w-3 h-3" />
                            Nữ
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-4">
                        <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                            {getFilteredVoices().map((voice) => (
                                <Card
                                    key={voice.id}
                                    className={`w-full cursor-pointer transition-all duration-200 border dark:border-white/10 border-gray-300/50  ${
                                        selectedVoice === voice.id ? "border-b-4 border-b-blue-500 bg-blue-50 dark:bg-blue-900/50" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    }`}
                                    onClick={() => handleSelectVoice(voice.sample, voice.id)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback
                                                    className={`text-sm font-medium ${
                                                        voice.gender === "female"
                                                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
                                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                    }`}>
                                                    {voice.avatar}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Voice Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-200">{voice.name}</h3>
                                                    <Badge variant="outline" className="text-xs">
                                                        {getCountryFlag(voice.country)} {voice.language}
                                                    </Badge>
                                                    {voice.premium && <Badge className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 dark:text-white">Premium</Badge>}
                                                    {voice.popular && (
                                                        <Badge variant="secondary" className="text-xs gap-1 hidden md:flex">
                                                            <Star className="w-3 h-3" />
                                                            Phổ biến
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">{voice.description}</p>
                                                <p className="text-xs text-gray-500 italic dark:text-gray-300">&quot;{voice.sample}&quot;</p>
                                            </div>

                                            {/* Controls - Cải thiện UI */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={playingVoice === voice.id ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlaySample(voice.sample, voice.id);
                                                    }}
                                                    className={`hidden md:flex gap-1 transition-all duration-500 ${
                                                        playingVoice === voice.id ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 animate-pulse" : ""
                                                    }`}
                                                    // disabled={playingVoice !== null && playingVoice !== voice.id} // Disable other buttons khi đang phát
                                                >
                                                    {playingVoice === voice.id ? (
                                                        <>
                                                            <Pause className="w-4 h-4" />
                                                            Dừng
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="w-4 h-4" />
                                                            Nghe thử
                                                        </>
                                                    )}
                                                </Button>

                                                {selectedVoice === voice.id && (
                                                    <div className=" items-center gap-1 text-blue-600 dark:text-blue-400 hidden md:flex">
                                                        <Check className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Đã chọn</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleDialogChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={() => handleDialogChange(false)} className="gap-2 text-white">
                        <Check className="w-4 h-4" />
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
