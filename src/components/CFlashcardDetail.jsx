"use client";
import { GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GiStopSign } from "react-icons/gi";
import { CiShuffle } from "react-icons/ci";
import { Button, message, Modal, Popconfirm, Popover, Select, Spin, Switch } from "antd";
import { FaBrain, FaTrash } from "react-icons/fa6";
import { CloseOutlined, LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { MdEdit, MdOutlineQuestionMark } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import handleCompareDate from "@/lib/CompareDate";
import { IoClose } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { languageOption } from "@/lib/languageOption";

export default function CFlashcardDetail({ id_flashcard }) {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(null);
    const [listFlashcard, setListFlashcard] = useState([]); // danh sách flashcard
    const [blockFlashcard, setBlockFlashcard] = useState({ totalLearned: 0, totalRemembered: 0, totalReviewing: 0 }); // đếm các từ trong flashcard
    const [flashcard, setFlashcard] = useState([]); // các flashcard
    const [filteredFlashcards, setFilteredFlashcards] = useState(flashcard);
    const [isSimple, setIsSimple] = useState(1); // 1: từ chi tiết, 2 đơn giản
    const defaultFlashcard = { _id: "", title: "", define: "", type_of_word: "", transcription: "", example: [], note: "" };
    const [newFlashcard, setNewFlashcard] = useState(defaultFlashcard);
    const [choose, setChoose] = useState(0); // 0 tất cả, 1 đã học, 2 đã nhớ, 3 cần ôn, 4 tiến trình ghi nhớ
    const [disableAudio, setDisableAudio] = useState(false);
    const [openTrick, setOpenTrick] = useState(false);
    // chỉnh sửa list flashcard
    const [openEdit, setOpenEdit] = useState(false);
    const [newListFlashCard, setNewListFlashCard] = useState({});
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    // cập nhật từ trong flashcard
    const [openEditWord, setOpenEditWord] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [editWord, setEditWord] = useState({});
    const router = useRouter();
    const { user } = useUser();

    const [openAddMore, setOpenAddMore] = useState(false);
    const [addMore, setAddMore] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API_WITHOUT_COOKIE(`/flashcards/${id_flashcard}`);
            if (req.ok) {
                const sortedFlashcards = sortFlashcards(req?.listFlashCards?.flashcards);
                setFlashcard(sortedFlashcards);

                setFilteredFlashcards(sortedFlashcards);

                // delete req?.listFlashCards?.flashcards;
                setListFlashcard(req?.listFlashCards);
                setNewListFlashCard({ title: req?.listFlashCards?.title, language: req?.listFlashCards?.language, desc: req?.listFlashCards?.desc, public: req?.listFlashCards?.public });
            }
        };
        fetchAPI();
    }, []);

    useEffect(() => {
        const counts = flashcard?.reduce((acc, card) => {
            acc[card?.status] = (acc[card?.status] || 0) + 1;
            return acc;
        }, {});
        const totalLearned = counts["learned"] || 0;
        const totalRemembered = counts["remembered"] || 0;
        const totalReviewing = counts["reviewing"] || 0;
        setBlockFlashcard({ totalLearned, totalRemembered, totalReviewing });
    }, [flashcard]);

    const sortFlashcards = (flashcards) => {
        return flashcards?.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
    };

    if (!listFlashcard.flashcards) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // showw modal thêm mới từ trong flashcard
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const req = await POST_API("/flashcards", { ...newFlashcard, list_flashcard_id: listFlashcard._id }, "POST", token);
            const res = await req.json();
            if (req.ok) {
                setOpen(false);
                setFilteredFlashcards([res?.flashcard, ...flashcard]);
                setNewFlashcard(defaultFlashcard);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    // show modal thêm nhiều từ mới từ trong flashcard
    const showModalAddMore = () => {
        setOpenAddMore(true);
    };

    const handleOkAddMore = async () => {
        setLoading(true);
        const req = await POST_API("/flashcards/list", { flashcards: addMore, list_flashcard_id: listFlashcard._id }, "POST", token);
        const res = await req.json();
        if (req.ok) {
            setOpenAddMore(false);
            setFlashcard([...res?.flashcards, ...flashcard]);
            setFilteredFlashcards([...res?.flashcards, ...flashcard]);
            setAddMore([]);
            setPrompt("");
            setNewFlashcard(defaultFlashcard);
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        setLoading(false);
    };

    const handleCancelAddMore = () => {
        setOpenAddMore(false);
    };

    const handleSendPrompt = async (method) => {
        try {
            const word = method === 1 ? editWord.title : newFlashcard.title;
            // const word = newFlashcard.title;
            const optimizedPrompt = `
                    Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho từ "${word}" với ngôn ngữ ${listFlashcard?.language}.
                    
                    Yêu cầu:
                    1. Phải cung cấp thông tin chính xác và đầy đủ
                    2. Ví dụ phải thực tế và dễ hiểu
                    3. Ghi chú phải hữu ích cho việc ghi nhớ
                    4. Định dạng JSON phải chính xác
                    
                    Trả về kết quả theo cấu trúc JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:
                    
                    {
                    "title": "", // Từ gốc bằng tiếng ${listFlashcard?.language} (không ghi phiên âm)
                    "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
                    "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
                    "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
                    "example": [
                        {
                        "en": "", // Câu ví dụ bằng ${listFlashcard?.language}
                        "trans": "",// phiên âm theo ví dụ
                        "vi": ""  // Dịch nghĩa tiếng Việt
                        },
                        {
                        "en": "",
                        "trans": "",
                        "vi": ""
                        },
                        {
                        "en": "",
                        "trans": "",
                        "vi": ""
                        },
                        {
                        "en": "",
                        "trans": "",
                        "vi": ""
                        }
                    ],
                    "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
                    }
                    `;
            setLoading(true);

            const req = await POST_API("/flashcards/create-ai", { prompt: optimizedPrompt, list_flashcard_id: listFlashcard._id }, "POST", token);
            const res = await req.json();
            if (res.ok) {
                messageApi.success(res.message);
                setFilteredFlashcards([res?.flashcard, ...filteredFlashcards]);
                setNewFlashcard(defaultFlashcard);
                setOpen(false);
                setPrompt("");
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendPromptAddMore = async () => {
        setLoading(true);

        const optimizedPrompt = `
                Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho danh sách từ "${prompt}" cách nhau bằng dấu , với ngôn ngữ ${listFlashcard?.language}.
                
                Yêu cầu:
                1. Phải cung cấp thông tin chính xác và đầy đủ
                2. Ghi chú phải hữu ích cho việc ghi nhớ
                3. Định dạng JSON phải chính xác
                
                Trả về kết quả theo cấu trúc mảng JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:
                
                [{
                "title": "", // Từ gốc bằng tiếng ${listFlashcard?.language} (không ghi phiên âm)
                "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
                "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
                "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
                "example": [
                    {
                    "en": "", // Câu ví dụ bằng ${listFlashcard?.language}, thêm phiên âm 
                    "trans": "",// phiên âm theo ví dụ
                    "vi": "" // Dịch nghĩa tiếng Việt
                    },
                    {
                    "en": "",
                    "trans": "",
                    "vi": ""
                    },
                    {
                    "en": "",
                    "trans": "",
                    "vi": ""
                    }
                ],
                "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
                }]
                `;
        try {
            const req = await POST_API("/flashcards/list", { prompt: optimizedPrompt, list_flashcard_id: listFlashcard._id }, "POST", token);
            const data = await req.json();
            console.log("data:::", data);
            if (req.ok) {
                messageApi.success(data.message);
                setFilteredFlashcards([...data?.flashcards, ...filteredFlashcards]);
                setOpenAddMore(false);
                setPrompt("");
            }
        } catch (error) {
            messageApi.error("Lỗi khi gửi yêu cầu: " + error.message);
            console.log("Error in handleSendPromptAddMore:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAddMore = (item) => {
        setAddMore((prev) => prev.filter((i) => i !== item));
    };

    const handleChangeInputAddMore = (e, index, key) => {
        const updatedAddMore = addMore.map((item, i) => (i === index ? { ...item, [key]: e.target.value } : item));
        setAddMore(updatedAddMore);
    };

    const speakWord = async (text, type, id) => {
        if (disableAudio) return;
        else {
            setLoadingAudio(id);
            setDisableAudio(true);
            if (listFlashcard?.language == "english") {
                const req = await fetch(`${process.env.API_ENDPOINT}/proxy?audio=${text}&type=${type}`);
                const blob = await req.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
            } else {
                if ("speechSynthesis" in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    if (listFlashcard?.language == "japan") utterance.lang = "ja-JP"; // Thiết lập ngôn ngữ tiếng Nhật
                    if (listFlashcard?.language == "korea") utterance.lang = "ko-KR"; // Thiết lập ngôn ngữ tiếng Hàn
                    if (listFlashcard?.language == "chinese") utterance.lang = "zh-CN"; // Thiết lập ngôn ngữ tiếng Trung
                    window.speechSynthesis.speak(utterance);
                } else {
                    alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech.");
                }
            }
            setLoadingAudio(null);
            setTimeout(() => {
                setDisableAudio(false);
            }, 1000);
        }
    };

    const showPopconfirm = () => {
        setOpenConfirm(true);
    };

    const confirm = async () => {
        setLoading(true);
        const req = await POST_API(`/list-flashcards/${listFlashcard._id}`, {}, "DELETE", token);
        const res = await req.json();
        if (res.ok) {
            messageApi.open({
                type: "success",
                content: res.message,
            });
            router.push("/flashcard");
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        setOpenConfirm(false);
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            // Kiểm tra tổ hợp phím Ctrl + Enter
            handleOk();
        } else if (e.key === "Enter") {
            handleSendPrompt();
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };
    // dùng cho eidt từ trong flashcard
    const handleKeyPressEdit = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            // Kiểm tra tổ hợp phím Ctrl + Enter
            handleOkEditWord();
        } else if (e.key === "Enter") {
            handleSendPrompt(1);
        } else if (e.key === "Escape") {
            setOpenEditWord(false);
        }
    };

    const handleOpenChangeTrick = (newOpen) => {
        setOpenTrick(newOpen);
    };

    const showModalEdit = () => {
        setOpenEdit(true);
    };

    const handleOkEdit = async () => {
        setLoading(true);
        const req = await POST_API("/list-flashcards/" + id_flashcard, newListFlashCard, "PUT", token);
        const res = await req.json();
        if (req.ok) {
            setOpenEdit(false);
            // setListFlashCard([...listFlashCard, res.listFlashCard]);
            listFlashcard.title = newListFlashCard.title;
            listFlashcard.language = newListFlashCard.language;
            listFlashcard.desc = newListFlashCard.desc;
            listFlashcard.public = newListFlashCard.public;
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        setLoading(false);
    };

    const handleCancelEdit = () => {
        setOpenEdit(false);
    };

    const confirmDelete = async (id) => {
        setLoadingConfirm(true);
        const req = await POST_API(`/flashcards/${id}`, { list_flashcard_id: listFlashcard?._id }, "DELETE", token);
        const res = await req.json();
        if (req.ok) {
            setFlashcard((prev) => prev.filter((item) => item._id !== id));
            setFilteredFlashcards((prev) => prev.filter((item) => item._id !== id));
            messageApi.success(res.message);
        } else {
            messageApi.error(res.message);
        }
        setLoadingConfirm(false);
    };

    const handleEditWord = (item) => {
        setEditWord(item);
        showModalEditWord(item._id);
    };

    const showModalEditWord = (id) => {
        setOpenEditWord(id);
    };

    const handleOkEditWord = async () => {
        setLoadingConfirm(true);
        const req = await POST_API("/flashcards/" + editWord._id, { id_flashcard: listFlashcard._id, updateData: editWord }, "PUT", token);
        const res = await req.json();
        if (req.ok) {
            setOpenEditWord(false);
            setFlashcard((prev) => prev.map((flashcard) => (flashcard._id === res.flashcard._id ? res.flashcard : flashcard)));
            setFilteredFlashcards((prev) => prev.map((flashcard) => (flashcard._id === res.flashcard._id ? res.flashcard : flashcard)));

            setEditWord(defaultFlashcard);
            handleCancelEditWord();
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        setLoadingConfirm(false);
    };

    const handleCancelEditWord = () => {
        setOpenEditWord(null);
    };
    const handleSetChoose = (choose) => {
        setChoose(choose);
        const filteredFlashcards = flashcard.filter((item) => {
            if (choose === 1) return item.status === "learned";
            if (choose === 2) return item.status === "remembered";
            if (choose === 3) return item.status === "reviewing";
            return true; // Hiển thị tất cả nếu không có bộ lọc
        });
        setFilteredFlashcards(filteredFlashcards);
    };

    const handlePracticeScience = () => {
        router.push(`/flashcard/practice-science/${listFlashcard?._id}`);
    };

    return (
        <div className="text-third dark:text-white px-3 md:px-0">
            {contextHolder}
            <Link href="/flashcard" className="hover:text-primary hover:underline flex items-center gap-1">
                <IoIosArrowBack /> Quay lại
            </Link>
            <div className="flex items-center gap-2 md:gap-5 md:flex-row flex-col">
                <h1 className="text-2xl font-bold text-primary text-left flex-1">Flashcard: {listFlashcard?.title}</h1>
                {user?._id == listFlashcard?.userId?._id ? (
                    <div className="flex-1 flex justify-between gap-2 items-center">
                        <div className="flex gap-2 items-center h-[36px]">
                            <button className="btn btn-primary h-full !rounded-md" onClick={showModalEdit}>
                                <MdEdit />
                            </button>
                            <button className="btn btn-primary h-full !rounded-md" onClick={showModal}>
                                <IoMdAdd />
                            </button>
                            <button className="btn btn-primary flex items-center gap-1 !rounded-md" onClick={showModalAddMore}>
                                <AiOutlineAppstoreAdd /> Thêm nhiều
                            </button>
                        </div>
                        <div className="">
                            <Popconfirm
                                title="Xóa flashcard này?"
                                description="Bạn chắc chứ? nó sẽ không khôi phục được đâu"
                                onConfirm={confirm}
                                okText="Chắc chắn!"
                                cancelText="Để suy nghĩ lại"
                                okButtonProps={{
                                    loading: loading,
                                }}>
                                <button disabled={user?._id == listFlashcard?.userId} className="btn btn-primary !bg-red-500 flex items-center gap-1" onClick={showPopconfirm}>
                                    <FaTrash /> Xóa
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {/* chỉnh sửa list flashcard*/}
                <Modal title="Chỉnh sửa list từ" open={openEdit} onOk={handleOkEdit} confirmLoading={loading} okText="Chỉnh sửa" onCancel={handleCancelEdit}>
                    <div className="space-y-2">
                        <div className="">
                            <p>Tên list từ</p>
                            <input
                                type="text"
                                placeholder="Tên list từ"
                                className="w-full p-3 border rounded-md"
                                value={newListFlashCard?.title}
                                onChange={(e) => setNewListFlashCard({ ...newListFlashCard, title: e.target.value })}
                            />
                        </div>
                        <div className="">
                            <p>Tiếng phát</p>
                            <Select
                                className="w-full mt-3 rounded-none"
                                showSearch
                                placeholder="Tìm kiếm ngôn ngữ"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                                options={languageOption}
                                value={newListFlashCard?.language}
                                onChange={(value) => setNewListFlashCard({ ...newListFlashCard, language: value })}
                            />
                        </div>
                        <div className="">
                            <p>Mô tả</p>
                            <textarea
                                placeholder="Mô tả"
                                className="w-full p-3 border rounded-md"
                                value={newListFlashCard?.desc}
                                onChange={(e) => setNewListFlashCard({ ...newListFlashCard, desc: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-5"
                                id="public"
                                checked={newListFlashCard?.public}
                                onChange={(e) => setNewListFlashCard({ ...newListFlashCard, public: e.target.checked })}
                            />
                            <label htmlFor="public" className="cursor-pointer">
                                Công khai
                            </label>
                        </div>
                    </div>
                </Modal>
                {/* thêm từ mới */}
                <Modal
                    title="Thêm từ mới"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={loading}
                    okText="Tạo"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        // <Button key="submit" type="primary" loading={loading} onClick={handleAIAndCreate}>
                        //     AI + Tạo
                        // </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                            Tạo
                        </Button>,
                        ,
                    ]}>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <div className="flex gap-2 items-center">
                                    <p className="ml-2">Tên từ mới (nhập rồi bấm vào AI Generate)</p>
                                    <Popover
                                        content={
                                            <div>
                                                <p>Bấm Enter để AI Generate</p>
                                                <p>Bấm Ctrl + Enter để tạo</p>
                                            </div>
                                        }
                                        title="Mẹo nhỏ"
                                        trigger="click"
                                        open={openTrick}
                                        onOpenChange={handleOpenChangeTrick}>
                                        <MdOutlineQuestionMark className="text-red-500" />
                                    </Popover>
                                </div>
                                <input
                                    type="text"
                                    className=""
                                    placeholder="Tên từ mới "
                                    value={newFlashcard?.title}
                                    onChange={(e) => setNewFlashcard({ ...newFlashcard, title: e.target.value })}
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <button className="btn btn-primary flex items-center gap-2 !rounded-md" disabled={loading} onClick={handleSendPrompt}>
                                {loading ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <FaBrain />}
                                AI Generate
                            </button>
                        </div>
                        <div className="">
                            <p className="ml-2">Định nghĩa</p>
                            <input placeholder="Định nghĩa  (bắt buộc)" value={newFlashcard?.define} onChange={(e) => setNewFlashcard({ ...newFlashcard, define: e.target.value })} />
                        </div>
                        <div className="border border-secondary  p-2 rounded-md space-y-2">
                            <p className="text-gray-700">Không yêu cầu phải điền</p>
                            <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <p className="ml-2">Loại từ</p>
                                    <input
                                        type="text"
                                        placeholder="Loại từ (N,V,Adj,...)"
                                        value={newFlashcard?.type_of_word}
                                        onChange={(e) => setNewFlashcard({ ...newFlashcard, type_of_word: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="ml-2">Phiên âm</p>
                                    <input
                                        type="text"
                                        placeholder="Phiên âm"
                                        value={newFlashcard?.transcription}
                                        onChange={(e) => setNewFlashcard({ ...newFlashcard, transcription: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <p className="ml-2">Ví dụ</p>
                                <textarea
                                    placeholder="Ví dụ (tối đa 10 câu)"
                                    className="h-32"
                                    disabled
                                    value={newFlashcard?.example?.map((ex) => `LANG: ${ex.en}\nTRANS: ${ex.trans}\nVIE: ${ex.vi}`).join("\n\n")}
                                />
                            </div>
                            <div className="">
                                <p className="ml-2">Ghi chú</p>
                                <textarea className="h-20" disabled placeholder="Ghi chú" value={newFlashcard?.note} />
                            </div>
                        </div>
                    </div>
                </Modal>
                {/* thêm nhiều từ mới */}
                <Modal title="Thêm nhiều từ mới" open={openAddMore} onOk={handleSendPromptAddMore} confirmLoading={loading} okText="Tạo" onCancel={handleCancelAddMore}>
                    <div className="space-y-3">
                        <div className="flex-1">
                            <p className="">Nhập danh sách từ mới (nhập rồi bấm vào AI Generate)</p>
                            <textarea
                                type="text"
                                className="h-[100px]"
                                placeholder="Nhập list từ cách nhau bằng dấu , ví dụ attendion,transition,drop;"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <p>Tối đa 20 từ để không bị lỗi</p>
                    </div>
                </Modal>
            </div>

            <p className="text-gray-500 italic">{listFlashcard?.desc || "Không có mô tả"}</p>
            <div className="flex gap-2 items-center">
                <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                <Image src={`/flag/${listFlashcard?.language}.svg`} alt="" width={25} height={25} className="rounded-sm border border-gray-400"></Image>
                {listFlashcard?.userId?._id == user?._id && (
                    <p className="hover:underline cursor-pointer" onClick={showModalEdit}>
                        (sửa tiếng phát)
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <p>Người chia sẻ:</p>
                <div className="w-[40px] h-[40px] overflow-hidden relative">
                    <Image src={listFlashcard?.userId?.profilePicture || "/meme.jpg"} alt="" className="rounded-full w-full h-full absolute object-cover" fill />
                </div>
                <Link href={`/profile/${listFlashcard?.userId?._id}`} className="hover:underline">
                    <p title={listFlashcard?.userId?.displayName} className="line-clamp-1">
                        {listFlashcard?.userId?.displayName}
                    </p>
                </Link>
            </div>
            <div className="flex items-center gap-3">
                <Link href={`/flashcard/practice/${listFlashcard?._id}`} className="py-5 block flex-1">
                    <button className="w-full btn btn-primary !rounded-lg">Luyện tập </button>
                </Link>
                <button className="w-full btn bg-secondary !rounded-lg py-5 block flex-1" onClick={handlePracticeScience} disabled={flashcard?.length < 4} title="Phải trên 4 từ mới có thể thực hiện">
                    Luyện tập theo khoa học (beta)
                </button>
            </div>

            <p className="text-gray-700 dark:text-white/50">
                Dựa trên nghiên cứu về{" "}
                <Link className="underline text-primary font-bold" target="_blank" href="https://vmptraining.com/ung-dung-duong-cong-lang-quen-ebbinghaus-de-hoc-tap-hieu-qua/">
                    đường cong lãng quên
                </Link>{" "}
                của Hermann Ebbinghaus , con người cần lặp lại <label className="font-bold">từ 5–7 lần</label> tại các khoảng thời gian khác nhau để <label className="font-bold">ghi nhớ</label> lâu
                dài.
            </p>
            <div className=" h-[80px] my-3 flex flex-1 text-right gap-1 md:gap-3 text-[12px]">
                <div
                    className={`flex-1 flex  flex-col rounded-lg justify-between p-2 md:p-3 cursor-pointer   border-2 ${
                        choose == 0 ? "border-2 border-[#636363] text-[#636363] bg-white dark:bg-slate-800/50" : "bg-[#636363] text-white"
                    }`}
                    onClick={() => handleSetChoose(0)}>
                    <p className="text-left">Tất cả</p>
                    <div className="flex justify-between items-end gap-1">
                        <Switch
                            checkedChildren={isSimple === 1 && "Chi tiết "}
                            unCheckedChildren={isSimple === 2 && "Đơn giản"}
                            checked={isSimple === 1}
                            onChange={(checked) => setIsSimple(checked ? 1 : 2)}
                        />
                        <h1 className="font-bold text-3xl text-right">{flashcard?.length}</h1>
                    </div>
                </div>
                <div
                    className={`flex-1 flex flex-col  rounded-lg justify-between p-2 md:p-3  cursor-pointer border-2  ${
                        choose == 1 ? "border-[#4CAF50] text-[#4CAF50] bg-white dark:bg-slate-800/50" : "bg-[#4CAF50] text-white"
                    }`}
                    onClick={() => handleSetChoose(1)}>
                    <p className="text-left">Đã học</p>
                    <h1 className="font-bold text-3xl text-right">{blockFlashcard?.totalLearned || 0}</h1>
                </div>
                <div
                    className={`flex-1 flex flex-col rounded-lg justify-between p-2 md:p-3 cursor-pointer  border-2 ${
                        choose == 2 ? "border-[#2196F3] text-[#2196F3] bg-white dark:bg-slate-800/50" : "bg-[#2196F3] text-white"
                    }`}
                    onClick={() => handleSetChoose(2)}>
                    <p className="text-left">Đã nhớ</p>
                    <h1 className="font-bold text-3xl text-right">{blockFlashcard?.totalRemembered}</h1>
                </div>
                <div
                    className={`flex-1 flex flex-col rounded-lg justify-between p-2 md:p-3  cursor-pointer   border-2 ${
                        choose == 3 ? "border-[#FFC107] text-[#FFC107] bg-white dark:bg-slate-800/50" : "bg-[#FFC107] text-white"
                    }`}
                    onClick={() => handleSetChoose(3)}>
                    <p className="text-left">Ôn tập</p>
                    <h1 className="font-bold text-3xl text-right">{blockFlashcard?.totalReviewing || 0}</h1>
                </div>
                <div className={`flex-1 flex flex-col rounded-lg justify-between p-2 md:p-3  cursor-pointer bg-[#9C27B0] border-2 text-white`}>
                    <p className="text-left">Ghi nhớ</p>
                    <h1 className="font-bold text-3xl text-right">{listFlashcard?.progress?.rememberedCards}%</h1>
                </div>
            </div>
            <div className="">
                {isSimple === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-secondary dark:text-white">
                        {filteredFlashcards?.map((item, index) => (
                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-5 shadow-sm rounded-xl" key={index}>
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold ${
                                            item?.status === "reviewing" ? "bg-[#FFC107]" : item?.status === "remembered" ? "bg-[#2196F3]" : "bg-[#4CAF50]"
                                        }`}>
                                        {item?.status === "reviewing" ? "Cần ôn tập" : item?.status === "remembered" ? "Đã nhớ" : "Đã học"}
                                    </div>
                                    <div className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold bg-[#4CAF50]`}>Số lần học: {item?.progress?.learnedTimes}</div>
                                    <div className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold bg-[#9C27B0]`}>Ghi nhớ: {item?.progress?.percentage}%</div>
                                </div>
                                <div className="flex items-center justify-between gap-5">
                                    <div className="flex gap-2 items-center font-bold flex-wrap">
                                        <h1 className="text-primary text-lg" title={item?.title}>
                                            {item?.title}
                                        </h1>

                                        <p>{item?.transcription}</p>
                                        {listFlashcard?.language == "english" ? (
                                            <>
                                                <div className="flex items-center gap-1 mr-2 cursor-pointer" onClick={() => speakWord(item?.title, 1, item?._id)}>
                                                    {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                    <p>UK</p>
                                                </div>
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)}>
                                                    {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                    US
                                                </div>
                                            </>
                                        ) : (
                                            <HiMiniSpeakerWave className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)} />
                                        )}
                                    </div>
                                    {user?._id == listFlashcard?.userId?._id ? (
                                        <div className="flex gap-2 items-center">
                                            <TiEdit className="hover:text-primary cursor-pointer" onClick={() => handleEditWord(item)} />
                                            <Popconfirm
                                                title={`Xóa từ "${item?.title}"`}
                                                description="Bạn có chắc muốn xóa từ này không?"
                                                okText="Chắc chắn"
                                                onConfirm={() => confirmDelete(item._id)}
                                                okButtonProps={{
                                                    loading: loadingConfirm,
                                                }}
                                                cancelText="Để suy nghĩ lại"
                                                icon={
                                                    <QuestionCircleOutlined
                                                        style={{
                                                            color: "red",
                                                        }}
                                                    />
                                                }>
                                                <IoClose className="hover:text-red-500 cursor-pointer" />
                                            </Popconfirm>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    {/* model chỉnh sửa từ */}
                                    <Modal
                                        title="Chỉnh sửa từ"
                                        open={openEditWord == item?._id}
                                        onOk={handleOkEditWord}
                                        confirmLoading={loadingConfirm}
                                        cancelText="Hủy bỏ"
                                        okText="Chỉnh sửa"
                                        onCancel={handleCancelEditWord}>
                                        <div className="space-y-3">
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <div className="flex gap-2 items-center">
                                                        <p className="ml-2">Tên từ (nhập rồi bấm vào AI Generate)</p>
                                                        <Popover
                                                            content={
                                                                <div>
                                                                    <p>Bấm Enter để AI Generate</p>
                                                                    <p>Bấm Ctrl + Enter để tạo</p>
                                                                </div>
                                                            }
                                                            title="Mẹo nhỏ"
                                                            trigger="click"
                                                            open={openTrick}
                                                            onOpenChange={handleOpenChangeTrick}>
                                                            <MdOutlineQuestionMark className="text-red-500" />
                                                        </Popover>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className=""
                                                        placeholder="Tên từ mới "
                                                        value={editWord.title}
                                                        onChange={(e) => setEditWord({ ...editWord, title: e.target.value })}
                                                        onKeyDown={handleKeyPressEdit}
                                                    />
                                                </div>
                                                <button className="btn btn-primary flex items-center gap-2" onClick={() => handleSendPrompt(1)}>
                                                    {loading ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "white" }} /> : <FaBrain />}
                                                    AI Generate
                                                </button>
                                            </div>
                                            <div className="">
                                                <p className="ml-2">Định nghĩa</p>
                                                <input placeholder="Định nghĩa  (bắt buộc)" value={editWord.define} onChange={(e) => setEditWord({ ...editWord, define: e.target.value })} />
                                            </div>
                                            <div className="border border-secondary  p-2 rounded-md space-y-2">
                                                <p className="text-gray-700">Không yêu cầu phải điền</p>
                                                <div className="flex gap-3 items-center">
                                                    <div className="flex-1">
                                                        <p className="ml-2">Loại từ</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Loại từ (N,V,Adj,...)"
                                                            value={editWord.type_of_word}
                                                            onChange={(e) => setEditWord({ ...editWord, type_of_word: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="ml-2">Phiên âm</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Phiên âm"
                                                            value={editWord.transcription}
                                                            onChange={(e) => setEditWord({ ...editWord, transcription: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <p className="ml-2">Ví dụ</p>
                                                    <textarea
                                                        placeholder="Ví dụ (tối đa 10 câu)"
                                                        className="h-32"
                                                        onChange={(e) => {
                                                            const updatedExamples = e.target.value.split("\n\n").map((sentence) => {
                                                                const [enLine, transLine, viLine] = sentence.split("\n");
                                                                const en = enLine?.replace(/^LANG: /, "").trim();
                                                                const trans = transLine?.replace(/^TRANS: /, "").trim();
                                                                const vi = viLine?.replace(/^VIE: /, "").trim();
                                                                return { en, trans, vi };
                                                            });
                                                            setEditWord({ ...editWord, example: updatedExamples });
                                                        }}
                                                    />
                                                </div>
                                                <div className="">
                                                    <p className="ml-2">Ghi chú</p>
                                                    <textarea className="h-20" placeholder="Ghi chú" value={editWord.note} onChange={(e) => setEditWord({ ...editWord, note: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                                <p className="font-bold text-gray-600 dark:text-white/60">({item?.type_of_word || "Không có loại từ"})</p>
                                <p className="font-bold text-gray-600 dark:text-white">
                                    Định nghĩa: <span className="italic font-thin">{item?.define}</span>
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-gray-600 dark:text-white/60">Ví dụ: </p>
                                    <p className="text-xs text-gray-600 dark:text-white/60">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                </div>

                                <div className=" border border-secondary dark:border-white/10 rounded-sm px-5 py-3 my-3 h-[220px] overflow-y-auto">
                                    {item?.example?.map((ex, idx) => (
                                        <div key={ex.en} className="mb-1">
                                            <div className="">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-600 dark:text-white/50 font-bold">
                                                        {idx + 1}. {ex.en}
                                                    </p>
                                                    {listFlashcard?.language != "english" && (
                                                        <HiMiniSpeakerWave className="cursor-pointer hover:text-primary" onClick={() => speakWord(ex.en, 2, item?._id + idx)} />
                                                    )}
                                                </div>
                                                <p className="text-gray-600 dark:text-white/50  font-bold">{ex?.trans}</p>
                                                <div className="text-xs text-gray-500 flex">
                                                    {listFlashcard?.language == "english" && (
                                                        <>
                                                            <div className="flex items-center gap-1 mr-3 cursor-pointer hover:text-secondary" onClick={() => speakWord(ex.en, 1, item?._id + idx)}>
                                                                {loadingAudio == item?._id + idx ? (
                                                                    <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} />
                                                                ) : (
                                                                    <HiMiniSpeakerWave />
                                                                )}
                                                                <p>UK</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary" onClick={() => speakWord(ex.en, 2, item?._id + idx)}>
                                                                {loadingAudio == item?._id + idx ? (
                                                                    <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} />
                                                                ) : (
                                                                    <HiMiniSpeakerWave />
                                                                )}
                                                                US
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-white/50 italic">{ex.vi}</p>
                                        </div>
                                    ))}
                                    {item?.example?.length === 0 && <p className="text-gray-500 text-sm">Không có ví dụ...</p>}
                                </div>

                                <p className="font-bold text-gray-600 dark:text-white">
                                    Ghi chú: <span className="italic font-thin">{item?.note}</span>
                                </p>
                            </div>
                        ))}
                        {filteredFlashcards?.length === 0 && <p className="h-[400px] flex items-center justify-center col-span-full">Không có từ nào trong list...</p>}
                    </div>
                )}

                {loading && <Spin indicator={<LoadingOutlined spin />} size="default" className="h-[400px] flex items-center justify-center" />}

                {isSimple === 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
                        {filteredFlashcards?.map((item, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800/50 dark:text-white border border-white/10 p-5 shadow-sm rounded-xl font-bold text-secondary space-y-2">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold ${
                                            item?.status === "reviewing" ? "bg-[#FFC107]" : item?.status === "remembered" ? "bg-[#2196F3]" : "bg-[#4CAF50]"
                                        }`}>
                                        {item?.status}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-primary text-lg" title={item?.title}>
                                            {item?.title}
                                        </h1>
                                        {listFlashcard?.language != "english" && (
                                            <HiMiniSpeakerWave className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)} />
                                        )}
                                    </div>
                                    {user?._id == listFlashcard?.userId?._id && (
                                        <Popconfirm
                                            title={`Xóa từ "${item?.title}"`}
                                            description="Bạn có chắc muốn xóa từ này không?"
                                            okText="Chắc chắn"
                                            onConfirm={() => confirmDelete(item._id)}
                                            okButtonProps={{
                                                loading: loadingConfirm,
                                            }}
                                            cancelText="Để suy nghĩ lại"
                                            icon={
                                                <QuestionCircleOutlined
                                                    style={{
                                                        color: "red",
                                                    }}
                                                />
                                            }>
                                            <IoClose className="hover:text-red-500 cursor-pointer" />
                                        </Popconfirm>
                                    )}
                                </div>
                                <p>{item?.transcription}</p>
                                <div className="flex items-center gap-3">
                                    {listFlashcard?.language == "english" && (
                                        <>
                                            <div className="flex items-center gap-1 mr-2 cursor-pointer" onClick={() => speakWord(item?.title, 1, item?._id)}>
                                                {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                <p>UK</p>
                                            </div>
                                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)}>
                                                {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                US
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p className="font-bold text-gray-600 dark:text-white/70">
                                    Định nghĩa: <span className="italic font-thin">{item?.define}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {filteredFlashcards?.length === 0 && <p className="h-[400px] flex items-center justify-center">Không có từ nào trong list</p>}
            </div>
        </div>
    );
}
