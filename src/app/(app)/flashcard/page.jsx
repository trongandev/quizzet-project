"use client";
import { GET_API, GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
import { message, Modal, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import Cookies from "js-cookie";
import handleCompareDate from "@/lib/CompareDate";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { LoadingOutlined } from "@ant-design/icons";
export default function FlashCard() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const defaultListFlashCard = { title: "", desc: "", language: "english", public: false };
    const [listFlashCard, setListFlashCard] = useState([]);
    const [publicFlashcards, setPublicFlashcards] = useState([]);
    const [newListFlashCard, setNewListFlashCard] = useState(defaultListFlashCard);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchListFlashCard = async () => {
            setLoading(true);
            const req = await GET_API("/list-flashcards", token);
            const req1 = await GET_API_WITHOUT_COOKIE("/list-flashcards/public");

            if (req.ok) {
                console.log(req);
                setListFlashCard(req?.listFlashCards);
            }

            console.log(req1);
            setPublicFlashcards(req1);
            setLoading(false);
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

            <div className="flex gap-5 flex-col md:flex-row md:h-[80px]">
                <div className=" flex-1">
                    <h1 className="text-2xl font-bold text-primary">Flashcard</h1>
                    <p className="text-gray-500">Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!</p>
                </div>
                <div className=" h-full bg-white border shadow-md rounded-md flex flex-1">
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

            {token !== undefined ? (
                <div className="mt-5">
                    <h4 className="text-xl mb-2 text-primary">List từ đã tạo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[300px] overflow-y-scroll">
                        <div
                            onClick={showModal}
                            className="w-full text-primary cursor-pointer hover:border-primary bg-gray-100 rounded-xl shadow-sm p-3 border hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 flex-col  h-[181px]">
                            <AiOutlinePlus size={30} />
                            <h1>Tạo list từ mới</h1>
                        </div>
                        <Modal title="Tạo list từ" open={open} onOk={handleOk} confirmLoading={loading} okText="Tạo" onCancel={handleCancel}>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Tên list từ"
                                    className="w-full p-3 border rounded-md"
                                    value={newListFlashCard.title}
                                    onChange={(e) => setNewListFlashCard({ ...newListFlashCard, title: e.target.value })}
                                />
                                <select name="" id="" value={newListFlashCard.language} onChange={(e) => setNewListFlashCard({ ...newListFlashCard, language: e.target.value })}>
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
                                    className="w-full h-[181px] bg-gray-100 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300"
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
                                    <p className="text-sm line-clamp-2 italic">Ngôn ngữ: {item.language}</p>
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
                        {loading && <Spin indicator={<LoadingOutlined spin />} size="default" className="h-full flex items-center justify-center" />}
                    </div>
                </div>
            ) : (
                <div className=" text-secondary">Bạn cần đăng nhập để có thể thêm flashcard mới</div>
            )}

            <div className="mt-10">
                <h3 className="text-xl mb-2 text-primary">Khám phá từ cộng đồng chúng tôi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[300px] overflow-y-scroll">
                    {publicFlashcards &&
                        publicFlashcards.map((item) => (
                            <Link
                                href={`/flashcard/${item?._id}`}
                                className="w-full h-[181px] bg-gray-100 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300"
                                key={item._id}>
                                <h1 className="font-bold line-clamp-1" title={item.title}>
                                    {item.title}
                                </h1>
                                <h1 className="flex items-center gap-1">
                                    <IoCopyOutline />
                                    {item?.flashcards.length} từ
                                </h1>
                                <p className="text-sm line-clamp-2 italic  h-[40px]" title={item.desc}>
                                    {item.desc || "Không có mô tả"}
                                </p>
                                <p className="text-sm line-clamp-2 italic">Ngôn ngữ: {item.language}</p>
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
                    {loading && <Spin indicator={<LoadingOutlined spin />} size="default" className="h-full flex items-center justify-center" />}
                </div>
            </div>
        </div>
    );
}
