import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { Button, Modal } from "antd";
import { IoIosArrowUp } from "react-icons/io";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

export default function Quiz() {
    const [question, setQuestion] = useState([]);
    const [IdQuiz, setIdQuiz] = useState();
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [saveAns, setSaveAns] = useState({});
    const params = useParams();

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const querySnapshot = await getDocs(collection(db, "quiz"));
            let found = false;

            querySnapshot.forEach((doc) => {
                if (doc.id === params.id) {
                    setIdQuiz(doc.id);
                    setQuestion(doc.data());
                    found = true;
                }
            });

            if (!found) {
                Swal.fire({
                    title: "Không tìm thấy bài quiz",
                    text: "Bài quiz bạn tìm không tồn tại hoặc đã bị xóa",
                    icon: "error",
                    didClose: () => {
                        navigate("/");
                    },
                });
            }
        };
        fetchBook();
    }, []);

    const [user, setUser] = useState();
    const auth = getAuth();
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                Swal.fire({
                    title: "Bạn chưa đăng nhập",
                    text: "Vui lòng đăng nhập để làm bài này",
                    icon: "warning",
                    didClose: () => {
                        navigate("/login");
                    },
                });
            }
        });
    }, []);

    const handleSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };

    // tăng 1 số lượng người đã làm bài
    const handleIncNOA = async (id) => {
        const quizDocRef = doc(db, "quiz", id);

        try {
            await updateDoc(quizDocRef, {
                noa: question.noa + 1,
            });
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
        }
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
            if (item.correct === selectedAnswers[item.id]) {
                score++;
            }
        });

        const db = getFirestore();

        const pushData = async () => {
            const now = new Date();
            try {
                const docRef = await addDoc(collection(db, "histories"), {
                    username: user.displayName || user.email,
                    image: user.photoURL,
                    uid: user.uid,
                    title: question.title,
                    content: question.content,
                    score: score,
                    date: format(now, "HH:mm:ss dd/MM/yyyy"),
                    idQuiz: IdQuiz,
                    questions: [
                        ...question.questions.map((item) => {
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
                });

                Swal.fire({
                    icon: "success",
                    title: "Gửi bài thành công",
                    didClose: () => {
                        navigate("/answer/" + docRef.id);
                    },
                });
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    title: "Gửi bài không thành công",
                    text: "Mã lỗi\n" + e,
                });
            }
        };
        pushData();
        handleIncNOA(params.id);
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
        <div className="">
            <div className="">
                <h1 className="text-xl font-bold text-green-500">{question.title}</h1>
                <p className="text-gray-600">{question.content}</p>
                <p className="text-gray-600">Tác giả: {question.author || question.email}</p>
                <p className="text-gray-600">Ngày đăng: {question.date_post}</p>
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
                    <div className="mt-5 md:text-right">
                        {question.status ? (
                            <button type="submit" className="bg-green-500 text-white">
                                Nộp bài
                            </button>
                        ) : (
                            "Bài quiz đang kiểm duyệt không thể nộp bài"
                        )}
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="fixed md:w-1/4 p-5 right-5 ">
                        <div className=" w-[240px] bg-gray-200 p-5">
                            <div className="">
                                <h1 className="text-lg font-bold text-green-500 text-center mb-3">Công cụ</h1>
                            </div>
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
                </div>
                <div className="fixed right-[10px] bottom-[60px] md:hidden">
                    <div onClick={showModal} className="w-[50px] h-[50px] px-2 bg-red-500 flex items-center justify-center rounded-full text-white animate-bounce">
                        <IoIosArrowUp />
                    </div>
                    <Modal title="Danh sách câu hỏi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <div className="p-2">
                            <div className="grid grid-cols-5 gap-3">
                                {question.questions?.map((item, index) => (
                                    <a
                                        href={`#${item.id}`}
                                        key={index}
                                        onClick={handleCancel}
                                        className={`flex items-center justify-center w-full h-[58px] ${
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
    );
}
