"use client";
import React, { useState } from "react";
import { message, Progress, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BsQuestion } from "react-icons/bs";
import Swal from "sweetalert2";
import { IQuestion } from "@/types/type";

export default function CAnswer({ quiz, question }: { quiz: any; question: any }) {
    const [loading, setLoading] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI || "");
    const handleExplaneAns = async (item: IQuestion, index: any) => {
        try {
            setLoading(index);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const defaultPrompt = `giải thích lựa chọn câu nào, tại sao lại lựa chọn, ngắn gọn xúc tích dễ hiểu, đúng vào trọng tâm, không lòng vòng, không cần nói tóm lại, không cần nói lại sự kì vọng ở cuối câu,trả ra định dạng html có format rõ ràng `;
            const promptValue = `Câu hỏi:  + ${item.question} +  \nA:  + ${item.answers[0]}\nB:  + ${item.answers[1]}\nC:  + ${item.answers[2]}\nD:  + ${
                item.answers[3]
            }\nĐáp án theo tôi nghĩ là đúng, bạn có thể tham khảo:  + ${item.answers[item.correct]}\n`;
            const result = await model.generateContent(promptValue + defaultPrompt);
            Swal.fire({
                title: "Giải thích",
                html: result.response
                    .text()
                    .replace(/```html/g, "")
                    .replace(/```/g, ""),
                icon: "info",
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            messageApi.error(`Lỗi: ${errorMessage}`);
        } finally {
            setLoading(null);
        }
    };

    if (question && !question.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            {contextHolder}

            <div className="px-3 md:px-0 text-third dark:text-white min-h-[80vh]">
                <div className="flex justify-between flex-col md:flex-row gap-5 md:gap-0">
                    <div className="">
                        {quiz?.quiz_id && (
                            <>
                                {" "}
                                <h1 className="text-2xl font-bold text-primary">Bài quiz về chủ đê: {quiz?.quiz_id?.title}</h1>
                                <p className="text-secondary dark:text-white/70" key={quiz.id}>
                                    Nội dung: {quiz?.quiz_id?.content}
                                </p>
                            </>
                        )}

                        <p>
                            Tổng số câu đúng: {quiz?.score}/{quiz.questions?.data_history.length} câu
                        </p>
                        <p>
                            Tổng thời gian làm: {Math.floor(quiz?.time / 3600)}h:{Math.floor((quiz?.time % 3600) / 60)}p:{quiz?.time % 60}s
                        </p>
                    </div>
                    <div className="flex gap-5 text-center justify-center">
                        <div className="">
                            <Progress type="circle" percent={Math.floor((1 / question.length) * (question.length - quiz?.score) * 100)} strokeColor="#ff4d4f" />
                            <p className="text-gray-600 dark:text-white/70 mt-1">Câu sai: {question.length - quiz.score}</p>
                        </div>

                        <div className="">
                            <Progress type="circle" strokeColor="#2187d5" percent={Math.floor((quiz.score / question.length) * 100)} />
                            <p className="text-gray-600 dark:text-white/70 mt-1">Câu đúng: {quiz.score}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    {question.length > 0 &&
                        question?.map((item: any, index: any) => (
                            <div className="bg-linear-item-2  p-5 mt-5 border border-white/10 rounded-md" key={item.id}>
                                <h1 className={` ${item.answer_correct == item.answer_choose ? "text-primary " : "text-red-500"}   mb-3 flex gap-2 items-center`}>
                                    <p className="text-lg font-bold">
                                        Câu {index + 1}: {item.question_name}
                                    </p>
                                    {item.answer_correct == item.answer_choose ? (
                                        <p className="text-white bg-primary px-3 rounded-md text-[12px]">Đúng</p>
                                    ) : (
                                        <p className="text-white bg-red-500 px-3 rounded-md text-[12px]">Sai</p>
                                    )}
                                </h1>
                                <button disabled={loading === index} className=" flex items-center gap-1 btn btn-primary !py-0  text-[12px] mb-1" onClick={() => handleExplaneAns(item, index)}>
                                    {loading === index ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : <BsQuestion />}
                                    Giải thích bằng AI
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {item.answers?.map((answer: string, ansIndex: number) => (
                                        <div
                                            key={ansIndex}
                                            className={` relative  flex items-center  ${item.answer_correct === ansIndex ? "text-primary font-bold" : ""} ${item.answer_choose == ansIndex ? "" : ""}`}>
                                            <input type="radio" name={item.id} className="w-1 invisible" disabled id={`${index}ans${ansIndex}`} defaultChecked={item.answer_correct === ansIndex} />
                                            <label
                                                htmlFor={`${index}ans${ansIndex}`}
                                                className={`absolute font-bold w-10 h-10 flex items-center justify-center rounded-lg ${
                                                    item.answer_correct === ansIndex ? "!bg-primary !text-white " : ""
                                                } ${item.answer_choose == ansIndex ? "!bg-red-500 text-white" : " "}`}>
                                                {ansIndex === 0 ? "A" : ansIndex === 1 ? "B" : ansIndex === 2 ? "C" : "D"}
                                            </label>
                                            <label htmlFor={`${index}ans${ansIndex}`} className="block w-full ml-10 p-3">
                                                {answer}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
