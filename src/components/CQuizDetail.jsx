"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { message, Modal, Spin, Switch } from "antd";
import { IoIosArrowUp } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";
import { BiCheck } from "react-icons/bi";
import { BsQuestion } from "react-icons/bs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CQuizDetail({ QuizData, QuestData }) {
    const quiz = QuizData;
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setLoading(true);
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

    const handleSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };
    function handleQuiz(e) {
        e.preventDefault();
        if (Object.keys(selectedAnswers).length !== QuestData.length) {
            messageApi.open({
                type: "warning",
                content: "Vui lòng chọn đáp án cho tất cả câu hỏi",
            });
            return;
        }

        let score = 0;
        QuestData.map((item) => {
            if (item.correct === selectedAnswers[item.id]) {
                score++;
            }
        });

        const pushData = async () => {
            const historyData = {
                quiz_id: quiz?._id,
                score: score,
                time: seconds,
                questions: [
                    ...QuestData.map((item) => {
                        var isTrue = item.correct === selectedAnswers[item.id];

                        return {
                            question_id: item.id,
                            question_name: item.question,
                            answer_choose: selectedAnswers[item.id],
                            answers: [item.answers[0], item.answers[1], item.answers[2], item.answers[3]],
                            answer_correct: item.correct,
                            status: isTrue,
                        };
                    }),
                ],
            };
            const req = await POST_API("/history", historyData, "POST", token);
            const data = await req.json();
            if (req.ok) {
                messageApi.open({
                    type: "success",
                    content: data.message,
                });
                setTimeout(() => {
                    router.push("/dapan/" + data.id_history);
                }, 3000);
            } else {
                messageApi.open({
                    type: "error",
                    content: data.message,
                });
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

    const handleCheckAns = (e, item) => {
        e.preventDefault();
        Swal.fire({
            title: "Đáp án đúng",
            text: item.answers[item.correct],
            icon: "info",
        });
    };

    const [checkAns, setCheckAns] = useState(false);
    const handleChangeCheckAns = (checked) => {
        setCheckAns(checked);
    };

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI);
    const handleExplaneAns = async (e, item) => {
        e.preventDefault();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        var defaultPrompt = `giải thích lựa chọn câu nào, tại sao lại lựa chọn, ngắn gọn xúc tích dễ hiểu, đúng vào trọng tâm, không lòng vòng, không cần nói tóm lại, không cần nói lại sự kì vọng ở cuối câu,trả ra định dạng html có format rõ ràng `;
        var promptValue = `Câu hỏi:  + ${item.question} +  \nA:  + ${item.answers[0]}\nB:  + ${item.answers[1]}\nC:  + ${item.answers[2]}\nD:  + ${
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
    };
    return (
        <>
            {contextHolder}
            {loading ? (
                <div className="text-third px-2 md:px-0">
                    <div className="">
                        {QuizData && (
                            <div className="">
                                <h1 className="text-xl font-bold text-primary">{QuizData?.title}</h1>
                                <p className="">{QuizData?.content}</p>
                                <p className="">Tác giả: {QuizData?.uid.displayName}</p>
                                <p className="">Ngày đăng: {handleCompareDate(QuizData?.date)}</p>
                            </div>
                        )}

                        <div className="flex gap-3 items-center">
                            <p>Bật check đáp án</p>
                            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" defaultChecked={checkAns} onChange={() => handleChangeCheckAns(!checkAns)} />
                        </div>
                    </div>
                    <form action="" onSubmit={handleQuiz} className="relative flex gap-5 flex-row  mt-1">
                        <div className="w-full md:w-2/3">
                            <div className=" h-[500px] overflow-y-auto scroll-smooth">
                                {QuestData?.map((item, index) => (
                                    <div className="bg-linear-item-2 p-5 mt-2 rounded-xl" key={index} id={item.id}>
                                        <h1 className="text-lg font-bold text-primary">
                                            Câu {index + 1}: {item.question}{" "}
                                        </h1>
                                        <div className="flex items-center gap-3 my-3">
                                            {checkAns && (
                                                <button className="text-[10px] btn-small !bg-secondary flex items-center gap-1" onClick={(e) => handleCheckAns(e, item)}>
                                                    <BiCheck /> Check answer
                                                </button>
                                            )}
                                            <button className=" flex items-center gap-1 btn-small !bg-secondary" onClick={(e) => handleExplaneAns(e, item)}>
                                                <BsQuestion /> Giải thích bằng AI
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {item.answers.map((answer, idx) => (
                                                <div key={idx} className={` relative flex items-center ${selectedAnswers[item.id] === idx ? " text-primary font-bold" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name={item.id}
                                                        className="w-1 invisible"
                                                        id={`${index}ans${idx}`}
                                                        checked={selectedAnswers[item.id] === index}
                                                        onChange={() => handleSelect(item.id, idx)}
                                                    />
                                                    <label
                                                        htmlFor={`${index}ans${idx}`}
                                                        className={`absolute  h-full font-bold px-3 flex items-center justify-center rounded-md ${
                                                            selectedAnswers[item.id] === idx ? "bg-primary text-white" : ""
                                                        }`}>
                                                        {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
                                                    </label>
                                                    <label htmlFor={`${index}ans${idx}`} className="block w-full ml-8 p-2">
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
                                    <button type="submit" className="btn btn-primary">
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
                                    <div className="grid grid-cols-5 gap-2 h-[420px] overflow-y-scroll pr-2">
                                        {QuestData?.map((item, index) => (
                                            <a
                                                href={`#${item.id}`}
                                                key={index}
                                                className={`flex items-center justify-center w-[45px] h-[45px] rounded-md ${
                                                    selectedAnswers[item.id] !== undefined ? "bg-primary text-green-100 font-bold" : "bg-red-500 text-red-100"
                                                }`}>
                                                <p>{index + 1}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* mobile */}
                        <div className="fixed right-[10px] bottom-[60px] md:hidden">
                            <div onClick={showModal} className="w-[50px] h-[50px] px-2 bg-red-500 flex items-center justify-center rounded-full text-white animate-bounce">
                                <IoIosArrowUp />
                            </div>
                            <Modal title="Danh sách câu hỏi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                <div className="">
                                    <div className="grid grid-cols-5 gap-3">
                                        {QuestData.map((item, index) => (
                                            <a
                                                href={`#${item.id}`}
                                                key={index}
                                                onClick={handleCancel}
                                                className={`flex items-center justify-center w-full h-[55px] ${
                                                    selectedAnswers[item.id] !== undefined ? "bg-primary text-white font-bold" : "bg-red-500 text-red-100"
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
            ) : (
                <div className="w-full h-[500px] flex items-center justify-center">
                    <Spin />
                </div>
            )}
        </>
    );
}
