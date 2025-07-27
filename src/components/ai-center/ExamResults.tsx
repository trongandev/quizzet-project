"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, ArrowLeft } from "lucide-react"

interface ExamResultsProps {
    examData: any
    answers: Record<string, any>
}

export function ExamResults({ examData, answers }: ExamResultsProps) {
    const calculateResults = () => {
        let totalScore = 0
        let maxScore = 0
        let correctAnswers = 0
        const totalQuestions = examData.questions.length

        examData.questions.forEach((question: any) => {
            maxScore += question.score_points
            const userAnswer = answers[question.question_id]

            if (userAnswer !== undefined) {
                let isCorrect = false

                switch (question.question_type) {
                    case "multiple_choice":
                    case "reading_comprehension":
                        isCorrect = userAnswer === question.correct_answer_id
                        break
                    case "fill_in_the_blank":
                        isCorrect = userAnswer?.toLowerCase().trim() === question.correct_answer_text?.toLowerCase().trim()
                        break
                    case "matching":
                        if (Array.isArray(userAnswer) && question.correct_matches) {
                            isCorrect = userAnswer.length === question.correct_matches.length && userAnswer.every((match: any) => question.correct_matches.some((correct: any) => correct.left_id === match.left_id && correct.right_id === match.right_id))
                        }
                        break
                    case "rearrange_sentences":
                        if (Array.isArray(userAnswer) && question.correct_order_ids) {
                            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correct_order_ids)
                        }
                        break
                    case "rewrite_sentence":
                    case "image_description":
                    case "listening_comprehension":
                        // For open-ended questions, give partial credit if answered
                        isCorrect = userAnswer && userAnswer.trim().length > 10
                        break
                }

                if (isCorrect) {
                    totalScore += question.score_points
                    correctAnswers++
                }
            }
        })

        return {
            totalScore,
            maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            correctAnswers,
            totalQuestions,
            answeredQuestions: Object.keys(answers).length,
        }
    }

    const results = calculateResults()

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { grade: "A+", color: "text-green-400", bg: "bg-green-500/20" }
        if (percentage >= 80) return { grade: "A", color: "text-green-400", bg: "bg-green-500/20" }
        if (percentage >= 70) return { grade: "B", color: "text-blue-400", bg: "bg-blue-500/20" }
        if (percentage >= 60) return { grade: "C", color: "text-yellow-400", bg: "bg-yellow-500/20" }
        if (percentage >= 50) return { grade: "D", color: "text-orange-400", bg: "bg-orange-500/20" }
        return { grade: "F", color: "text-red-400", bg: "bg-red-500/20" }
    }

    const gradeInfo = getGrade(results.percentage)

    return (
        <div className="flex-1 bg-slate-900 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    {/* <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button> */}

                    <h1 className="text-3xl font-bold text-white mb-2">Kết quả bài kiểm tra</h1>
                    <p className="text-slate-400">{examData.exam_title}</p>
                </div>

                {/* Overall Results */}
                <Card className="bg-slate-800 border-slate-700 mb-8">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Score Circle */}
                            <div className="text-center">
                                <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${gradeInfo.bg} border-2 border-current ${gradeInfo.color}`}>
                                    <div>
                                        <div className="text-3xl font-bold">{results.percentage}%</div>
                                        <div className="text-lg font-semibold">{gradeInfo.grade}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Điểm tổng kết</h3>
                                <p className="text-slate-400">
                                    {results.totalScore}/{results.maxScore} điểm
                                </p>
                            </div>

                            {/* Statistics */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Câu trả lời đúng:</span>
                                    <span className="text-green-400 font-semibold">
                                        {results.correctAnswers}/{results.totalQuestions}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Câu đã trả lời:</span>
                                    <span className="text-blue-400 font-semibold">
                                        {results.answeredQuestions}/{results.totalQuestions}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Cấp độ:</span>
                                    <Badge variant="secondary" className="bg-slate-700">
                                        {examData.difficulty_level}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Kỹ năng:</span>
                                    <div className="flex gap-1">
                                        {examData.target_skills.map((skill: string) => (
                                            <Badge key={skill} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                                        <span>Tiến độ hoàn thành</span>
                                        <span>{Math.round((results.answeredQuestions / results.totalQuestions) * 100)}%</span>
                                    </div>
                                    <Progress value={(results.answeredQuestions / results.totalQuestions) * 100} className="h-2 bg-slate-700" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Chi tiết từng câu hỏi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {examData.questions.map((question: any, index: number) => {
                                const userAnswer = answers[question.question_id]
                                const isAnswered = userAnswer !== undefined

                                let isCorrect = false
                                let displayAnswer = "Không trả lời"
                                let correctAnswer = ""

                                if (isAnswered) {
                                    switch (question.question_type) {
                                        case "multiple_choice":
                                        case "reading_comprehension":
                                            isCorrect = userAnswer === question.correct_answer_id
                                            const selectedOption = question.options?.find((opt: any) => opt.id === userAnswer)
                                            displayAnswer = selectedOption ? selectedOption.text : userAnswer
                                            const correctOption = question.options?.find((opt: any) => opt.id === question.correct_answer_id)
                                            correctAnswer = correctOption ? correctOption.text : question.correct_answer_id
                                            break
                                        case "fill_in_the_blank":
                                            isCorrect = userAnswer?.toLowerCase().trim() === question.correct_answer_text?.toLowerCase().trim()
                                            displayAnswer = userAnswer
                                            correctAnswer = question.correct_answer_text
                                            break
                                        case "matching":
                                            if (Array.isArray(userAnswer) && question.correct_matches) {
                                                isCorrect = userAnswer.length === question.correct_matches.length && userAnswer.every((match: any) => question.correct_matches.some((correct: any) => correct.left_id === match.left_id && correct.right_id === match.right_id))
                                            }
                                            displayAnswer = `${Array.isArray(userAnswer) ? userAnswer.length : 0} kết nối`
                                            correctAnswer = `${question.correct_matches?.length || 0} kết nối đúng`
                                            break
                                        case "rearrange_sentences":
                                            if (Array.isArray(userAnswer) && question.correct_order_ids) {
                                                isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correct_order_ids)
                                            }
                                            displayAnswer = "Đã sắp xếp"
                                            correctAnswer = "Thứ tự đúng"
                                            break
                                        case "rewrite_sentence":
                                        case "image_description":
                                        case "listening_comprehension":
                                            isCorrect = userAnswer && userAnswer.trim().length > 10
                                            displayAnswer = userAnswer?.substring(0, 100) + (userAnswer?.length > 100 ? "..." : "")
                                            correctAnswer = question.correct_answer_text || "Câu trả lời mở"
                                            break
                                    }
                                }

                                return (
                                    <div key={question.question_id} className="bg-slate-700 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!isAnswered ? "bg-slate-600 text-slate-400" : isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>{!isAnswered ? <Clock className="w-4 h-4" /> : isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-semibold text-white">Câu {index + 1}</h4>
                                                    <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                                        {question.skill_focus}
                                                    </Badge>
                                                    <Badge variant="secondary" className="bg-slate-600 text-xs">
                                                        {question.score_points} điểm
                                                    </Badge>
                                                </div>

                                                <p className="text-slate-300 mb-3">{question.question_text}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-400">Câu trả lời của bạn:</span>
                                                        <p className={`mt-1 ${isAnswered ? (isCorrect ? "text-green-400" : "text-red-400") : "text-slate-500"}`}>{displayAnswer}</p>
                                                    </div>

                                                    {question.question_type !== "image_description" && question.question_type !== "listening_comprehension" && question.question_type !== "rewrite_sentence" && (
                                                        <div>
                                                            <span className="text-slate-400">Đáp án đúng:</span>
                                                            <p className="text-green-400 mt-1">{correctAnswer}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {question.explanation && (
                                                    <div className="mt-4 p-3 bg-slate-600 rounded text-slate-300 text-sm">
                                                        <strong>Giải thích:</strong> {question.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 justify-center">
                    <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Làm lại bài kiểm tra
                    </Button>
                    {/* <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                        Hoàn thành
                    </Button> */}
                </div>
            </div>
        </div>
    )
}
