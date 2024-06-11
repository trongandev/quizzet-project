import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
export default function Quiz() {
    const [quiz, setQuiz] = useState([]);
    const [question, setQuestion] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [saveAns, setSaveAns] = useState({});
    const params = useParams();
    useEffect(() => {
        const fetchQuiz = async () => {
            const res = await get(`topic?id=${params.id}`);
            const quest = await get(`questions?topic_id=${params.id}`);
            setQuiz(res[0]);
            setQuestion(quest);
        };
        fetchQuiz();
    }, []);

    const handleSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };
    function handleQuiz(e) {
        e.preventDefault();
        let score = 0;
        question.map((item) => {
            if (item.correctAnswer === selectedAnswers[item.id]) {
                score++;
            }
        });

        const data = {
            topic_id: quiz.id,
            user_id: getCookie("id"),
            title: quiz.title,
            content: quiz.content,
            score: score,
            date: new Date().toLocaleDateString("vi-VN"),
            questions: [
                ...question.map((item) => {
                    var isTrue = item.correctAnswer === selectedAnswers[item.id];

                    return {
                        question_id: item.id,
                        answer_id: selectedAnswers[item.id],
                        answer: item.answers[selectedAnswers[item.id]],
                        status: isTrue,
                    };
                }),
            ],
        };

        const checkIDQuiz = get("history?topic_id=" + quiz.id + "&user_id=" + getCookie("id"));
        checkIDQuiz.then((res) => {
            if (res.length === 0) {
                post("history", data);

                Swal.fire({
                    icon: "success",
                    title: "Nộp bài thành công\nBạn được " + score + " điểm",
                    willClose: () => {
                        window.location.href = "/answer/" + params.id;
                    },
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Bạn đã làm bài quiz này rồi",
                    willClose: () => {
                        window.location.href = "/";
                    },
                });
            }
        });
    }

    return (
        <div className="">
            <div className="">
                <h1 className="text-xl font-bold text-green-500">Bài quiz về chủ đê: {quiz.title}</h1>
                <p className="text-gray-600">Nội dung: {quiz.content}</p>
            </div>
            <form action="" onSubmit={handleQuiz} className="relative flex">
                <div className="w-2/3 ">
                    {question.map((item, index) => (
                        <div className="bg-white p-5 mt-2" key={item.id} id={item.id}>
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
                                        <label htmlFor={`${item.id}ans${index}`} className={`absolute font-bold p-3 ${selectedAnswers[item.id] === index ? "bg-green-400 text-white" : ""}`}>
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
                    <div className="mt-5 text-right">
                        <button type="submit" className="bg-green-500 text-white">
                            Nộp bài
                        </button>
                    </div>
                </div>
                <div className="fixed w-1/4 p-5 right-5 bg-gray-200">
                    <div className=" h-[500px]">
                        <h1 className="text-lg font-bold text-green-500 text-center mb-3">Danh sách câu hỏi</h1>
                        <div className="grid grid-cols-4 gap-3">
                            {question.map((item, index) => (
                                <a
                                    href={`#${item.id}`}
                                    key={index}
                                    className={`flex items-center justify-center w-[50px] h-[50px] ${
                                        selectedAnswers[item.id] !== undefined ? "bg-green-500 text-green-100 font-bold" : "bg-red-500 text-red-100"
                                    }`}>
                                    <p>{index + 1}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
