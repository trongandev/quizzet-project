import React, { useMemo } from "react";
import { AlertCircle, ArrowRight, BookOpen, Brain, CheckCircle, ChevronRight, Clock, NotepadTextDashed, RotateCcw, Target, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import handleCompareDate from "@/lib/CompareDate";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";

interface ISummary {
    weeklyReviewedWordsCount: number;
    wordAccuracy: {
        accuracyPercentage: number;
        correctReviews: number;
        totalReviews: number;
    };
    words: {
        learnedWords: [];
        rememberedWords: [];
        reviewingWords: [];
    };
}

interface ISelectedWord {
    title: string;
    type: string;
    define: string;
    words: IWords[];
}

interface IWords {
    title: string;
    define: string;
    nextReviewDate: Date;
}

export default function CDataWordsFC({ summary }: { summary: ISummary }) {
    const router = useRouter();
    const learnedWords = useMemo(() => {
        return summary?.words?.learnedWords?.length || 0;
    }, [summary]);
    const rememberedWords = useMemo(() => {
        return summary?.words?.rememberedWords?.length || 0;
    }, [summary]);
    const reviewingWords = useMemo(() => {
        return summary?.words?.reviewingWords?.length || 0;
    }, [summary]);

    const total = useMemo(() => {
        return learnedWords + rememberedWords + reviewingWords;
    }, [learnedWords, rememberedWords, reviewingWords]);

    const [open, setOpen] = React.useState(false);
    const [selectedWords, setSelectedWords] = React.useState<ISelectedWord | null>(null);

    const handleSelectWord = (title: string) => {
        switch (title) {
            case "learnedWords":
                setSelectedWords({
                    title: "Đã học thuộc",
                    type: "learnedWords",
                    define: "Những từ đã được học và ghi nhớ",
                    words: summary?.words?.learnedWords || [],
                });
                break;
            case "rememberedWords":
                setSelectedWords({
                    title: "Đã nhớ lâu",
                    type: "rememberedWords",
                    define: "Những từ đã được ghi nhớ lâu và cần ôn tập định kỳ",
                    words: summary?.words?.rememberedWords || [],
                });
                break;
            case "reviewingWords":
                setSelectedWords({
                    title: "Cần ôn tập",
                    type: "reviewingWords",
                    define: "Những từ cần ôn tập ngay để củng cố kiến thức",
                    words: summary?.words?.reviewingWords || [],
                });
                break;
            default:
                setSelectedWords(null);
        }
        setOpen(true);
    };

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case "learnedWords":
                return "bg-green-50  text-green-600 dark:bg-green-900/50 dark:border-green-600 dark:text-green-400";
            case "rememberedWords":
                return "bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:border-purple-600 dark:text-purple-400 ";
            case "reviewingWords":
                return "bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:border-orange-600 dark:text-orange-400 ";
            default:
                return "bg-gray-50  text-gray-600 dark:bg-gray-900/50 dark:border-gray-600 dark:text-gray-400";
        }
    };
    return (
        <div className="">
            <div className={`grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-5`}>
                {/* Total Cards - Enhanced */}
                <div
                    className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 dark:from-blue-800/50 dark:to-blue-900/50 dark:border-white/10 cursor-pointer hover:scale-105 transiton-all duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Tổng
                        </Badge>
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-1">{total || 0}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Tất cả từ vựng</div>
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />+{summary?.weeklyReviewedWordsCount || 0} từ đã học tuần này
                    </div>
                </div>
                {/* Learned Cards */}
                <Tooltip delayDuration={50}>
                    <TooltipTrigger className="w-full cursor-default">
                        <div
                            className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800/50 dark:to-green-900/50 dark:border-white/10 rounded-xl p-6 border border-green-200 w-full h-full cursor-pointer hover:scale-105 transiton-all duration-300`}
                            onClick={() => handleSelectWord("learnedWords")}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-green-100 text-green-800">Hoàn thành</Badge>
                            </div>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-400 mb-1">{learnedWords}</div>
                            <div className="text-sm text-green-700 dark:text-green-300">Đã học thuộc</div>
                            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${learnedWords}%` }}></div>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm dark:text-gray-200 text-gray-500 md:w-[200px]">
                            <p className="">
                                Đây là trạng thái của những thẻ mà bạn đã ghi nhớ một cách vững chắc. Độ nhớ của thẻ đã đạt đến ngưỡng cao, cho thấy bạn có thể nhớ từ này rất tốt và có thể bỏ qua
                                trong một khoảng thời gian rất dài (có thể là vài tuần, vài tháng, hoặc thậm chí hàng năm).
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>

                {/* Known Cards */}
                <Tooltip delayDuration={50}>
                    <TooltipTrigger className="w-full cursor-default">
                        <div
                            className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 dark:from-purple-800/50 dark:to-purple-900/50 dark:border-white/10 cursor-pointer hover:scale-105 transiton-all duration-300`}
                            onClick={() => handleSelectWord("rememberedWords")}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-purple-100 text-purple-800">Ghi nhớ</Badge>
                            </div>
                            <div className="text-3xl font-bold text-purple-900 mb-1 dark:text-purple-300">{rememberedWords}</div>
                            <div className="text-sm text-purple-700 dark:text-purple-400">Đã nhớ lâu</div>
                            <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Cần ôn lại
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm dark:text-gray-200 text-gray-500 md:w-[200px]">
                            <p className="">
                                Thẻ này đã được bạn ôn tập và ghi nhớ thành công ít nhất một vài lần, nhưng chưa đạt đến mức độ thuộc một cách vững chắc để có thể yên tâm bỏ qua trong một thời gian
                                rất dài.
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
                {/* Review Cards */}
                <Tooltip delayDuration={50}>
                    <TooltipTrigger className="w-full cursor-default">
                        <div
                            className={`bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 dark:from-orange-800/50 dark:to-orange-900/50 dark:border-white/10 cursor-pointer hover:scale-105 transiton-all duration-300`}
                            onClick={() => handleSelectWord("reviewingWords")}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-orange-600 rounded-lg">
                                    <RotateCcw className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-orange-100 text-orange-800">Cần ôn</Badge>
                            </div>
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-400 mb-1">{reviewingWords}</div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">Bấm vào đây để ôn tập</div>
                            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Ưu tiên cao
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm dark:text-gray-200 text-gray-500 md:w-[200px]">
                            <p className="">Là trạng thái của một thẻ đã được ôn tập nhưng đến hạn cần ôn tập lại vào ngày hôm nay hoặc các ngày trước đó.</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
                {/* Accuracy Percentage */}
                <Tooltip delayDuration={50}>
                    <TooltipTrigger className="w-full cursor-default">
                        <div
                            className={`h-full w-full col-span-2 md:col-span-1 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 dark:from-indigo-800/50 dark:to-indigo-900/50 dark:border-white/10`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <Badge className="text-xs bg-indigo-100 text-indigo-800">Độ chính xác</Badge>
                            </div>
                            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400 mb-1">{summary?.wordAccuracy?.accuracyPercentage || 0}%</div>
                            <div className="text-sm text-indigo-700 dark:text-indigo-300">Tỷ lệ đúng</div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 bg-indigo-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${summary?.wordAccuracy?.accuracyPercentage || 0}%` }}></div>
                                </div>
                                <span className="text-xs text-indigo-600 dark:text-indigo-400">
                                    {summary?.wordAccuracy?.correctReviews}/{summary?.wordAccuracy?.totalReviews}
                                </span>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm dark:text-gray-200 text-gray-500 md:w-[200px]">
                            <p className="">Được tính dựa trên tổng số lần ôn tập/số lần ôn tập đúng của từng từ (trên mức 3: Bình thường, dễ nhớ, hoàn hảo)</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex-1 w-full"></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedWords?.title}</DialogTitle>
                        <DialogDescription>{selectedWords?.define}</DialogDescription>
                    </DialogHeader>
                    <div className="h-[500px] overflow-y-scroll grid grid-cols-2 grid-flow-row gap-2 md:gap-3 rounded-lg">
                        {selectedWords &&
                            selectedWords?.words?.map((word, index) => (
                                <div className={`border-2  border-dashed  rounded-lg p-5 ${getBackgroundColor(selectedWords.type)} `} key={index}>
                                    <h1 className=" font-medium">{word.title}</h1>
                                    {selectedWords.type === "reviewingWords" && (
                                        <span className="text-xs text-orange-300">
                                            {new Date(word.nextReviewDate) > new Date()
                                                ? `Còn ${formatDistanceToNowStrict(new Date(word.nextReviewDate), { locale: vi, addSuffix: true })} để ôn tập lại`
                                                : `Quá hạn ${formatDistanceToNowStrict(new Date(word.nextReviewDate), { locale: vi, addSuffix: true })}`}
                                        </span>
                                    )}

                                    <p className="text-sm opacity-85">{word.define}</p>
                                </div>
                            ))}
                        {selectedWords && selectedWords?.words?.length <= 0 && (
                            <div className="h-full flex items-center flex-col col-span-2 gap-3 justify-center text-gray-500 dark:text-gray-300">
                                <NotepadTextDashed size={45} />
                                <p>Không có từ nào đã học thuộc...</p>
                            </div>
                        )}
                    </div>
                    {selectedWords?.type === "reviewingWords" && (
                        <DialogFooter>
                            <Button onClick={() => router.push("/flashcard/practice-science")} className="text-white bg-orange-600 hover:bg-orange-700">
                                Bấm vào để ôn tập ngay <ArrowRight />
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
