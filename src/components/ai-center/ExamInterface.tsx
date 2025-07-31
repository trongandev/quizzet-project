"use client"

import { Button } from "@/components/ui/button"
import { FolderUp, X } from "lucide-react"
import { MultipleChoiceQuestion } from "@/components/ai-center/question-type/multiple-choice"
import { FillInBlankQuestion } from "@/components/ai-center/question-type/fill-in-blank"
import { MatchingQuestion } from "@/components/ai-center/question-type/matching"
import { RearrangeSentencesQuestion } from "@/components/ai-center/question-type/rearrange-sentences"
import { RewriteSentenceQuestion } from "@/components/ai-center/question-type/rewrite-sentence"
import { ReadingComprehensionQuestion } from "@/components/ai-center/question-type/reading-comprehension"
import { ListeningComprehensionQuestion } from "@/components/ai-center/question-type/listening-comprehension"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { IEnglishExam } from "@/types/typeEnglishExam"
import { Badge } from "@/components/ui/badge"
interface ExamInterfaceProps {
    examData: IEnglishExam
    open: boolean
    setOpen: (open: boolean) => void
}

export function ExamInterface({ examData, open, setOpen }: ExamInterfaceProps) {
    const renderQuestion = (question: any) => {
        switch (question.question_type) {
            case "multiple_choice":
                return <MultipleChoiceQuestion question={question} />
            case "fill_in_the_blank":
                return <FillInBlankQuestion question={question} />
            case "matching":
                return <MatchingQuestion question={question} />
            case "rearrange_sentences":
                return <RearrangeSentencesQuestion question={question} />
            case "rewrite_sentence":
                return <RewriteSentenceQuestion question={question} />
            case "reading_comprehension":
                return <ReadingComprehensionQuestion question={question} />
            case "listening_comprehension":
                return <ListeningComprehensionQuestion question={question} />
            default:
                return <div className="text-slate-400">Unsupported question type</div>
        }
    }

    const handlePublish = () => {
        // Logic to handle publishing the exam
        console.log("Publishing exam...", examData)
        // setOpen(false) // Close the dialog after publishing
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-[90vh] p-3 md:p-6  max-w-4xl">
                <div className="min-h-[600px] overflow-y-scroll space-y-3">
                    <div className="">
                        <h1 className="text-xl font-semibold">{examData.title}</h1>
                        <div className="dark:text-white/80 text-sm space-y-1">
                            <p>{examData.description}</p>
                            {examData.skills.map((skill, index) => (
                                <Badge variant="secondary" key={index} className="mr-2 mb-2">
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </Badge>
                            ))}
                            <p>Thời gian làm bài: {examData.timeLimit}p</p>
                        </div>
                    </div>
                    {examData.questions.map((question: any, index) => (
                        <div className="" key={index}>
                            {renderQuestion(question)}
                        </div>
                    ))}
                </div>
                <div className={`flex gap-3 justify-end ${examData.title === "test-ai-english" ? "hidden" : ""}`}>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        <X />
                        Đóng
                    </Button>
                    <Button className="text-white bg-gradient-to-r from-purple-500 to-pink-500" onClick={handlePublish}>
                        <FolderUp /> Xuất bản
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
