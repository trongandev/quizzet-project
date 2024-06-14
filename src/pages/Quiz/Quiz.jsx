import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
import { collection, getDocs, getFirestore } from "firebase/firestore";
export default function Quiz() {
    const [question, setQuestion] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [saveAns, setSaveAns] = useState({});
    const params = useParams();

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const querySnapshot = await getDocs(collection(db, "quiz"));
            querySnapshot.forEach((doc) => {
                if (doc.id === params.id) {
                    setQuestion(doc.data());
                }
            });
        };
        fetchBook();
    }, []);

    console.log(question);

    const handleSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };
    function handleQuiz(e) {
        e.preventDefault();
        if (Object.keys(selectedAnswers).length !== question.questions.length) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng chọn đáp án cho tất cả câu hỏi",
            });
            return;
        }

        let score = 0;
        question.questions.map((item) => {
            if (item.correctAnswer === selectedAnswers[item.id]) {
                score++;
            }
        });

        const data = {
            username: getCookie("username"),
            title: question.title,
            content: question.content,
            score: score,
            date: new Date().toLocaleDateString("vi-VN"),
            questions: [
                ...question.questions.map((item) => {
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

        console.log(data);

        // const checkIDQuiz = get("history?title=" + question.title + "&username=" + getCookie("username"));
        // checkIDQuiz.then((res) => {
        //     if (res.length === 0) {
        //         post("history", data);

        //         Swal.fire({
        //             icon: "success",
        //             title: "Nộp bài thành công\nBạn được " + score + " điểm",
        //             willClose: () => {
        //                 window.location.href = "/answer/" + params.title;
        //             },
        //         });
        //     } else {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Bạn đã làm bài quiz này rồi",
        //             willClose: () => {
        //                 window.location.href = "/";
        //             },
        //         });
        //     }
        // });
    }

    return (
        <div className="">
            <div className="">
                <h1 className="text-xl font-bold text-green-500">Bài quiz về chủ đê: {question.title}</h1>
                <p className="text-gray-600">Nội dung: {question.content}</p>
            </div>
            <form action="" onSubmit={handleQuiz} className="relative flex">
                <div className="w-full md:w-2/3 ">
                    {question.questions?.map((item, index) => (
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
                                            className={`absolute  h-full font-bold p-3 flex items-center justify-center ${selectedAnswers[item.id] === index ? "bg-green-400 text-white" : ""}`}>
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
                <div className="hidden md:fixed md:w-1/4 p-5 right-5 ">
                    <div className=" w-[240px] bg-gray-200 p-5">
                        <h1 className="text-lg font-bold text-green-500 text-center mb-3">Danh sách câu hỏi</h1>
                        <div className="grid grid-cols-4 gap-3">
                            {question.questions?.map((item, index) => (
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
