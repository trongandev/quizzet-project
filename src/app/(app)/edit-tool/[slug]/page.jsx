"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Select } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { subjectOption } from "@/lib/subjectOption";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useRouter } from "next/navigation";
import { BiSearch, BiTrash } from "react-icons/bi";

export default function EditTool({ params }) {
    const { slug } = params;
    const [quiz, setQuiz] = useState();
    const [quest, setQuest] = useState([]);
    const [so_id, setSo_id] = useState();
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
            const req = await GET_API(`/admin/suboutline/${slug}`, token);
            setQuiz(req);
            setQuest(req.quest.data_so);
            setSo_id(req.quest._id);
        };
        fetchAPI();
    }, []);

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
            id: quiz._id,
            title: quiz.title,
            image: quiz.image,
            subject: quiz.subject,
            status: false,
            quest: quest,
            lenght: quiz.lenght,
            so_id: so_id,
        };
        const req = await POST_API(`/admin/suboutline`, update, "PATCH", token);
        const data = await req.json();
        if (req.ok) {
            router.push("/whatheo/tool");
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
        const image = quiz.image;
        const subject = quiz.subject;

        if (title === "" || image === "" || subject === "") {
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
            image: e.target.value,
        });
    };

    const handleTitle = (e) => {
        setQuiz({
            ...quiz,
            title: e.target.value,
        });
    };

    const [modalAddQuest, setModalAddQuest] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ question: "", answer: "" });

    const showModalAddQuest = () => {
        setModalAddQuest(true);
    };

    const handleOkAddQuest = () => {
        setModalAddQuest(false);
        setQuest([...quest, newQuestion]);
        handleClearField();
    };

    const handleCancelAddQuest = () => {
        setModalAddQuest(false);
    };
    const handleDelete = (index) => () => {
        setQuest(quest.filter((item, i) => i !== index));
    };

    const handleClearField = () => {
        setNewQuestion({ question: "", answer: "" });
    };

    const onChange = (value) => {
        setQuiz({
            ...quiz,
            subject: value,
        });
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setQuiz({
                ...quiz,
                img: text,
            });
        });
    };

    const handleInputChange = (index, field, value) => {
        const updatedQuest = [...quest];
        updatedQuest[index] = { ...updatedQuest[index], [field]: value };
        setQuest(updatedQuest);
    };

    return (
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-full md:w-[1000px]  overflow-y-auto frm-post ">
                <div className="flex items-center flex-row my-3 bg-white ">
                    <div className="w-[150px] h-[100px] overflow-hidden group relative">
                        <Image unoptimized src={quiz?.image} alt="" className="w-full h-[100px] object-cover absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div className="p-3">
                        <h1 className="text-md text-primary font-bold line-clamp-1 h-[24px]">{quiz?.title || "Chưa có tiêu đề?"}</h1>
                        <p className="text-gray-500 line-clamp-1 text-sm h-[20px]">{quiz?.content || "Chưa có nội dung"}</p>
                    </div>
                    <button className="btn btn-primary !bg-orange-500 flex items-center gap-1" onClick={showModal}>
                        <FaRegEdit size={20} />
                        Bấm vào để sửa
                    </button>
                    <Modal title="Thêm hình ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p className="text-gray-500 text-[12px]">* Nhập tiêu đề xong bấm tìm hình ảnh</p>
                        <div className="mt-b flex justify-between gap-1">
                            <input type="text" className="flex-1" onChange={(e) => handleTitle(e)} name="title" id="title" placeholder="Nhập tiêu đề..." value={quiz?.title} />
                            <Link href={`https://www.google.com/search?q=${quiz?.title}&udm=2`} target="_black">
                                <button className="btn btn-primary h-full">
                                    <BiSearch />
                                </button>
                            </Link>
                        </div>

                        <div className="flex gap-1 mt-3 h-[32px]">
                            <button className="btn btn-primary" onClick={handlePaste}>
                                <MdContentPaste />
                            </button>
                            <input type="text" className="" onChange={(e) => handleImage(e)} name="image" id="image" placeholder="Dán URL hình ảnh ở đây..." value={quiz?.image} />
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
                <div className="flex flex-col gap-3 w-full h-[500px] overflow-y-scroll bg-gray-200 border-2 border-gray-500">
                    {quest.map((item, index) => (
                        <div className="flex items-center gap-2 bg-white p-3" key={index}>
                            <p className="w-10 h-10 bg-green-100 flex items-center justify-center text-green-500 font-bold">{index + 1}</p>
                            <div className="w-full">
                                <input placeholder="Nhập câu hỏi?" className="mb-2" name="quest" value={item.question} onChange={(e) => handleInputChange(index, "question", e.target.value)} />
                                <input placeholder="Đáp án?" name="answer" value={item.answer} onChange={(e) => handleInputChange(index, "answer", e.target.value)} />
                            </div>
                            <button className="" onClick={handleDelete(index)}>
                                <BiTrash />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <div className="flex justify-between items-center">
                        <button className="btn btn-second flex gap-1 items-center" onClick={showModalAddQuest}>
                            <CiCirclePlus size={20} />
                            Thêm câu hỏi
                        </button>
                        <button onClick={handlePost} className="btn btn-primary">
                            Cập nhật bài
                        </button>
                    </div>
                    <Modal
                        title="Thêm câu hỏi"
                        open={modalAddQuest}
                        onOk={handleOkAddQuest}
                        onCancel={handleCancelAddQuest}
                        footer={[
                            <Button key="back" onClick={handleClearField}>
                                Xoá
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleOkAddQuest}>
                                Thêm
                            </Button>,
                        ]}>
                        <div className="flex flex-col gap-2">
                            <input placeholder="Nhập câu hỏi?" name="quest" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} />
                            <input placeholder="Đáp án?" name="answer" value={newQuestion.answer} onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })} />
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
