"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Popover, Select, Input, Form } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { FaBrain, FaRegEdit } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Cookies from "js-cookie";
import Image from "next/image";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { POST_API } from "@/lib/fetchAPI";
import { subjectOption } from "@/lib/subjectOption";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Text() {
    const [quiz, setQuiz] = useState({
        title: "",
        content: "",
        img: "https://www.didongmy.com/vnt_upload/news/05_2024/anh-27-meme-dang-yeu-didongmy.jpg",
    });
    const [quest, setQuest] = useState([
        {
            id: 1,
            question: "Hàng hóa là gì?",
            answers: ["Sản phẩm của lao động", "Tất cả những gì có ích", "Những gì có thể mua bán", "Sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi mua bán"],
            correct: 3,
        },
    ]);

    const { user } = useUser();
    const token = Cookies.get("token");
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get("token");

        if (token === undefined) {
            Swal.fire({
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập để tiếp tục",
                icon: "warning",
                didClose: () => {
                    router.push("/login");
                },
            });
        }
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

    const onFinish = (values) => {
        const pushData = async () => {
            const newQuiz = {
                title: values.title,
                uid: user._id,
                subject: values.subject,
                content: values.content,
                img: values.image,
                noa: 0, //số lần làm bài number of attemps
                status: false,
                questions: quest,
                default: defaultValue,
            };
            const req = await POST_API("/quiz", newQuiz, "POST", token);
            const data = await req.json();
            if (req.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm bài viết thành công",
                    text: "Bài viết của bạn sẽ được kiểm duyệt trước khi hiển thị",
                    didClose: () => {
                        router.push("/login");
                    },
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: data.message,
                });
            }
        };
        pushData();
    };

    const onFinishFailed = (errorInfo) => {};

    // function handlePost(e) {
    //     e.preventDefault();
    //     const title = quiz.title;
    //     const content = quiz.content;
    //     const image = quiz.img;

    //     if (title === "" || image === "" || content === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Oops...",
    //             text: "Vui lòng điền đầy đủ thông tin ở phần tiêu đề, nội dung, đường dẫn hình ảnh",
    //         });
    //         return;
    //     }
    // }

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
    var regex = /^(A|a|B|b|C|c|D|d)\.\s+/;
    const handleQuest = (e) => {
        const value = e.target.value.trim();
        setResponePrompt(value);
        const questArray = value.split("\n");
        const arr = [];
        setDefaultValue(value);
        for (let i = 0; i < questArray.length; i++) {
            if (questArray[i].trim().endsWith("?") || questArray[i].trim().endsWith(":")) {
                const question = questArray[i].trim().replace(/Câu \d+[:.]/g, "");
                const answers = [
                    questArray[i + 1] ? questArray[i + 1].trim().replace(regex, "") : "",
                    questArray[i + 2] ? questArray[i + 2].trim().replace(regex, "") : "",
                    questArray[i + 3] ? questArray[i + 3].trim().replace(regex, "") : "",
                    questArray[i + 4] ? questArray[i + 4].trim().replace(regex, "") : "",
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

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const onChange = (value) => {
        setQuiz({
            ...quiz,
            subject: value,
        });
    };
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);

    const showModalAI = () => {
        setIsModalOpenAI(true);
    };

    const handleOkAI = () => {
        setIsModalOpenAI(false);
    };

    const handleCancelAI = () => {
        setIsModalOpenAI(false);
    };

    const [promptValue, setPromptValue] = useState("");
    const [responePrompt, setResponePrompt] = useState(
        "Hàng hóa là gì?\nSản phẩm của lao động\nTất cả những gì có ích\nNhững gì có thể mua bán\nSản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi mua bán\n4"
    );
    const [loading, setLoading] = useState(false);
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI);

    const handleSendPrompt = async () => {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        var defaultPrompt = ` yêu cầu:

không giải thích hay nói bất cứ thứ gì thêm, nếu người dùng nhập sai thì hãy trả ra yêu cầu người dùng nhập lại. Có câu hỏi - không cần ghi lại chữ câu hỏi 1,2,3..v.v, kết thúc câu hỏi phải có dấu "?" , có 4 đáp án - không cần phải ghi lại chữ đáp án 1,2,3,4. Có 1 đáp án đúng là thứ tự của đáp án ví dụ
Câu hỏi 1
Đáp án 1
Đáp án 2
Đáp án 3
Đáp án 4
4
Câu hỏi 2
Đáp án 1
Đáp án 2
Đáp án 3
Đáp án 4
1`;
        const result = await model.generateContent(promptValue + defaultPrompt);
        var replace = result.response.text().replace(/```/g, "");
        setResponePrompt(replace);
        setLoading(false);
        handleCancelAI();
        handleQuest({ target: { value: replace } });
    };

    return (
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-full h-[500px] md:h-auto md:w-[700px] bg-linear-item-2 p-2 md:p-5 rounded-xl">
                <Form onFinishFailed={onFinishFailed} onFinish={onFinish} autoComplete="off" layout="vertical" className="frm-post my-3 overflow-y-scroll h-[600px]">
                    <h1 className="text-2xl font-bold text-primary text-center mb-5">Thêm bài quiz mới</h1>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Form.Item
                                label="Tiêu đề"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tiêu đề!",
                                    },
                                ]}>
                                <Input type="text" onChange={(e) => handleTitle(e)} name="title" id="title" placeholder="Nhập tiêu đề..." value={quiz.title} />
                            </Form.Item>
                        </div>
                        <div className="flex-1">
                            <Form.Item
                                label="Nghành học - môn học"
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nghành học - môn học!",
                                    },
                                ]}>
                                <Select
                                    className="w-full"
                                    showSearch
                                    placeholder="Tìm kiếm nghành học - môn học..."
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                                    options={subjectOption}
                                    value={quiz.subject}
                                    onChange={onChange}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="mb-3">
                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập nội dung",
                                },
                            ]}>
                            <Input type="text" onChange={(e) => handleContent(e)} name="content" id="content" placeholder="Nhập nội dung..." value={quiz.content} />
                        </Form.Item>
                    </div>
                    <div className="mb-3">
                        <Form.Item
                            label="Đường dẫn hình ảnh"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập đường dẫn hình ảnh",
                                },
                            ]}>
                            <div className="flex items-center">
                                <Input type="text" onChange={(e) => handleImage(e)} name="image" id="image" placeholder="Dán URL hình ảnh ở đây..." value={quiz.img} />
                                <Popover
                                    content={<Image width={400} height={400} src="/guide4.png" alt="" className="" />}
                                    title="Cách lấy đường đẫn hình ảnh (Image Address)"
                                    trigger="click"
                                    open={open}
                                    onOpenChange={handleOpenChange}>
                                    <Button className="text-gray-500 font-bold rounded-none mx-2">?</Button>
                                </Popover>
                            </div>
                        </Form.Item>
                    </div>

                    <div className="my-5">
                        <div className="mb-3">
                            <h1 className="text-2xl font-bold text-primary text-center mb-3">Thêm câu hỏi</h1>

                            <div className="block text-sm text-red-500">
                                <div className="flex items-center justify-between px-3">
                                    <div className="">
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
                                            <Image src="/guide.png" alt="" width={500} height={500} className="mt-3 border-[5px] border-primary rounded-lg" />
                                            <Image src="/guide3.png" alt="" width={500} height={500} className="mt-3 border-[5px] border-primary rounded-lg" />
                                        </Modal>
                                    </div>
                                    <div className="">
                                        <Button className="text-primary cursor-pointer flex items-center gap-1" onClick={showModalAI}>
                                            <FaBrain size={20} />
                                            AI Generate
                                        </Button>
                                        <Modal
                                            title="AI Generate Quiz"
                                            open={isModalOpenAI}
                                            onOk={handleOkAI}
                                            onCancel={handleCancelAI}
                                            footer={[
                                                <Button key="back" onClick={handleCancelAI}>
                                                    Hủy bỏ
                                                </Button>,
                                                <Button key="submit" type="primary" onClick={handleSendPrompt} loading={loading}>
                                                    Tạo Quiz
                                                </Button>,
                                            ]}>
                                            <div className="">
                                                <textarea
                                                    className="resize-none h-24"
                                                    maxLength={1000}
                                                    placeholder="Nhập prompt để tạo ra các bài quiz theo yêu cầu 
                                        Ví dụ: cho tôi 20 bài quiz về tư tưởng hồ chí minh"
                                                    onChange={(e) => setPromptValue(e.target.value)}
                                                />
                                                <p className="text-sm text-red-500">Lưu ý: nếu nó không trả ra gì thì bạn hãy yêu cầu câu hỏi khác</p>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                <textarea
                                    type="text"
                                    name="content"
                                    id="content"
                                    className="w-full p-2 border-[1px] border-gray-200 h-[400px] text-xl mt-3"
                                    placeholder=""
                                    onChange={(e) => handleQuest(e)}
                                    value={responePrompt}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-right">
                        <button type="submit" className=" ">
                            Thêm bài viết này
                        </button>
                    </div>
                </Form>
            </div>
            <div className="w-full md:w-[700px] md:h-[650px] overflow-y-auto frm-post">
                <div className="flex items-center justify-center flex-col my-3">
                    <div className=" shadow-md border-2 rounded-lg overflow-hidden group w-[200px] h-[100px] relative">
                        {quiz.img && <Image src={quiz?.img} alt="" className="absolute w-full h-full  object-cover" fill />}
                        <div className="p-3">
                            <h1 className="text-md text-primary font-bold line-clamp-1 h-[24px]">{quiz.title}</h1>
                            <p className="text-gray-500 line-clamp-1 text-sm h-[20px]">{quiz.content}</p>
                        </div>
                    </div>
                </div>
                <div className="">
                    {quest.map((item, index) => {
                        return (
                            <div className="bg-linear-item-2 p-5 mt-2 rounded-xl" key={index}>
                                <h1 className="text-lg font-bold text-primary mb-3">
                                    Câu {index + 1}: {item.question}
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {item.answers.map((answer, index) => (
                                        <div key={index} className={` relative flex items-center ${item.correct === index ? " text-primary font-bold" : ""}`}>
                                            <label className={`absolute h-full flex items-center justify-center font-bold p-3 ${item.correct === index ? "bg-primary text-white" : ""}`}>
                                                {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"}
                                            </label>
                                            <input className="w-1 invisible" type="radio" id={item} name={item} checked={item.correct === index} />
                                            <label className="block w-full ml-7 p-3">{answer}</label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-primary line-clamp-2 h-[48px]`">Đáp án đúng: {item.answers[item.correct]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
