import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Form, Modal, Popover, Select, Input } from "antd";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { subjectOption } from "../../helpers/subject";
import { MdEdit } from "react-icons/md";

export default function PostGUI() {
    const [quiz, setQuiz] = useState({
        title: "",
        content: "",
        img: "",
    });
    const [quest, setQuest] = useState([
        {
            id: 1,
            question: "Ví dụ Hàng hóa là gì?",
            answers: ["Sản phẩm của lao động", "Tất cả những gì có ích", "Những gì có thể mua bán", "Sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi mua bán"],
            correct: 3,
        },
    ]);

    const [user, setUser] = useState();
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSelect = (questionId, answerIndex) => {
        setQuest((prevQuest) => prevQuest.map((q) => (q.id === questionId ? { ...q, correct: answerIndex } : q)));
    };

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

    const onFinish = (values) => {
        const now = new Date();
        const db = getFirestore();
        const pushData = async () => {
            try {
                await addDoc(collection(db, "quiz"), {
                    title: values.title,
                    uid: user.uid,
                    subject: values.subject,
                    author: user.displayName,
                    email: user.email,
                    verify: user.emailVerified,
                    image_author: user.photoURL,
                    content: values.content,
                    img: values.image,
                    noa: 0, //số lần làm bài number of attemps
                    date: format(now, "HH:mm:ss dd/MM/yyyy"),
                    status: false,
                    questions: quest,
                    default: defaultValue,
                });

                Swal.fire({
                    icon: "success",
                    title: "Thêm bài viết thành công",
                    text: "Bài viết của bạn sẽ được kiểm duyệt trước khi hiển thị",
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
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
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

    const handleAddQuest = () => {
        setQuest([...quest, { id: quest.length + 1, question: "", answers: [" ", " ", " ", " "], correct: 0 }]);
    };

    const handleDelete = (index) => () => {
        console.log("a");
        // setQuest(quest.filter((item, i) => i !== index));
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setQuiz({
                ...quiz,
                img: text,
            });
        });
    };

    return (
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-full md:w-[1000px]  overflow-y-auto frm-post">
                <div className="flex items-center flex-row my-3 bg-white">
                    <div className="w-[150px] h-[100px] overflow-hidden group">
                        {quiz.img ? (
                            <img src={quiz.img} alt="" className="w-full h-[100px] object-cover" />
                        ) : (
                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" alt="" className="w-full h-[100px] object-cover" />
                        )}
                    </div>
                    <div className="p-3">
                        <h1 className="text-md text-green-500 font-bold line-clamp-1 h-[24px]">{quiz.title || "Chưa có tiêu đề?"}</h1>
                        <p className="text-gray-500 line-clamp-1 text-sm h-[20px]">{quiz.content || "Chưa có nội dung"}</p>
                    </div>
                    <div className="text-orange-500 cursor-pointer hover:text-red-500" onClick={showModal}>
                        <FaRegEdit size={20} />
                    </div>
                    <Modal title="Thêm hình ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p className="text-gray-500 text-[12px]">* Nhập tiêu đề xong bấm tìm hình ảnh</p>
                        <div className="mt-b flex items-center justify-between gap-1">
                            <Input type="text" className="rounded-none" onChange={(e) => handleTitle(e)} name="title" id="title" placeholder="Nhập tiêu đề..." value={quiz.title} />
                            <Link to={`https://www.google.com/search?q=${quiz.title}&udm=2`} target="_black">
                                <Button className="rounded-none">Tìm hình ảnh này</Button>
                            </Link>
                        </div>
                        <div className="mt-3">
                            <Input type="text" onChange={(e) => handleContent(e)} name="content" id="content" placeholder="Nhập nội dung..." value={quiz.content} />
                        </div>
                        <div className="flex items-center gap-1 mt-3 h-[32px]">
                            <Button className="rounded-none" onClick={handlePaste}>
                                <MdContentPaste />
                            </Button>
                            <Input type="text" className="rounded-none h-full" onChange={(e) => handleImage(e)} name="image" id="image" placeholder="Dán URL hình ảnh ở đây..." value={quiz.img} />
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
                                    <MdEdit />

                                    <div className="cursor-pointer hover:text-red-500" onClick={() => handleDelete(index)}>
                                        <IoIosClose size={25} />
                                    </div>
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
                        <Button className="flex gap-1 items-center" onClick={handleAddQuest}>
                            <CiCirclePlus size={20} />
                            Thêm câu hỏi
                        </Button>
                        <Button onClick={handlePost}>Đăng bài</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
