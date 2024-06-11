import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
export default function Answer() {
    const [question, setQuestion] = useState([]);
    const [quiz, setQuiz] = useState([]);

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const params = useParams();
    useEffect(() => {
        const fetchQuiz = async () => {
            const quest = await get(`history?topic_id=${params.id}`);
            const fetchQuiz = await get(`questions?topic_id=${params.id}`);
            setQuestion(quest[0]);
            setQuiz(fetchQuiz);
        };
        fetchQuiz();
    }, []);

    console.log(quiz);
    console.log(question);

    return (
        <div>
            <div className="flex justify-between">
                <div className="">
                    <h1 className="text-xl font-bold text-green-500">Bài quiz về chủ đê: {question.title}</h1>
                    <p className="text-gray-600" key={question.id}>
                        Nội dung: {question.content}
                    </p>
                </div>
                <div className="">
                    <h1 className="text-xl font-bold text-green-500">
                        Tổng câu đúng: {question.score}/{quiz.length}
                    </h1>
                    <p className="text-gray-600">Tỉ lệ đúng: {Math.floor((question.score / quiz.length) * 100)}%</p>
                </div>
            </div>

            <div className="w-[1000px]">
                {quiz.map((item, index) => (
                    <div className="bg-white p-5 mt-5 shadow-sm border-[1px]" key={item.id}>
                        <h1 className={` ${item.correctAnswer === question.questions[index].answer_id ? "text-green-500" : "text-red-500"}   mb-3 flex gap-2 items-center`}>
                            <p className="text-lg font-bold">
                                Câu {index + 1}: {item.question}
                            </p>
                            {item.correctAnswer === question.questions[index].answer_id ? (
                                <p className="text-green-500 bg-green-100 px-3">Đúng</p>
                            ) : (
                                <p className="text-red-500 bg-red-100 px-3">Sai</p>
                            )}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {item.answers?.map((answer, ansIndex) => (
                                <div
                                    key={ansIndex}
                                    className={`border relative  flex items-center  ${item.correctAnswer === ansIndex ? "bg-green-100 text-green-500 font-bold" : ""} ${
                                        question.questions[index].answer_id === ansIndex ? "bg-red-100 " : ""
                                    }`}>
                                    <input
                                        type="radio"
                                        name={item.id}
                                        className="w-1 invisible"
                                        disabled
                                        id={`${item.id}ans${ansIndex}`}
                                        defaultChecked={item.correctAnswer === ansIndex}
                                        // onChange={() => handleSelect(item.id, ansIndex)}
                                    />
                                    <label
                                        htmlFor={`${item.id}ans${ansIndex}`}
                                        className={`absolute font-bold p-3    ${item.correctAnswer === ansIndex ? "bg-green-400 text-white" : ""} ${
                                            question.questions[index].answer_id === ansIndex ? "bg-red-500 text-white" : " "
                                        }`}>
                                        {ansIndex === 0 ? "A" : ansIndex === 1 ? "B" : ansIndex === 2 ? "C" : "D"}
                                    </label>
                                    <label htmlFor={`${item.id}ans${ansIndex}`} className="block w-full ml-7 p-3">
                                        {answer}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

