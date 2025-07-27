// "use client"

// import { useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ArrowRight, RotateCcw } from "lucide-react"

// interface MatchingQuestionProps {
//     question: any
// }

// export function MatchingQuestion({ question }: MatchingQuestionProps) {
//     const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
//     const [selectedRight, setSelectedRight] = useState<string | null>(null)

//     const matches = question.answer || []

//     const handleLeftClick = (leftId: string) => {
//         if (selectedLeft === leftId) {
//             setSelectedLeft(null)
//         } else {
//             setSelectedLeft(leftId)
//             if (selectedRight) {
//                 addMatch(leftId, selectedRight)
//                 setSelectedLeft(null)
//                 setSelectedRight(null)
//             }
//         }
//     }

//     const handleRightClick = (rightId: string) => {
//         if (selectedRight === rightId) {
//             setSelectedRight(null)
//         } else {
//             setSelectedRight(rightId)
//             if (selectedLeft) {
//                 addMatch(selectedLeft, rightId)
//                 setSelectedLeft(null)
//                 setSelectedRight(null)
//             }
//         }
//     }

//     const addMatch = (leftId: string, rightId: string) => {
//         // Remove any existing matches for these items
//         const filteredMatches = matches.filter((match) => match.left_id !== leftId && match.right_id !== rightId)

//         const newMatches = [...filteredMatches, { left_id: leftId, right_id: rightId }]
//         onAnswerChange(newMatches)
//     }

//     const removeMatch = (leftId: string, rightId: string) => {
//         const newMatches = matches.filter((match) => !(match.left_id === leftId && match.right_id === rightId))
//         onAnswerChange(newMatches)
//     }

//     const clearAll = () => {
//         onAnswerChange([])
//         setSelectedLeft(null)
//         setSelectedRight(null)
//     }

//     const getMatchForLeft = (leftId: string) => {
//         return matches.find((match) => match.left_id === leftId)
//     }

//     const getMatchForRight = (rightId: string) => {
//         return matches.find((match) => match.right_id === rightId)
//     }

//     const isLeftMatched = (leftId: string) => {
//         return matches.some((match) => match.left_id === leftId)
//     }

//     const isRightMatched = (rightId: string) => {
//         return matches.some((match) => match.right_id === rightId)
//     }

//     return (
//         <Card className="bg-slate-800 border-slate-700">
//             <CardContent className="p-6">
//                 <h3 className="text-xl font-semibold text-white mb-6">{question.question_text}</h3>

//                 <div className="mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <p className="text-slate-300">Nhấp vào một mục bên trái, sau đó nhấp vào mục tương ứng bên phải để tạo kết nối.</p>
//                         <Button variant="outline" size="sm" onClick={clearAll} className="border-slate-600 text-slate-300 bg-transparent">
//                             <RotateCcw className="w-4 h-4 mr-2" />
//                             Xóa tất cả
//                         </Button>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         {/* Left Column */}
//                         <div className="space-y-3">
//                             <h4 className="font-medium text-slate-300 text-center">Từ/Cụm từ</h4>
//                             {question.left_items.map((item: any) => {
//                                 const isMatched = isLeftMatched(item.id)
//                                 const isSelected = selectedLeft === item.id
//                                 const matchedRight = getMatchForLeft(item.id)

//                                 return (
//                                     <div key={item.id} className="relative">
//                                         <Button variant="outline" className={`w-full h-auto p-4 text-left transition-all ${isSelected ? "border-blue-500 bg-blue-500/20 text-blue-400" : isMatched ? "border-green-500 bg-green-500/10 text-green-400" : "border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"}`} onClick={() => handleLeftClick(item.id)}>
//                                             <div className="w-full">
//                                                 <div className="font-medium">{item.text}</div>
//                                                 {isMatched && matchedRight && (
//                                                     <div className="flex items-center justify-between mt-2">
//                                                         <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
//                                                             Đã nối
//                                                         </Badge>
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="sm"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation()
//                                                                 removeMatch(item.id, matchedRight.right_id)
//                                                             }}
//                                                             className="text-red-400 hover:text-red-300 h-6 px-2"
//                                                         >
//                                                             Xóa
//                                                         </Button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </Button>
//                                     </div>
//                                 )
//                             })}
//                         </div>

//                         {/* Connection Visualization */}
//                         <div className="hidden lg:flex flex-col items-center justify-center">
//                             <div className="text-slate-400 text-center">
//                                 <ArrowRight className="w-8 h-8 mx-auto mb-2" />
//                                 <p className="text-sm">Kết nối</p>
//                                 <div className="mt-4 space-y-2">
//                                     {matches.map((match, index) => {
//                                         const leftItem = question.left_items.find((item: any) => item.id === match.left_id)
//                                         const rightItem = question.right_items.find((item: any) => item.id === match.right_id)

//                                         return (
//                                             <div key={index} className="bg-slate-700 rounded-lg p-2 text-xs">
//                                                 <div className="text-green-400 font-medium truncate">{leftItem?.text.substring(0, 15)}...</div>
//                                                 <ArrowRight className="w-3 h-3 mx-auto my-1 text-slate-500" />
//                                                 <div className="text-blue-400 font-medium truncate">{rightItem?.text.substring(0, 15)}...</div>
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-3">
//                             <h4 className="font-medium text-slate-300 text-center">Định nghĩa</h4>
//                             {question.right_items.map((item: any) => {
//                                 const isMatched = isRightMatched(item.id)
//                                 const isSelected = selectedRight === item.id
//                                 const matchedLeft = getMatchForRight(item.id)

//                                 return (
//                                     <div key={item.id} className="relative">
//                                         <Button variant="outline" className={`w-full h-auto p-4 text-left transition-all ${isSelected ? "border-blue-500 bg-blue-500/20 text-blue-400" : isMatched ? "border-green-500 bg-green-500/10 text-green-400" : "border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"}`} onClick={() => handleRightClick(item.id)}>
//                                             <div className="w-full">
//                                                 <div className="font-medium">{item.text}</div>
//                                                 {isMatched && matchedLeft && (
//                                                     <div className="flex items-center justify-between mt-2">
//                                                         <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
//                                                             Đã nối
//                                                         </Badge>
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="sm"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation()
//                                                                 removeMatch(matchedLeft.left_id, item.id)
//                                                             }}
//                                                             className="text-red-400 hover:text-red-300 h-6 px-2"
//                                                         >
//                                                             Xóa
//                                                         </Button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </Button>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Mobile Connection Display */}
//                 <div className="lg:hidden">
//                     <h4 className="font-medium text-slate-300 mb-3">Các kết nối đã tạo:</h4>
//                     {matches.length === 0 ? (
//                         <p className="text-slate-400 text-center py-4">Chưa có kết nối nào</p>
//                     ) : (
//                         <div className="space-y-2">
//                             {matches.map((match, index) => {
//                                 const leftItem = question.left_items.find((item: any) => item.id === match.left_id)
//                                 const rightItem = question.right_items.find((item: any) => item.id === match.right_id)

//                                 return (
//                                     <div key={index} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
//                                         <div className="flex-1">
//                                             <div className="text-green-400 font-medium text-sm">{leftItem?.text}</div>
//                                             <div className="text-blue-400 text-sm mt-1">{rightItem?.text}</div>
//                                         </div>
//                                         <Button variant="ghost" size="sm" onClick={() => removeMatch(match.left_id, match.right_id)} className="text-red-400 hover:text-red-300">
//                                             Xóa
//                                         </Button>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     )}
//                 </div>

//                 {/* Progress */}
//                 <div className="mt-6 bg-slate-700 rounded-lg p-4">
//                     <div className="flex justify-between text-sm text-slate-300 mb-2">
//                         <span>Tiến độ nối câu</span>
//                         <span>
//                             {matches.length}/{question.left_items.length}
//                         </span>
//                     </div>
//                     <div className="w-full bg-slate-600 rounded-full h-2">
//                         <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(matches.length / question.left_items.length) * 100}%` }} />
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
