import React, { useEffect, useState } from "react";
import { post } from "../../utils/request";
import Swal from "sweetalert2";
import { Button, Modal } from "antd";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Post() {
    const [quiz, setQuiz] = useState({
        title: "Kinh tế chính trị",
        content: "Ôn tập lại các câu hỏi về môn kinh tế chính trị",
        img: "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321140905939.jpg",
    });
    const [quest, setQuest] = useState([
        {
            id: 1,
            question: "Hàng hóa là gì?",
            answers: ["Sản phẩm của lao động", "Tất cả những gì có ích", "Những gì có thể mua bán", "Sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi mua bán"],
            correct: 3,
        },
    ]);

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
                    text: "Vui lòng đăng nhập để tiếp tục",
                    icon: "warning",
                    didClose: () => {
                        navigate("/login");
                    },
                });
            }
        });
    }, []);

    const [defaultValue, setDefaultValue] = useState("");

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

    function handlePost(e) {
        e.preventDefault();
        const title = quiz.title;
        const content = quiz.content;
        const image = quiz.img;

        if (title === "" || image === "" || content === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng điền đầy đủ thông tin ở phần tiêu đề, nội dung, đường dẫn hình ảnh",
            });
            return;
        }

        const db = getFirestore();
        const pushData = async () => {
            try {
                const docRef = await addDoc(collection(db, "quiz"), {
                    title: title,
                    uid: user.uid,
                    content: content,
                    img: image,
                    date_post: new Date().toLocaleDateString("vi-VN"),
                    status: true,
                    questions: quest,
                    default: defaultValue,
                });

                Swal.fire({
                    icon: "success",
                    title: "Thêm bài viết thành công",
                    didClose: () => {
                        navigate("/");
                    },
                });
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    title: "Thêm không thành công",
                    text: "Mã lỗi\n" + e.code,
                });
            }
        };
        pushData();
    }

    const handleImage = (e) => {
        setQuiz({
            ...quiz,
            img: e.target.value,
        });
    };

    const handleTitle = (e) => {
        setQuiz({
            ...quiz,
            title: e.target.value,
        });
    };

    const handleContent = (e) => {
        setQuiz({
            ...quiz,
            content: e.target.value,
        });
    };

    const handleQuest = (e) => {
        const value = e.target.value.trim();
        const questArray = value.split("\n");
        const arr = [];
        setDefaultValue(value);
        for (let i = 0; i < questArray.length; i++) {
            if (questArray[i].trim().endsWith("?") || questArray[i].trim().endsWith(":")) {
                const question = questArray[i].trim();
                const answers = [
                    questArray[i + 1] ? questArray[i + 1].trim().replace("A. ", "") : "",
                    questArray[i + 2] ? questArray[i + 2].trim().replace("B. ", "") : "",
                    questArray[i + 3] ? questArray[i + 3].trim().replace("C. ", "") : "",
                    questArray[i + 4] ? questArray[i + 4].trim().replace("D. ", "") : "",
                ];
                const correct = questArray[i + 5] ? parseInt(questArray[i + 5].trim(), 10) - 1 : 0;

                arr.push({
                    id: i,
                    question,
                    answers,
                    correct,
                });

                i += 5;
            }
        }
        setQuest(arr);
    };

    return (
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-full h-[500px] md:h-auto md:w-[700px] bg-white p-2 md:p-5">
                <form action="" onSubmit={handlePost} className="frm-post my-3 overflow-y-scroll h-[600px]">
                    <h1 className="text-2xl font-bold text-green-500 text-center">Thêm bài quiz mới</h1>
                    <div className="mb-3">
                        <label htmlFor="title" className="block text-md  text-gray-500">
                            Tiêu đề*
                        </label>
                        <input
                            type="text"
                            onChange={(e) => handleTitle(e)}
                            name="title"
                            id="title"
                            className="w-full p-2 border-[1px] border-gray-200"
                            placeholder="Nhập tiêu đề..."
                            value={quiz.title}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="block text-md  text-gray-500">
                            Nội dung
                        </label>
                        <input
                            type="text"
                            onChange={(e) => handleContent(e)}
                            name="content"
                            id="content"
                            className="w-full p-2 border-[1px] border-gray-200"
                            placeholder="Nhập nội dung..."
                            value={quiz.content}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="block text-md  text-gray-500">
                            Đường dẫn hình ảnh*
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                onChange={(e) => handleImage(e)}
                                name="image"
                                id="image"
                                className="w-full p-2 border-[1px] border-gray-200"
                                placeholder="Dán URL hình ảnh ở đây..."
                                value={quiz.img}
                            />
                            <Button className="bg-gray-200 text-gray-500 font-bold h-full" onClick={showModal}>
                                ?
                            </Button>
                            <Modal title="Các lưu ý trong quá trình thêm câu hỏi " open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                <p>
                                    - Phải có kí tự <label className="text-red-500 font-bold">"?" hoặc ":"</label> ở cuối câu hỏi
                                </p>
                                <p>
                                    - Các đáp án chỉ có <label className="text-red-500 font-bold">4</label>
                                </p>
                                <p>
                                    - Bấm phím <label className="text-red-500 font-bold">Enter</label> để xuống đáp án tiếp theo
                                </p>
                                <img src="./guide.png" alt="" className="mt-3 border-[5px] border-green-500 rounded-lg" />
                                <img src="./guide3.png" alt="" className="mt-3 border-[5px] border-green-500 rounded-lg" />
                            </Modal>
                        </div>
                    </div>

                    <div className="my-5">
                        <div className="mb-3">
                            <h1 className="text-2xl font-bold text-green-500 text-center mb-3">Thêm câu hỏi</h1>

                            <div className="block text-sm text-red-500">
                                <div className="flex items-center gap-2">
                                    <p>Click vào đây để xem</p>
                                    <Button className="bg-red-200 text-red-500 font-bold" onClick={showModal}>
                                        Lưu ý
                                    </Button>
                                    <Modal title="Các lưu ý trong quá trình thêm câu hỏi " open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <p>
                                            - Phải có kí tự <label className="text-red-500 font-bold">"?" hoặc ":"</label> ở cuối câu hỏi
                                        </p>
                                        <p>
                                            - Các đáp án chỉ có <label className="text-red-500 font-bold">4</label>
                                        </p>
                                        <p>
                                            - Bấm phím <label className="text-red-500 font-bold">Enter</label> để xuống đáp án tiếp theo
                                        </p>
                                        <img src="./guide.png" alt="" className="mt-3 border-[5px] border-green-500 rounded-lg" />
                                        <img src="./guide3.png" alt="" className="mt-3 border-[5px] border-green-500 rounded-lg" />
                                    </Modal>
                                </div>
                                <p className="font-bold mt-3">Ví dụ:</p>
                                <textarea
                                    type="text"
                                    name="content"
                                    id="content"
                                    className="w-full p-2 border-[1px] border-gray-200 h-[400px] text-xl"
                                    placeholder=""
                                    onChange={(e) => handleQuest(e)}
                                    defaultValue={`Hàng hóa là gì?\nSản phẩm của lao động\nTất cả những gì có ích\nNhững gì có thể mua bán\nSản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi mua bán\n4`}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-right">
                        <button type="submit" className="bg-green-500 text-white ">
                            Thêm bài viết này
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-full md:w-[700px] md:h-[650px] bg-white p-5 overflow-y-auto frm-post">
                <h1 className="text-xl font-bold text-green-500 text-center">Preview</h1>
                <div className="flex items-center justify-center flex-col my-3">
                    <div className=" shadow-md border-2 rounded-lg overflow-hidden group w-[200px] ">
                        {quiz.img ? <img src={quiz.img} alt="" className="w-full h-[100px] object-cover" /> : ""}
                        <div className="p-3">
                            <h1 className="text-md text-green-500 font-bold line-clamp-1 h-[24px]">{quiz.title}</h1>
                            <p className="text-gray-500 line-clamp-1 text-sm h-[20px]">{quiz.content}</p>
                        </div>
                    </div>
                </div>
                <div className="">
                    {quest.map((item, index) => {
                        return (
                            <div className="bg-white p-2 mt-2" key={index}>
                                <h1 className="text-lg font-bold text-green-500 mb-3">
                                    Câu {index + 1}: {item.question}
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {item.answers.map((answer, index) => (
                                        <div key={index} className={`border relative flex items-center ${item.correct === index ? "bg-green-100 text-green-500 font-bold" : ""}`}>
                                            <label className={`absolute h-full flex items-center justify-center font-bold p-3 ${item.correct === index ? "bg-green-500 text-white" : ""}`}>
                                                {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"}
                                            </label>
                                            <input className="w-1 invisible" type="radio" id={item} name={item} checked={item.correct === index} />
                                            <label className="block w-full ml-7 p-3">{answer}</label>
                                        </div>
                                    ))}
                                    <p className="text-green-500 line-clamp-2 h-[48px]`">Đáp án đúng: {item.answers[item.correct]}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
