"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Popover, Select, Input } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { subjectOption } from "@/lib/subjectOption";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useRouter } from "next/navigation";

export default function Edit({ params }) {
    const { slug } = params;
    const [quiz, setQuiz] = useState();
    const [quest, setQuest] = useState([]);

    const router = useRouter();
    const token = Cookies.get("token");
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                router.push("/login");
            },
        });
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/quiz/${slug}`, token);
            setQuiz(req.quiz);
            setQuest(req.quiz.questions.data_quiz);
        };
        fetchAPI();
    }, []);

    const handleSelect = (questionId, answerIndex) => {
        setQuest((prevQuest) => prevQuest.map((q) => (q.id === questionId ? { ...q, correct: answerIndex } : q)));
    };

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

    const updateData = async () => {
        const update = {
            title: quiz.title,
            content: quiz.content,
            img: quiz.img,
            subject: quiz.subject,
            status: false,
            questions: quest,
        };
        const req = await POST_API(`/quiz/${quiz._id}`, update, "PATCH", token);
        const data = req.json();
        if (req.ok) {
            Swal.fire({
                icon: "success",
                title: data.message,
                text: "Bài vết của bạn sẽ kiểm duyệt trước khi hiển thị",
                didClose() {
                    router.push("/profile");
                },
            });
        } else {
            Swal.fire({
                icon: "error",
                title: data.message,
            });
        }
    };

    function handlePost(e) {
        e.preventDefault();
        const title = quiz.title;
        const content = quiz.content;
        const image = quiz.img;
        const subject = quiz.subject;

        if (title === "" || image === "" || content === "" || subject === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Bấm vào nút sửa để điền thêm thông tin",
                didClose() {
                    window.scrollTo(0, 0);
                },
            });
            return;
        }

        updateData();
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

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const [modalAddQuest, setModalAddQuest] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const showModalAddQuest = () => {
        setModalAddQuest(true);
    };

    const handleOkAddQuest = () => {
        setModalAddQuest(false);
        if (isUpdate) {
            const index = quest.findIndex((item) => item.id === questAddEdit.id);
            quest[index] = questAddEdit;
            setIsUpdate(false);
        } else {
            setQuest([...quest, questAddEdit]);
        }
        handleClearField();
    };

    const handleCancelAddQuest = () => {
        setModalAddQuest(false);
        setIsUpdate(false);
    };

    const handleDelete = (index) => () => {
        setQuest(quest.filter((item, i) => i !== index));
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setQuiz({
                ...quiz,
                img: text,
            });
        });
    };

    const handleUpdateQuest = (id) => {
        const questIndex = quest.findIndex((item) => item.id === id);
        setQuestAddEdit(quest[questIndex]);
        setModalAddQuest(true);
        setIsUpdate(true);
    };

    const [questAddEdit, setQuestAddEdit] = useState({ id: Math.random(), question: "", answers: ["", "", "", ""], correct: 0 });
    const updateAnswer = (index, value) => {
        const newAnswers = [...questAddEdit.answers];
        newAnswers[index] = value;
        setQuestAddEdit({ ...questAddEdit, answers: newAnswers });
    };

    const handleClearField = () => {
        setQuestAddEdit({
            id: Math.random(),
            question: "",
            answers: ["", "", "", ""],
        });
    };

    const onChange = (value) => {
        setQuiz({
            ...quiz,
            subject: value,
        });
    };

    return (
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-full md:w-[1000px]  overflow-y-auto frm-post">
                <div className="flex items-center flex-row my-3 bg-linear-item-2 rounded-xl">
                    <div className="w-[150px] h-[100px] overflow-hidden group relative">
                        <Image unoptimized src={quiz?.img} alt="" className="w-full h-[100px] object-cover absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div className="p-3">
                        <h1 className="text-md text-primary font-bold line-clamp-1 h-[24px]">{quiz?.title || "Chưa có tiêu đề?"}</h1>
                        <p className="text-gray-500 line-clamp-1 text-sm h-[20px]">{quiz?.content || "Chưa có nội dung"}</p>
                    </div>
                    <Button className="text-orange-500 cursor-pointer hover:text-red-500 flex items-center gap-1" onClick={showModal}>
                        <FaRegEdit size={20} />
                        Bấm vào để sửa
                    </Button>
                    <Modal title="Thêm hình ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p className="text-gray-500 text-[12px]">* Nhập tiêu đề xong bấm tìm hình ảnh</p>
                        <div className="mt-b flex items-center justify-between gap-1">
                            <Input type="text" className="rounded-none" onChange={(e) => handleTitle(e)} name="title" id="title" placeholder="Nhập tiêu đề..." value={quiz?.title} />
                            <Link href={`https://www.google.com/search?q=${quiz?.title}&udm=2`} target="_black">
                                <Button className="rounded-none">Tìm hình ảnh này</Button>
                            </Link>
                        </div>
                        <div className="mt-3">
                            <Input type="text" onChange={(e) => handleContent(e)} name="content" id="content" placeholder="Nhập nội dung..." value={quiz?.content} />
                        </div>
                        <div className="flex items-center gap-1 mt-3 h-[32px]">
                            <Button className="rounded-none" onClick={handlePaste}>
                                <MdContentPaste />
                            </Button>
                            <Input type="text" className="rounded-none h-full" onChange={(e) => handleImage(e)} name="image" id="image" placeholder="Dán URL hình ảnh ở đây..." value={quiz?.img} />
                            <Popover
                                content={<Image width={400} src="./guide4.png" alt="" className="" />}
                                title="Cách lấy đường đẫn hình ảnh (Image Address)"
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>
                                <Button className="text-gray-500 font-bold rounded-none">?</Button>
                            </Popover>
                        </div>
                        <Select
                            className="w-full mt-3 rounded-none"
                            showSearch
                            placeholder="Tìm kiếm nghành học - môn học..."
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? "").includes(input)}
                            filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                            options={subjectOption}
                            value={quiz?.subject}
                            onChange={onChange}
                        />
                    </Modal>
                </div>
                <div className="h-[440px] overflow-y-scroll">
                    {quest.map((item, index) => (
                        <div className="bg-linear-item-2 p-5 mt-5 rounded-lg " key={index}>
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-lg font-bold text-primary">
                                    Câu {index + 1}: {item.question}
                                </h1>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleUpdateQuest(item.id)} className="btn-outline hover:text-white hover:border-white">
                                        <MdEdit size={20} />
                                    </button>
                                    <button className="" onClick={handleDelete(index)}>
                                        <IoIosClose size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {item.answers.map((answer, idx) => (
                                    <div key={idx} className={` relative flex items-center ${item.correct === idx ? " text-primary font-bold" : ""}`}>
                                        <input
                                            type="radio"
                                            name={item.id}
                                            className="w-1 invisible"
                                            id={`${item.id}ans${idx}`}
                                            checked={quest[item.id] === idx}
                                            onChange={() => handleSelect(item.id, idx)}
                                        />
                                        <label
                                            htmlFor={`${item.id}ans${idx}`}
                                            className={`absolute h-full font-bold p-3 flex items-center justify-center ${item.correct === idx ? "bg-primary text-white" : ""}`}>
                                            {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
                                        </label>
                                        <label htmlFor={`${item.id}ans${idx}`} className="block w-full ml-7 p-3">
                                            {answer}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <div className="flex justify-between items-center">
                        <button className="flex gap-2 items-center btn-outline" onClick={showModalAddQuest}>
                            <CiCirclePlus size={20} />
                            Thêm câu hỏi
                        </button>
                        <button onClick={handlePost}>Cập nhật bài</button>
                    </div>
                    <Modal
                        title="Thêm câu hỏi"
                        open={modalAddQuest}
                        onOk={handleOkAddQuest}
                        onCancel={handleCancelAddQuest}
                        footer={[
                            <button key="back" className="btn-outline mr-3" onClick={handleClearField}>
                                Xoá
                            </button>,
                            <button key="submit" type="primary" onClick={handleOkAddQuest}>
                                Thêm/Cập nhật
                            </button>,
                        ]}>
                        <Input placeholder="Nhập câu hỏi?" name="quest" value={questAddEdit.question} onChange={(e) => setQuestAddEdit({ ...questAddEdit, question: e.target.value })}></Input>
                        <div className="flex flex-col gap-3 mt-5">
                            <input placeholder="Đáp án A?" name="ans1" value={questAddEdit.answers[0]} onChange={(e) => updateAnswer(0, e.target.value)}></input>
                            <input placeholder="Đáp án B?" name="ans2" value={questAddEdit.answers[1]} onChange={(e) => updateAnswer(1, e.target.value)}></input>
                            <input placeholder="Đáp án C?" name="ans3" value={questAddEdit.answers[2]} onChange={(e) => updateAnswer(2, e.target.value)}></input>
                            <input placeholder="Đáp án D?" name="ans4" value={questAddEdit.answers[3]} onChange={(e) => updateAnswer(3, e.target.value)}></input>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
