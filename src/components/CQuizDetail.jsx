"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { message, Modal, Spin, Switch } from "antd";
import { IoIosArrowUp } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";
import { useUser } from "@/context/userContext";
import { BiCheck } from "react-icons/bi";
import { BsQuestion } from "react-icons/bs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CQuizDetail({ QuizData }) {
    const quiz = QuizData;
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
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

    useEffect(() => {
        if (token === undefined) {
            messageApi.open({
                type: "error",
                content: "Bạn chưa đăng nhập, đăng nhập để có thể làm bài",
            });
        }
    }, []);

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
                        <h1 className="text-xl font-bold text-primary">{QuizData?.title}</h1>
                        <p className="">{QuizData?.content}</p>
                        <p className="">Tác giả: {QuizData?.uid.displayName}</p>
                        <p className="">Ngày đăng: {handleCompareDate(QuizData?.date)}</p>
                        <div className="flex gap-3 items-center">
                            <p>Bật check đáp án</p>
                            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" defaultChecked={checkAns} onChange={() => handleChangeCheckAns(!checkAns)} />
                        </div>
                    </div>
                    <form action="" onSubmit={handleQuiz} className="relative flex flex-col  mt-1">
                        <div className="w-full md:w-2/3">
                            <div className=" h-[500px] overflow-y-auto scroll-smooth">
                                {QuizData.questions.data_quiz?.map((item, index) => (
                                    <div className="bg-linear-item-2 p-5 mt-2 rounded-xl" key={index} id={item.id}>
                                        <h1 className="text-lg font-bold text-primary">
                                            Câu {index + 1}: {item.question}{" "}
                                        </h1>
                                        <div className="flex items-center gap-3 my-3">
                                            {checkAns && (
                                                <button className="text-[10px] btn-small flex items-center gap-1" onClick={(e) => handleCheckAns(e, item)}>
                                                    <BiCheck /> Check answer
                                                </button>
                                            )}
                                            <button className="text-[10px] btn-small flex items-center gap-1" onClick={(e) => handleExplaneAns(e, item)}>
                                                <BsQuestion /> Giải thích
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {item.answers.map((answer, index) => (
                                                <div key={index} className={` relative flex items-center ${selectedAnswers[item.id] === index ? " text-primary font-bold" : ""}`}>
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
                                                            selectedAnswers[item.id] === index ? "bg-primary text-white" : ""
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
                                {QuizData.status && token != undefined ? (
                                    <button type="submit" className="">
                                        Nộp bài
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        {/* desktop */}
                        <div className="hidden md:block">
                            <div className="fixed md:w-1/4 p-5 right-5 bottom-[25%]">
                                <div className="w-[240px] bg-gray-200 p-5">
                                    <h1 className="text-lg font-bold text-primary text-center mb-3">Danh sách câu hỏi</h1>
                                    <div className="grid grid-cols-5 gap-2 h-[300px] overflow-y-scroll">
                                        {QuizData.questions.data_quiz?.map((item, index) => (
                                            <a
                                                href={`#${item.id}`}
                                                key={index}
                                                className={`flex items-center justify-center w-full h-[45px] ${
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
                                        {QuizData.questions?.data_quiz.map((item, index) => (
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
