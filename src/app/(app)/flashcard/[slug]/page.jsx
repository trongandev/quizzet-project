"use client";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GiStopSign } from "react-icons/gi";
import { CiShuffle } from "react-icons/ci";
import { message, Modal, Popconfirm, Spin } from "antd";
import { FaBrain, FaTrash } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoadingOutlined } from "@ant-design/icons";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function FlashCardDetail({ params }) {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(null);
    const [flashcard, setFlashcard] = useState([]);
    const defaultFlashcard = { title: "", define: "", type_of_word: "", transcription: "", example: [], note: "" };
    const [newFlashcard, setNewFlashcard] = useState(defaultFlashcard);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    useEffect(() => {
        const fetchFlashCard = async () => {
            const req = await GET_API(`/flashcards/${params?.slug}`, token);
            if (req.ok) {
                setFlashcard(req.listFlashCards);
            } else {
                messageApi.open({
                    type: "error",
                    content: req.message,
                });
            }
        };
        fetchFlashCard();
    }, []);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setLoading(true);
        const req = await POST_API("/flashcards", { ...newFlashcard, list_flashcard_id: flashcard._id }, "POST", token);
        const res = await req.json();
        if (req.ok) {
            setOpen(false);
            setFlashcard((prev) => ({ ...prev, flashcards: [...prev.flashcards, res.flashcard] }));
            setNewFlashcard(defaultFlashcard);
        } else {
            messageApi.open({
                type: "error",
                content: res.message,
            });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI);

    const handleSendPrompt = async () => {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        var defaultPrompt = `
tạo giúp tôi 1 flashcard với từ như trên yêu cầu trả ra kiểu json không giải thích hay nói bất cứ thứ gì thêm với cấu trúc như bên dưới
{
title,
define, // định nghĩa tiếng việt
type_of_word,
transcription,
example: [
{
        en,
        vi,
} // ví dụ trên 4 câu và tùy thuộc vào ngôn ngữ
] 

note, // ghi chú về từ bằng tiếng việt
}
   `;
        const result = await model.generateContent(newFlashcard.title + defaultPrompt);
        const parse = result.response
            .text()
            .replace(/```json/g, "")
            .replace(/```/g, "");
        setNewFlashcard(JSON.parse(parse));
        setLoading(false);
    };

    const speakWord = async (text, type, id) => {
        setLoadingAudio(id);
        const req = await fetch(`${process.env.API_ENDPOINT}/proxy?audio=${text}&type=${type}`);
        const blob = await req.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        setLoadingAudio(null);
        audio.play();
    };

    const showPopconfirm = () => {
        setOpenConfirm(true);
    };

    const confirm = async (e) => {
        setLoading(true);
        const req = await POST_API(`/list-flashcards/${flashcard._id}`, {}, "DELETE", token);
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
    const cancel = (e) => {};
    return (
        <div className="text-third">
            {contextHolder}
            <div className="flex items-center gap-5">
                <h1 className="text-2xl font-bold text-primary">Flashcard: {flashcard?.title}</h1>
                <div className="flex-1 flex justify-between">
                    <div className="flex gap-2">
                        <button className="btn-small flex items-center gap-1" disabled>
                            <MdEdit /> Chỉnh sửa
                        </button>
                        <button className="btn-small flex items-center gap-1" onClick={showModal}>
                            <IoMdAdd /> Thêm từ mới
                        </button>
                    </div>
                    <Popconfirm
                        title="Xóa flashcard này?"
                        description="Bạn chắc chứ? nó sẽ không khôi phục được đâu"
                        onConfirm={confirm}
                        open={openConfirm}
                        onCancel={cancel}
                        okText="Chắc chắn!"
                        okButtonProps={{
                            loading: loading,
                        }}
                        cancelText="Để suy nghĩ lại">
                        <button className="btn-small bg-red-500 flex items-center gap-1" onClick={showPopconfirm}>
                            <FaTrash /> Xóa
                        </button>
                    </Popconfirm>
                </div>
                <Modal title="Thêm từ mới" open={open} onOk={handleOk} confirmLoading={loading} okText="Tạo" onCancel={handleCancel}>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <p className="ml-2">Tên từ mới (nhập rồi bấm vào AI Generate)</p>
                                <input type="text" className="" placeholder="Tên từ mới " value={newFlashcard.title} onChange={(e) => setNewFlashcard({ ...newFlashcard, title: e.target.value })} />
                            </div>
                            <button className="flex items-center gap-2 " onClick={handleSendPrompt}>
                                {loading ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <FaBrain />}
                                AI Generate
                            </button>
                        </div>
                        <div className="">
                            <p className="ml-2">Định nghĩa</p>
                            <text placeholder="Định nghĩa  (bắt buộc)" value={newFlashcard.define} onChange={(e) => setNewFlashCard({ ...newFlashcard, define: e.target.value })} />
                        </div>
                        <div className="border border-secondary  p-2 rounded-md space-y-2">
                            <p className="text-gray-700">Không yêu cầu phải điền</p>
                            <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <p className="ml-2">Loại từ</p>
                                    <input
                                        type="text"
                                        placeholder="Loại từ (N,V,Adj,...)"
                                        value={newFlashcard.type_of_word}
                                        onChange={(e) => setNewFlashcard({ ...newFlashcard, type_of_word: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="ml-2">Phiên âm</p>
                                    <input
                                        type="text"
                                        placeholder="Phiên âm"
                                        value={newFlashcard.transcription}
                                        onChange={(e) => setNewFlashcard({ ...newFlashcard, transcription: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <p className="ml-2">Ví dụ</p>
                                <textarea
                                    placeholder="Ví dụ (tối đa 10 câu)"
                                    className="h-32"
                                    value={newFlashcard?.example?.map((ex) => `EN: ${ex.en}\nVI: ${ex.vi}`).join("\n\n")}
                                    onChange={(e) => {
                                        const updatedExamples = e.target.value.split("\n\n").map((sentence) => {
                                            const [en, vi] = sentence.split("\n").map((line) => line.replace(/^EN: |^VI: /, "").trim());
                                            return { en, vi };
                                        });
                                        setNewFlashCard({ ...newFlashcard, example: updatedExamples });
                                    }}
                                />
                            </div>
                            <div className="">
                                <p className="ml-2">Ghi chú</p>
                                <textarea className="h-20" placeholder="Ghi chú" value={newFlashcard.note} onChange={(e) => setNewFlashCard({ ...newFlashcard, note: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <p className="text-gray-500 italic">{flashcard?.desc || "Không có mô tả"}</p>
            <Link href={`/flashcard/practice/${flashcard?._id}`} className="py-5 block">
                <button className="w-full btn-outline">Luyện tập Flashcards</button>
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-secondary">
                    <CiShuffle />
                    <p>Xem ngẫu nhiên</p>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                    <GiStopSign />
                    <p>Dừng học</p>
                </div>
            </div>
            <div className="h-[100px] bg-gray-100 border shadow-md rounded-md flex my-5">
                <div className="flex-1 flex items-center justify-center flex-col">
                    <h1 className="text-primary font-bold text-2xl">0</h1>
                    <p className="text-gray-500">Đã học</p>
                </div>
                <div className="flex-1 flex items-center justify-center flex-col">
                    <h1 className="text-primary font-bold text-2xl">0</h1>
                    <p className="text-gray-500">Đã nhớ</p>
                </div>
                <div className="flex-1 flex items-center justify-center flex-col">
                    <h1 className="text-red-500 font-bold text-2xl">0</h1>
                    <p className="text-gray-500">Cần ôn tập</p>
                </div>
            </div>
            <div className="">
                <h3>List có {flashcard?.flashcards?.length} từ</h3>
                <div className="grid grid-cols-2 gap-3 mt-5 ">
                    {flashcard?.flashcards?.map((item) => (
                        <div className="bg-gray-100 p-5 shadow-sm rounded-xl" key={item?._id}>
                            <div className="flex gap-2 items-center text-secondary font-bold">
                                <h1 className="text-primary text-lg ">{item?.title}</h1>
                                <p>({item?.type_of_word})</p>
                                <p>{item?.transcription}</p>
                                <div className="flex items-center gap-1 mr-2 cursor-pointer" onClick={() => speakWord(item?.title, 1, item?._id)}>
                                    {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                    <p>US</p>
                                </div>
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)}>
                                    {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                    UK
                                </div>
                            </div>
                            <p className="font-bold text-gray-600">
                                Định nghĩa: <span className="italic font-thin">{item?.define}</span>
                            </p>
                            <p className="font-bold text-gray-600">Ví dụ: </p>

                            <div className=" border border-secondary rounded-lg px-5 py-3 my-3 h-[220px] overflow-y-auto">
                                {item?.example?.map((ex, idx) => (
                                    <div key={ex.en} className="mb-1">
                                        <div className="">
                                            <p className="text-gray-600 font-bold">
                                                {idx + 1}. {ex.en}
                                            </p>
                                            <div className="text-xs text-gray-500 flex">
                                                <div className="flex items-center gap-1 mr-3 cursor-pointer hover:text-secondary" onClick={() => speakWord(ex.en, 1, item?._id + idx)}>
                                                    {loadingAudio == item?._id + idx ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                    <p>US</p>
                                                </div>
                                                <div className="flex items-center gap-1 cursor-pointer hover:text-secondary" onClick={() => speakWord(ex.en, 2, item?._id + idx)}>
                                                    {loadingAudio == item?._id + idx ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                                    UK
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">({ex.vi})</p>
                                    </div>
                                ))}
                            </div>

                            <p className="font-bold text-gray-600">
                                Ghi chú: <span className="italic font-thin">{item?.note}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
