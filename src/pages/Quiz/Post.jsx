import React, { useState } from "react";
import { post } from "../../utils/request";
import Swal from "sweetalert2";

export default function Post() {
    const [quiz, setQuiz] = useState({});
    const [quest, setQuest] = useState([
        {
            question: "Đơn vị do độ dài phổ biến ở nước anh là?",
            answers: ["cm", "dm", "m", "inch"],
            correct: 2,
        },
    ]);

    function handlePost(e) {
        e.preventDefault();
        // const title = e.target.title.value;
        // const content = e.target.content.value;
        // const image = e.target.image.value;

        // if (title === "" || content === "" || image === "") {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Vui lòng điền đầy đủ thông tin",
        //     });
        //     return;
        // }

        // const data = {
        //     title: title,
        //     content: content,
        //     img: image,
        //     date_post: new Date().toLocaleDateString("vi-VN"),
        // };

        // const postQuiz = post("topic", data);

        // postQuiz.then((res) => {
        //     if (res) {
        //         Swal.fire({
        //             icon: "success",
        //             title: "Thêm bài viết thành công",
        //             didClose: () => {
        //                 window.location.href = "/";
        //             },
        //         });
        //     }
        // });
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

        for (let i = 0; i < questArray.length; i++) {
            if (questArray[i].trim().endsWith("?")) {
                const question = questArray[i].trim();
                const answers = [
                    questArray[i + 1] ? questArray[i + 1].trim() : "",
                    questArray[i + 2] ? questArray[i + 2].trim() : "",
                    questArray[i + 3] ? questArray[i + 3].trim() : "",
                    questArray[i + 4] ? questArray[i + 4].trim() : "",
                ];
                const correct = questArray[i + 5] ? parseInt(questArray[i + 5].trim(), 10) : null;

                arr.push({
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
        <div className="flex items-center justify-center gap-5">
            <div className="w-[700px] bg-white p-5">
                <h1 className="text-2xl font-bold text-green-500 text-center">Thêm bài quiz mới</h1>
                <form action="" onSubmit={handlePost} className="my-3">
                    <div className="mb-3">
                        <label htmlFor="title" className="block text-md  text-gray-500">
                            Tiêu đề
                        </label>
                        <input type="text" onChange={(e) => handleTitle(e)} name="title" id="title" className="w-full p-2 border-[1px] border-gray-200" placeholder="Nhập tiêu đề..." />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="block text-md  text-gray-500">
                            Nội dung
                        </label>
                        <input type="text" onChange={(e) => handleContent(e)} name="content" id="content" className="w-full p-2 border-[1px] border-gray-200" placeholder="Nhập nội dung..." />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="block text-md  text-gray-500">
                            Đường dẫn hình ảnh
                        </label>
                        <input type="text" onChange={(e) => handleImage(e)} name="image" id="image" className="w-full p-2 border-[1px] border-gray-200" placeholder="Dán URL hình ảnh ở đây..." />
                    </div>

                    <div className="my-5">
                        <div className="mb-3">
                            <h1 className="text-2xl font-bold text-green-500 text-center">Thêm câu hỏi</h1>

                            <div className="block text-sm text-red-500">
                                <p>Lưu ý:</p>
                                <p>
                                    - Phải có kí tự <label className=" font-bold">"?"</label> ở cuối câu hỏi
                                </p>
                                <p className="font-bold mt-3">Ví dụ:</p>
                                <textarea
                                    type="text"
                                    name="content"
                                    id="content"
                                    className="w-full p-2 border-[1px] border-gray-200 h-[150px]"
                                    placeholder=""
                                    onChange={(e) => handleQuest(e)}
                                    defaultValue="Đơn vị đo độ dài phổ biến ở nước anh là?
                                    cm
                                    m
                                    dm
                                    inch
                                    2"></textarea>
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
            <div className="w-[700px] h-[650px] bg-white p-5 overflow-y-auto">
                <h1 className="text-xl font-bold text-green-500 text-center">Preview</h1>
                <div className="flex items-center justify-center flex-col my-3">
                    <div className=" shadow-md border-2 rounded-lg overflow-hidden group w-[200px] ">
                        {quiz.img ? <img src={quiz.img} alt="" className="w-full h-[100px] object-cover" /> : ""}
                        <div className="p-3">
                            <h1 className="text-md text-green-500 font-bold line-clamp-2 h-[48px]">{quiz.title}</h1>
                            <p className="text-gray-500 line-clamp-2 text-sm h-[40px]">{quiz.content}</p>
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
                                        <div key={index} className={`border relative flex items-center ${item.correct - 1 === index ? "bg-green-100 text-green-500 font-bold" : ""}`}>
                                            <label className={`absolute font-bold p-3 ${item.correct - 1 === index ? "bg-green-500 text-white" : ""}`}>
                                                {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"}
                                            </label>
                                            <input className="w-1 invisible" type="radio" id={item} name={item} checked={item.correct - 1 === index} />
                                            <label className="block w-full ml-7 p-3">{answer}</label>
                                        </div>
                                    ))}
                                    <p className="text-green-500">Đáp án đúng: {item.answers[item.correct - 1]}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
