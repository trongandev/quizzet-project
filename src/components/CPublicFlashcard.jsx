"use client";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { message, Modal, Select, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import handleCompareDate from "@/lib/CompareDate";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { LoadingOutlined } from "@ant-design/icons";
import { languageOption } from "@/lib/languageOption";
import Cookies from "js-cookie";
export default function CPublicFlashCard({ publicFlashcards }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("all");
    const [filterLanguage, setFilterLanguage] = useState(publicFlashcards);
    const defaultListFlashCard = { title: "", desc: "", language: "english", public: false };
    const [listFlashCard, setListFlashCard] = useState([]);
    const [newListFlashCard, setNewListFlashCard] = useState(defaultListFlashCard);
    const [messageApi, contextHolder] = message.useMessage();
    const token = Cookies.get("token");
    const showModal = () => {
        setOpen(true);
    };

    useEffect(() => {
        setLoading(true);
        const fetchListFlashCard = async () => {
            const res = await GET_API("/list-flashcards", token);
            setListFlashCard(res?.data);
            setLoading(false);
        };
        fetchListFlashCard();
    }, []);

    const handleOk = async () => {
        setLoading(true);
        const req = await POST_API("/list-flashcards", newListFlashCard, "POST", token);
        const res = await req.json();
        if (req.ok) {
            setOpen(false);
            setListFlashCard([...listFlashCard, res.data]);
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

    if (!publicFlashcards && !listFlashCard) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const handleNavLanguage = (value) => {
        setLanguage(value);
        if (value === "all") {
            setFilterLanguage(publicFlashcards);
            return;
        }
        const filter = publicFlashcards.filter((item) => item.language === value);
        setFilterLanguage(filter);
    };

    return (
        <div className="text-third px-3 md:px-0 min-h-screen">
            {contextHolder}

            <div className="flex gap-5 flex-col md:flex-row md:h-[80px]">
                <div className=" flex-1">
                    <h1 className="text-2xl font-bold text-primary">Flashcard</h1>
                    <p className="text-gray-500">Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!</p>
                </div>
                <div className=" h-full flex flex-1 text-right gap-3">
                    <div className="flex-1 flex flex-col bg-[#75d37d] rounded-lg p-3 text-white">
                        <p className="text-left">Đã học</p>
                        <h1 className="font-bold text-3xl text-right">0</h1>
                    </div>
                    <div className="flex-1 flex flex-col bg-[#75c1d3] rounded-lg p-3 text-white">
                        <p className="text-left">Đã nhớ</p>
                        <h1 className="font-bold text-3xl text-right">0</h1>
                    </div>
                    <div className="flex-1 flex flex-col bg-[#d37a75] rounded-lg p-3 text-white">
                        <p className="text-left">Cần ôn tập</p>
                        <h1 className="font-bold text-3xl text-right">0</h1>
                    </div>
                </div>
            </div>
            {token !== undefined ? (
                <div className="mt-10">
                    <h4 className="text-xl mb-2 text-primary">List từ đã tạo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[350px] overflow-y-scroll">
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
                                <Select
                                    className="w-full mt-3 rounded-none"
                                    showSearch
                                    placeholder="Tìm kiếm ngôn ngữ"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                                    options={languageOption}
                                    value={newListFlashCard.language}
                                    onChange={(value) => setNewListFlashCard({ ...newListFlashCard, language: value })}
                                />
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
                                        {item?.flashcards?.length} từ
                                    </h1>
                                    <p className="text-sm line-clamp-2 italic h-[40px]" title={item.desc}>
                                        {item.desc || "Không có mô tả"}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                                        <Image src={`/flag/${item.language}.svg`} alt="" width={25} height={15} className="rounded-sm border border-gray-400"></Image>
                                    </div>
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
                <h3 className="text-xl  text-primary">Khám phá từ cộng đồng chúng tôi</h3>
                <div className="flex gap-3 py-3 items-center flex-wrap">
                    <h3>Lọc theo ngôn ngữ:</h3>
                    <button
                        className={`border border-gray-400 px-5 py-2 rounded-full w-36 h-10 flex items-center justify-center  ${language === "all" ? "bg-secondary border-none text-white" : ""}`}
                        value="all"
                        onClick={(e) => handleNavLanguage(e.target.value)}>
                        <MdPublic className="mr-1" /> Tất cả
                    </button>
                    {languageOption.map((item) => (
                        <button
                            key={item.value}
                            className={`transition-colors duration-200 border border-gray-400 px-5 py-2 rounded-full w-36 h-10 flex items-center justify-center ${
                                item.value === language ? "bg-secondary border-none" : ""
                            }`}
                            onClick={() => handleNavLanguage(item.value)}>
                            <Image src={`/flag/${item.value}.svg`} alt="" width={25} height={25} className="rounded-sm border border-gray-400"></Image>
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[350px] overflow-y-scroll">
                    {filterLanguage &&
                        filterLanguage.map((item) => (
                            <Link
                                href={`/flashcard/${item?._id}`}
                                className="w-full h-[181px] bg-gray-100 rounded-xl block shadow-sm p-3 border hover:shadow-md transition-all duration-300"
                                key={item._id}>
                                <h1 className="font-bold line-clamp-1" title={item.title}>
                                    {item.title}
                                </h1>
                                <h1 className="flex items-center gap-1">
                                    <IoCopyOutline />
                                    {item?.flashcards?.length} từ
                                </h1>
                                <p className="text-sm line-clamp-2 italic  h-[40px]" title={item.desc}>
                                    {item.desc || "Không có mô tả"}
                                </p>
                                <div className="flex gap-2 items-center">
                                    <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                                    <Image src={`/flag/${item.language}.svg`} alt="" width={25} height={25} className="rounded-sm border border-gray-400"></Image>
                                </div>
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
                    {filterLanguage?.length <= 0 && <div className="h-[350px] col-span-12 flex items-center justify-center">Không có dữ liệu...</div>}
                </div>
            </div>
        </div>
    );
}
