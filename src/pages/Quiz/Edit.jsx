import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Popover, Select, Input } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { subjectOption } from "../../helpers/subject";
import { MdEdit } from "react-icons/md";
import Cookies from "js-cookie";
import { get_api, post_api } from "../../services/fetchapi";

export default function Edit() {
    const params = useParams();
    const [quiz, setQuiz] = useState();
    const [quest, setQuest] = useState([]);

    const navigate = useNavigate();
    const token = Cookies.get("token");
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                navigate("/login");
            },
        });
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await get_api(`/quiz/${params.id}`);
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
        const req = await post_api(`/quiz/${quiz._id}`, update, "PATCH");
        const data = req.json();
        if (req.ok) {
            Swal.fire({
                icon: "success",
                title: data.message,
                text: "Bài vết của bạn sẽ kiểm duyệt trước khi hiển thị",
                didClose() {
                    navigate("/profile");
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

    const hide = () => {
        setOpen(false);
    };

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
        console.log(quest);
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
                <div className="flex items-center flex-row my-3 bg-white">
                    <div className="w-[150px] h-[100px] overflow-hidden group">
                        {quiz?.img ? (
                            <img src={quiz?.img} alt="" className="w-full h-[100px] object-cover" />
                        ) : (
                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" alt="" className="w-full h-[100px] object-cover" />
                        )}
                    </div>
                    <div className="p-3">
                        <h1 className="text-md text-green-500 font-bold line-clamp-1 h-[24px]">{quiz?.title || "Chưa có tiêu đề?"}</h1>
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
                            <Link to={`https://www.google.com/search?q=${quiz?.title}&udm=2`} target="_black">
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
                                content={<img width={400} src="./guide4.png" alt="" className="" />}
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
                <div className="">
                    {quest.map((item, index) => (
                        <div className="bg-white p-5 mt-5" key={index}>
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-lg font-bold text-green-500">
                                    Câu {index + 1}: {item.question}
                                </h1>
                                <div className="flex items-center gap-1">
                                    <Button onClick={() => handleUpdateQuest(item.id)}>
                                        <MdEdit />
                                    </Button>
                                    <Button className="cursor-pointer hover:text-red-500" onClick={handleDelete(index)}>
                                        <IoIosClose size={25} />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {item.answers.map((answer, idx) => (
                                    <div key={idx} className={`border relative flex items-center ${item.correct === idx ? "bg-green-100 text-green-500 font-bold" : ""}`}>
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
                                            className={`absolute h-full font-bold p-3 flex items-center justify-center ${item.correct === idx ? "bg-green-400 text-white" : ""}`}>
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
                        <Button className="flex gap-1 items-center" onClick={showModalAddQuest}>
                            <CiCirclePlus size={20} />
                            Thêm câu hỏi
                        </Button>
                        <Button onClick={handlePost}>Cập nhật bài</Button>
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
                                Thêm/Cập nhật
                            </Button>,
                        ]}>
                        <Input placeholder="Nhập câu hỏi?" name="quest" value={questAddEdit.question} onChange={(e) => setQuestAddEdit({ ...questAddEdit, question: e.target.value })}></Input>
                        <div className="flex flex-col gap-3 mt-5">
                            <Input placeholder="Đáp án A?" name="ans1" value={questAddEdit.answers[0]} onChange={(e) => updateAnswer(0, e.target.value)}></Input>
                            <Input placeholder="Đáp án B?" name="ans2" value={questAddEdit.answers[1]} onChange={(e) => updateAnswer(1, e.target.value)}></Input>
                            <Input placeholder="Đáp án C?" name="ans3" value={questAddEdit.answers[2]} onChange={(e) => updateAnswer(2, e.target.value)}></Input>
                            <Input placeholder="Đáp án D?" name="ans4" value={questAddEdit.answers[3]} onChange={(e) => updateAnswer(3, e.target.value)}></Input>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
