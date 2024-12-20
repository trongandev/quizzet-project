"use client";
import handleCompareDate from "@/lib/CompareDate";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { subjectOption } from "@/lib/subjectOption";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FaRegEye, FaRegQuestionCircle, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { GiCardPick } from "react-icons/gi";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";

export default function CTaiLieu({ toolData }) {
    const router = useRouter();
    const [toggleBtnSortAlpha, setToggleBtnSortAlpha] = useState(true);
    const [toggleBtnSortNumber, setToggleBtnSortNumber] = useState(true);

    const handleChangeRouterDeCuong = async (item) => {
        await GET_API_WITHOUT_COOKIE(`/admin/suboutline/view/${item._id}`);
        router.push(`/tailieu/${item.slug}`);
    };

    const [data, setData] = useState(toolData);

    // Hàm sắp xếp
    const handleSort = useCallback(
        (key, direction = "asc") => {
            setToggleBtnSortAlpha(!toggleBtnSortAlpha);
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return a[key].localeCompare(b[key]);
                return b[key].localeCompare(a[key]);
            });
            setData(sortedData);
        },
        [data]
    );

    const handleSortByNumber = useCallback(
        (key, direction = "asc") => {
            setToggleBtnSortNumber(!toggleBtnSortNumber);
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return a[key] - b[key];
                return b[key] - a[key];
            });
            setData(sortedData);
        },
        [data]
    );

    const handleSearch = (value) => {
        const search = toolData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
    };

    const handleSearchSubject = (value) => {
        const search = toolData.filter((item) => item.subject == value);
        setData(search);
    };

    const handleDefault = () => {
        setData(toolData);
    };

    return (
        <div className="">
            <div className="flex justify-center md:justify-between items-center mb-4 gap-3 flex-wrap ">
                <div className="flex gap-3 items-center">
                    <Tooltip placement="top" title="Sắp xếp theo lượt xem giảm dần">
                        <button onClick={() => handleDefault()} className="text-[11px]">
                            Default
                        </button>
                    </Tooltip>
                    {toggleBtnSortAlpha ? (
                        <Tooltip placement="top" title="Sắp xếp theo tên tài liệu từ A -> Z">
                            <button onClick={() => handleSort("title", "asc")}>
                                <FaSortAlphaDown />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip placement="top" title="Sắp xếp theo tên tài liệu từ Z -> A">
                            <button onClick={() => handleSort("title", "desc")}>
                                <FaSortAlphaDownAlt />
                            </button>
                        </Tooltip>
                    )}

                    {toggleBtnSortNumber ? (
                        <Tooltip placement="top" title="Sắp xếp theo số câu hỏi tăng dần">
                            <button onClick={() => handleSortByNumber("lenght", "asc")}>
                                <TbSortAscendingNumbers />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip placement="top" title="Sắp xếp theo số câu hỏi giảm dần">
                            <button onClick={() => handleSortByNumber("lenght", "desc")}>
                                <TbSortDescendingNumbers />
                            </button>
                        </Tooltip>
                    )}

                    <select onChange={(e) => handleSearchSubject(e.target.value)}>
                        {subjectOption.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3 flex-1 flex-wrap justify-end">
                    <input type="text" placeholder="Tìm tên tài liệu mà bạn cần..." className="w-full md:w-[250px]" onChange={(e) => handleSearch(e.target.value)} />
                    <div className="flex gap-3 flex-1">
                        <Link href="/tailieu/themtailieu" className="block flex-1">
                            <button className="w-full md:w-[170px]">Thêm tài liệu</button>
                        </Link>
                        <Link href="/flashcard" className="block flex-1">
                            <button className="w-full flex gap-2 items-center">
                                <GiCardPick size={20} />
                                Học nhanh bằng Flashcard
                            </button>
                        </Link>
                    </div>
                </div>{" "}
            </div>

            {!data && (
                <div className="h-[400px] flex items-center justify-center w-full">
                    <Spin className="text-primary" indicator={<LoadingOutlined spin />} size="large" />
                </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4">
                {data?.map((item, index) => (
                    <div className="bg-white rounded-xl h-[200px] flex flex-col md:flex-row overflow-hidden text-third shadow-md " key={index}>
                        <div className="relative flex-1">
                            <Image
                                unoptimized
                                src={item.image}
                                alt={item.title}
                                className="object-cover absolute h-full"
                                priority
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute z-1 bottom-0 bg-linear-item w-full text-white text-[10px] p-2 font-bold ">
                                <p className="flex gap-1 items-center">
                                    <FaRegQuestionCircle />
                                    Số câu hỏi: {item.lenght}
                                </p>
                                <p className="flex gap-1 items-center">
                                    <FaRegEye />
                                    Lượt xem: {item.view}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-between flex-col h-full p-3">
                            <div className="">
                                <h1 className="font-bold line-clamp-2 h-[48px]">{item.title}</h1>
                            </div>
                            <div className="">
                                <p className="text-[12px]">{handleCompareDate(item.date)}</p>
                                <button onClick={() => handleChangeRouterDeCuong(item)} className="text-sm w-full">
                                    Xem ngay
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {data && data.length === 0 ? <p className="text-primary">Không có tài liệu nào...</p> : ""}
            </div>
        </div>
    );
}
