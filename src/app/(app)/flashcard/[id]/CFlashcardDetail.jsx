"use client";
import { GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { Button, message, Modal, Popconfirm, Popover, Select, Spin, Switch } from "antd";
import { FaBrain, FaTrash } from "react-icons/fa6";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { MdEdit, MdOutlineQuestionMark } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { languageOption } from "@/lib/languageOption";
import { optimizedPromptFCMore, optimizedPromptFCSingle } from "@/lib/optimizedPrompt";
import ItemFC from "./ItemFCDetail";
import ItemFCSimple from "./ItemFCSimple";
import { EdgeSpeechTTS } from "@lobehub/tts";
export default function CFlashcardDetail({ id_flashcard }) {
    const [open, setOpen] = useState(false);
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
    const [openTool, setOpenTool] = useState(false);
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: "en-US" }));

    // Function để lấy voice dựa trên language và type
    const getVoiceByLanguage = useCallback((language, type) => {
        if (language === "english" && type === 1) return "en-GB-SoniaNeural";
        if (language === "english" && type === 2) return "en-US-GuyNeural";
        if (language === "vietnamese") return "vi-VN-HoaiMyNeural";
        if (language === "germany") return "de-DE-KatjaNeural";
        if (language === "france") return "fr-FR-DeniseNeural";
        if (language === "japan") return "ja-JP-NanamiNeural";
        if (language === "korea") return "ko-KR-SunHiNeural";
        if (language === "chinese") return "zh-CN-XiaoxiaoNeural";
        return "en-US-GuyNeural"; // default
    }, []);

    const speakWord = useCallback(
        async (text, type, id) => {
            if (disableAudio) return;

            const voice = getVoiceByLanguage(listFlashcard?.language, type);

            try {
                setLoadingAudio(id);
                setDisableAudio(true);

                const response = await tts.create({
                    input: text,
                    options: {
                        voice: voice,
                    },
                });

                const audioBuffer = await response.arrayBuffer();
                const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                audio.addEventListener("ended", () => {
                    URL.revokeObjectURL(url);
                });

                audio.play();
            } catch (error) {
                console.error("TTS Error:", error);
                messageApi.error("Lỗi khi phát âm thanh: " + error.message);
            } finally {
                setLoadingAudio(null);
                setTimeout(() => {
                    setDisableAudio(false);
                }, 1000);
            }
        },
        [disableAudio, listFlashcard?.language, tts, getVoiceByLanguage, messageApi]
    );

    const handleOpenChange = (newOpen) => {
        setOpenTool(newOpen);
    };
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
    }, [id_flashcard]);

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
        setOpenTool(false);
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
        setOpenTool(false);
    };

    const handleCancelAddMore = () => {
        setOpenAddMore(false);
    };

    const handleSendPrompt = async (method) => {
        try {
            const word = method === 1 ? editWord.title : newFlashcard.title;
            // const word = newFlashcard.title;
            const optimizedPrompt = optimizedPromptFCSingle(word, listFlashcard?.language);
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

        const optimizedPrompt = optimizedPromptFCMore(prompt, listFlashcardlanguage);
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

    // const handleRemoveAddMore = (item) => {
    //     setAddMore((prev) => prev.filter((i) => i !== item));    // };

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
        setOpenTool(false);
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
            <div className="flex items-center justify-between">
                <Link href="/flashcard" className="hover:text-primary hover:underline flex items-center gap-1">
                    <IoIosArrowBack /> Quay lại
                </Link>
                <div className="block md:hidden">
                    <Popover
                        content={
                            <div className="flex-1 flex justify-between gap-3 flex-col">
                                <button className="btn btn-primary !rounded-md flex items-center gap-1" onClick={showModalEdit}>
                                    <MdEdit /> Chỉnh sửa
                                </button>
                                <button className="btn btn-primary !rounded-md flex items-center gap-1" onClick={showModal}>
                                    <IoMdAdd /> Thêm
                                </button>
                                <button className="btn btn-primary flex items-center gap-1 !rounded-md" onClick={showModalAddMore}>
                                    <AiOutlineAppstoreAdd /> Thêm nhiều
                                </button>
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
                        }
                        title="Tính năng"
                        trigger="click"
                        open={openTool}
                        onOpenChange={handleOpenChange}>
                        <button type="primary" className="btn btn-primary !rounded-md flex items-center gap-1">
                            Tính năng
                        </button>
                    </Popover>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-5 md:flex-row flex-col">
                <h1 className="text-2xl font-bold text-primary text-left flex-1">Flashcard: {listFlashcard?.title}</h1>
                {user?._id == listFlashcard?.userId?._id ? (
                    <div className="flex-1 hidden md:flex justify-between gap-2 items-center">
                        <div className="flex gap-2 items-center h-[36px] ">
                            <button className="btn btn-primary h-full !rounded-md" onClick={showModalEdit}>
                                <MdEdit />
                            </button>
                            <button className="btn btn-primary h-full !rounded-md flex items-center gap-1" onClick={showModal}>
                                <IoMdAdd /> Thêm
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
            <div className=" md:h-[80px] my-3 grid grid-cols-3 md:grid-cols-5 flex-1 text-right gap-2 md:gap-3 text-[12px]">
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
                    className={`flex-1 flex flex-col  rounded-lg justify-between p-2 md:p-3  cursor-pointer border border-white/5 bg-gradient-to-r from-green-500/30 to-blue-500/30   ${
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
                            <ItemFC
                                item={item}
                                key={index}
                                listFlashcard={listFlashcard}
                                speakWord={speakWord}
                                editWord={editWord}
                                setEditWord={setEditWord}
                                loadingAudio={loadingAudio}
                                user={user}
                                handleEditWord={handleEditWord}
                                openEditWord={openEditWord}
                                handleCancelEditWord={handleCancelEditWord}
                                setOpenEditWord={setOpenEditWord}
                                handleOkEditWord={handleOkEditWord}
                                loadingConfirm={loadingConfirm}
                                confirmDelete={confirmDelete}
                                loading={loading}
                                openTrick={openTrick}
                                handleOpenChangeTrick={handleOpenChangeTrick}
                                handleKeyPressEdit={handleKeyPressEdit}
                                handleSendPrompt={handleSendPrompt}
                            />
                        ))}
                        {filteredFlashcards?.length === 0 && <p className="h-[400px] flex items-center justify-center col-span-full">Không có từ nào trong list...</p>}
                    </div>
                )}

                {loading && <Spin indicator={<LoadingOutlined spin />} size="default" className="h-[400px] flex items-center justify-center" />}

                {isSimple === 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
                        {filteredFlashcards?.map((item, index) => (
                            <ItemFCSimple
                                item={item}
                                key={index}
                                listFlashcard={listFlashcard}
                                speakWord={speakWord}
                                editWord={editWord}
                                setEditWord={setEditWord}
                                loadingAudio={loadingAudio}
                                user={user}
                                handleEditWord={handleEditWord}
                                openEditWord={openEditWord}
                                handleCancelEditWord={handleCancelEditWord}
                                setOpenEditWord={setOpenEditWord}
                                handleOkEditWord={handleOkEditWord}
                                loadingConfirm={loadingConfirm}
                                confirmDelete={confirmDelete}
                                loading={loading}
                                openTrick={openTrick}
                                handleOpenChangeTrick={handleOpenChangeTrick}
                                handleKeyPressEdit={handleKeyPressEdit}
                                handleSendPrompt={handleSendPrompt}
                            />
                        ))}
                    </div>
                )}

                {filteredFlashcards?.length === 0 && <p className="h-[400px] flex items-center justify-center">Không có từ nào trong list</p>}
            </div>
        </div>
    );
}
