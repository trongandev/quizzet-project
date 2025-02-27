"use client";
import React, { useEffect, useState } from "react";
import { message, Modal, Spin } from "antd";
import { IoIosArrowUp } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";
import { LoadingOutlined } from "@ant-design/icons";
import { IQuiz, IQuestion } from "../types/type";
export default function CQuizDetail({ QuizData, QuestData }: { QuizData?: IQuiz; QuestData: IQuestion[] }) {
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token") || "";
    const [messageApi, contextHolder] = message.useMessage();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (token === undefined) {
            messageApi.open({
                type: "error",
                content: "Bạn chưa đăng nhập, đăng nhập để có thể làm bài",
            });
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSelect = (questionId: string, answerIndex: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };

    function handleQuiz(e: any) {
        e.preventDefault();
        if (Object.keys(selectedAnswers).length !== QuestData.length) {
            messageApi.open({
                type: "warning",
                content: "Vui lòng chọn đáp án cho tất cả câu hỏi",
            });
            return;
        }

        let score = 0;
        QuestData.map((item, index) => {
            if (item.correct === Number(selectedAnswers[index])) {
                score++;
            }
        });
        const pushData = async () => {
            setLoading(true);

            const historyData = {
                quiz_id: QuizData?._id,
                score: score,
                time: seconds,
                questions: [
                    ...QuestData.map((item, index) => {
                        const isTrue = item.correct === Number(selectedAnswers[index]);

                        return {
                            question_id: index,
                            question_name: item.question,
                            answer_choose: selectedAnswers[index],
                            answers: [item.answers[0], item.answers[1], item.answers[2], item.answers[3]],
                            answer_correct: item.correct,
                            status: isTrue,
                        };
                    }),
                ],
            };
            const req = await POST_API("/history", historyData, "POST", token);
            if (req) {
                const data = await req.json();
                if (req.ok) {
                    messageApi.success(data?.message);
                    router.push("/dapan/" + data?.data);
                } else {
                    messageApi.error(data?.message);
                }
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };
        pushData();
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    if (QuestData && QuestData.length <= 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="text-third px-2 md:px-0 min-h-[80vh]">
                <div className="">
                    {QuizData && (
                        <div className="">
                            <h1 className="text-xl font-bold text-primary">{QuizData?.title}</h1>
                            <p className="">{QuizData?.content}</p>
                            <p className="">Tác giả: {QuizData?.uid?.displayName}</p>
                            <p className="">Ngày đăng: {QuizData?.date && handleCompareDate(QuizData?.date)}</p>
                        </div>
                    )}
                </div>
                <form action="" onSubmit={handleQuiz} className="relative flex gap-5 flex-row  mt-1">
                    <div className="w-full md:w-2/3">
                        <div className="h-[80vh] overflow-y-auto scroll-smooth">
                            {QuestData?.map((item, index) => (
                                <div className="bg-linear-item-2 p-5 mt-2 rounded-xl" key={index} id={index.toString()}>
                                    <h1 className="text-lg font-bold text-primary">
                                        Câu {index + 1}: {item.question}{" "}
                                    </h1>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {item.answers.map((answer, idx) => (
                                            <div key={idx} className={`relative flex items-center ${selectedAnswers[index] === idx.toString() ? " text-primary font-bold" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name={item.id.toString()}
                                                    className="w-1 invisible"
                                                    id={`${index}ans${idx}`}
                                                    checked={selectedAnswers[index] === idx.toString()}
                                                    onChange={() => handleSelect(index.toString(), idx.toString())}
                                                />
                                                <label
                                                    htmlFor={`${index}ans${idx}`}
                                                    className={`absolute h-full font-bold px-3 flex items-center justify-center rounded-md ${
                                                        selectedAnswers[index] === idx.toString() ? "bg-primary text-white" : ""
                                                    }`}>
                                                    {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
                                                </label>
                                                <label htmlFor={`${index}ans${idx}`} className=" cursor-pointer block w-full ml-8 p-2">
                                                    {answer}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                            <h1>
                                {Math.floor(seconds / 3600)}h:{Math.floor((seconds % 3600) / 60)}p:{seconds % 60}s
                            </h1>
                            {token != undefined ? (
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading && <Spin indicator={<LoadingOutlined spin />} className="mr-2" size="small" />}
                                    Nộp bài
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    {/* desktop */}
                    <div className="hidden md:block">
                        <div className="w-full h-full">
                            <div className="w-full h-[500px] bg-gray-200 p-5  ">
                                <h1 className="text-lg font-bold text-primary text-center mb-3">Danh sách câu hỏi</h1>
                                <div className="grid grid-cols-5 gap-2 max-h-[420px] overflow-y-scroll pr-2">
                                    {QuestData?.map((item, index) => (
                                        <a
                                            href={`#${index - 1}`}
                                            key={index}
                                            className={`flex items-center justify-center w-[45px] h-[45px] rounded-md ${
                                                selectedAnswers[index] !== undefined ? "bg-primary text-green-100 font-bold" : "bg-red-500 text-red-100"
                                            }`}>
                                            <p>{index + 1}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* mobile */}
                    <div className="fixed right-[10px] bottom-[130px] md:hidden">
                        <div onClick={showModal} className="w-[50px] h-[50px] px-2 bg-red-500 flex items-center justify-center rounded-full text-white animate-bounce">
                            <IoIosArrowUp />
                        </div>
                        <Modal title="Danh sách câu hỏi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div className="">
                                <div className="grid grid-cols-5 gap-3">
                                    {QuestData &&
                                        QuestData.map((item, index) => (
                                            <a
                                                href={`#${index - 1}`}
                                                key={index}
                                                onClick={handleCancel}
                                                className={`flex items-center justify-center w-full h-[55px] ${
                                                    selectedAnswers[index] !== undefined ? "bg-primary text-white font-bold" : "bg-red-500 text-red-100"
                                                }`}>
                                                <p>{index + 1}</p>
                                            </a>
                                        ))}
                                </div>
                            </div>
                        </Modal>
                    </div>
                </form>
            </div>
        </>
    );
}
