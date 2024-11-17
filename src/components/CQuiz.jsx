"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Modal, Spin } from "antd";
import { IoIosArrowUp } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";
import { useUser } from "@/context/userContext";

export default function CQuiz({ QuizData }) {
    const quiz = QuizData;
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");
    useEffect(() => {
        if (!QuizData) {
            Swal.fire({
                title: "Không tìm thấy bài quiz",
                text: "Bài quiz bạn tìm không tồn tại hoặc đã bị xóa",
                icon: "error",
                didClose: () => {
                    router.push("/");
                },
            });
        } else {
            setLoading(true);
        }
    }, []);

    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập để làm bài này",
            icon: "warning",
            didClose: () => {
                router.push("/login");
            },
        });
    }

    const handleSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };
    const { user } = useUser();
    function handleQuiz(e) {
        e.preventDefault();
        if (Object.keys(selectedAnswers).length !== quiz.questions.data_quiz.length) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng chọn đáp án cho tất cả câu hỏi",
            });
            return;
        }

        let score = 0;
        quiz.questions.data_quiz.map((item) => {
            if (item.correct === selectedAnswers[item.id]) {
                score++;
            }
        });

        const pushData = async () => {
            const historyData = {
                uid: user._id,
                id_quiz: quiz._id,
                author: user.displayName || user.email,
                title: quiz.title,
                content: quiz.content,
                image_quiz: quiz.img,
                score: score,
                questions: [
                    ...quiz.questions.data_quiz.map((item) => {
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
                Swal.fire({
                    icon: "success",
                    title: "Gửi bài thành công",
                    didClose: () => {
                        router.push("/dapan/" + data.id_history);
                    },
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gửi bài không thành công",
                    text: "Mã lỗi\n" + data.message,
                });
            }
            await POST_API(`/quiz/${quiz._id}`, { noa: quiz.noa }, "PATCH", token);
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
    return (
        <>
            {loading ? (
                <div className="">
                    <div className="">
                        <h1 className="text-xl font-bold text-green-500">{QuizData?.title}</h1>
                        <p className="text-gray-600">{QuizData?.content}</p>
                        <p className="text-gray-600">Tác giả: {QuizData?.uid.displayName}</p>
                        <p className="text-gray-600">Ngày đăng: {handleCompareDate(QuizData?.date)}</p>
                    </div>
                    <form action="" onSubmit={handleQuiz} className="relative flex flex-col">
                        <div className="w-full md:w-2/3">
                            <div className=" h-[500px] overflow-y-auto scroll-smooth">
                                {QuizData.questions.data_quiz?.map((item, index) => (
                                    <div className="bg-white p-5 mt-2" key={index} id={item.id}>
                                        <h1 className="text-lg font-bold text-green-500 mb-3">
                                            Câu {index + 1}: {item.question}
                                        </h1>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {item.answers.map((answer, index) => (
                                                <div key={index} className={`border relative flex items-center ${selectedAnswers[item.id] === index ? "bg-green-100 text-green-500 font-bold" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name={item.id}
                                                        className="w-1 invisible"
                                                        id={`${item.id}ans${index}`}
                                                        checked={selectedAnswers[item.id] === index}
                                                        onChange={() => handleSelect(item.id, index)}
                                                    />
                                                    <label
                                                        htmlFor={`${item.id}ans${index}`}
                                                        className={`absolute  h-full font-bold p-3 flex items-center justify-center ${
                                                            selectedAnswers[item.id] === index ? "bg-green-400 text-white" : ""
                                                        }`}>
                                                        {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"}
                                                    </label>
                                                    <label htmlFor={`${item.id}ans${index}`} className="block w-full ml-7 p-3">
                                                        {answer}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 md:text-right">
                                {QuizData.status ? (
                                    <button type="submit" className="bg-green-500 text-white">
                                        Nộp bài
                                    </button>
                                ) : (
                                    <p className="text-red-500">Bài quiz đang kiểm duyệt không thể nộp bài</p>
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="fixed md:w-1/4 p-5 right-5 top-[70px]">
                                <div className=" w-[240px] bg-gray-200 p-5">
                                    <h1 className="text-lg font-bold text-green-500 text-center mb-3">Danh sách câu hỏi</h1>
                                    <div className="grid grid-cols-5 gap-2">
                                        {QuizData.questions.data_quiz?.map((item, index) => (
                                            <a
                                                href={`#${item.id}`}
                                                key={index}
                                                className={`flex items-center justify-center w-full h-[45px] ${
                                                    selectedAnswers[item.id] !== undefined ? "bg-green-500 text-green-100 font-bold" : "bg-red-500 text-red-100"
                                                }`}>
                                                <p>{index + 1}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fixed right-[10px] bottom-[60px] md:hidden">
                            <div onClick={showModal} className="w-[50px] h-[50px] px-2 bg-red-500 flex items-center justify-center rounded-full text-white animate-bounce">
                                <IoIosArrowUp />
                            </div>
                            <Modal title="Danh sách câu hỏi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                <div className="">
                                    <div className="grid grid-cols-5 gap-3">
                                        {QuizData.questions?.data_quiz.map((item, index) => (
                                            <a
                                                href={`#${item.id}`}
                                                key={index}
                                                onClick={handleCancel}
                                                className={`flex items-center justify-center w-full h-[55px] ${
                                                    selectedAnswers[item.id] !== undefined ? "bg-green-500 text-green-100 font-bold" : "bg-red-500 text-red-100"
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
