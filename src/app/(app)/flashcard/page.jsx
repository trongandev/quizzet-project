"use client";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { message, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight, MdPublic } from "react-icons/md";
import Cookies from "js-cookie";
import handleCompareDate from "@/lib/CompareDate";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
export default function FlashCard() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const defaultListFlashCard = { title: "", desc: "", language: "english", public: false };
    const [listFlashCard, setListFlashCard] = useState([]);
    const [newListFlashCard, setNewListFlashCard] = useState(defaultListFlashCard);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchListFlashCard = async () => {
            const req = await GET_API("/list-flashcards", token);
            if (req.ok) {
                setListFlashCard(req.listFlashCards);
            } else {
                messageApi.open({
                    type: "error",
                    content: req.message,
                });
            }
        };
        fetchListFlashCard();
    }, []);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setLoading(true);
        const req = await POST_API("/list-flashcards", newListFlashCard, "POST", token);
        const res = await req.json();
        if (req.ok) {
            setOpen(false);
            setListFlashCard([...listFlashCard, res.listFlashCard]);
            setNewListFlashCard(defaultListFlashCard);
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

    return (
        <div className="text-third px-3 md:px-0">
            {contextHolder}

            <div className="flex gap-5 md:h-[70px] flex-col md:flex-row ">
                <div className="flex-1 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">Flashcard</h1>
                    <div className="">
                        <button className="btn-outline mr-3 mt-2">List từ của tôi</button>
                        <button>Khám phá</button>
                    </div>
                </div>
                <div className="py-3 md:py-0 h-full bg-gray-200 border shadow-md rounded-md flex flex-1">
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
            </div>
            <div className="my-5">
                <div className="">
                    <h3 className="text-xl mb-2 text-primary">Đang học</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 h-[248px]">
                        {listFlashCard?.flashcards &&
                            listFlashCard?.flashcards.map((item) => (
                                <Link href={`#`} key={item._id} className="w-full h-full bg-gray-200 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300">
                                    <h1 className="font-bold line-clamp-1" title="TOEIC">
                                        {item?.title}
                                    </h1>
                                    <h1 className="flex items-center gap-1">
                                        <IoCopyOutline />
                                        {item} từ
                                    </h1>
                                    <p className="text-sm line-clamp-2 italic" title="CÁC TỪ VỰNG VỀ TOIEC TRONG STUDY4">
                                        CÁC TỪ VỰNG VỀ TOIEC TRONG STUDY4
                                    </p>
                                    <div className="flex items-center gap-2 my-2">
                                        <Image src="https://placehold.co/35x35" alt="" width={35} height={35} className="rounded-full" />
                                        <p className="line-clamp-1" title="">
                                            Tỏng An
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <p>Cần ôn tập: 0</p>
                                        <p>Cần nhớ: 0</p>
                                    </div>
                                    <button className="w-full mt-2">Học tiếp</button>
                                </Link>
                            ))}
                    </div>

                    <div className="flex items-center gap-1 text-primary mt-2">
                        Xem tất cả <MdKeyboardDoubleArrowRight />
                    </div>
                </div>
            </div>
            <div className="">
                <h3 className="text-xl mb-2 text-primary">List từ đã tạo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    <div
                        onClick={showModal}
                        className="w-full text-primary cursor-pointer hover:border-primary bg-gray-200 rounded-xl shadow-sm p-3 border hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 flex-col  h-[161px]">
                        <AiOutlinePlus size={30} />
                        <h1>Tạo list từ</h1>
                    </div>
                    <Modal title="Tạo list từ" open={open} onOk={handleOk} confirmLoading={loading} okText="Tạo" onCancel={handleCancel}>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Tên list từ"
                                className="w-full p-3 border rounded-md"
                                value={newListFlashCard.title}
                                onChange={(e) => setNewListFlashCard({ ...newListFlashCard, title: e.target.value })}
                            />
                            <select name="" id="" defaultValue="english" value={newListFlashCard.language} onChange={(e) => setNewListFlashCard({ ...newListFlashCard, language: e.target.value })}>
                                <option value="english">Tiếng Anh-Mỹ</option>
                                <option value="chinese">Tiếng Trung</option>
                                <option value="korea">Tiếng Hàn</option>
                                <option value="japan">Tiếng Nhật</option>
                            </select>

                            <textarea
                                placeholder="Mô tả"
                                className="w-full p-3 border rounded-md"
                                value={newListFlashCard.desc}
                                onChange={(e) => setNewListFlashCard({ ...newListFlashCard, desc: e.target.value })}
                            />
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-5"
                                    id="public"
                                    checked={newListFlashCard.public}
                                    onChange={(e) => setNewListFlashCard({ ...newListFlashCard, public: e.target.checked })}
                                />
                                <label htmlFor="public" className="cursor-pointer">
                                    Công khai
                                </label>
                            </div>
                        </div>
                    </Modal>
                    {listFlashCard &&
                        listFlashCard.map((item) => (
                            <Link
                                href={`/flashcard/${item?._id}`}
                                className="w-full h-[161px] bg-gray-200 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300"
                                key={item._id}>
                                <h1 className="font-bold line-clamp-1" title={item.title}>
                                    {item.title}
                                </h1>
                                <h1 className="flex items-center gap-1">
                                    <IoCopyOutline />
                                    {item?.flashcards.length} từ
                                </h1>
                                <p className="text-sm line-clamp-2 italic h-[40px]" title={item.desc}>
                                    {item.desc || "Không có mô tả"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-[40px] h-[40px] overflow-hidden relative">
                                        <Image src={item?.userId?.profilePicture} alt="" className="rounded-full w-full h-full absolute object-cover" fill />
                                    </div>
                                    <div className="">
                                        <p title={item.userId.displayName} className="line-clamp-1">
                                            {item.userId.displayName}
                                        </p>
                                        <div className="flex gap-1 items-center text-xs text-gray-500 " title={new Date(item.created_at).toLocaleString()}>
                                            {item.public ? <MdPublic /> : <RiGitRepositoryPrivateFill />}
                                            <p className="line-clamp-1">{handleCompareDate(item?.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    {listFlashCard.length === 0 && <div className="flex items-center justify-center">Nothing...</div>}
                </div>
            </div>
        </div>
    );
}
