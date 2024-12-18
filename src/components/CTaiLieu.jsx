"use client";
import handleCompareDate from "@/lib/CompareDate";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FaRegEye, FaRegQuestionCircle, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";

export default function CTaiLieu({ toolData }) {
    const router = useRouter();
    const handleChangeRouterDeCuong = async (item) => {
        await GET_API_WITHOUT_COOKIE(`/admin/suboutline/view/${item._id}`);
        router.push(`/decuong/${item.slug}`);
    };

    const [data, setData] = useState(toolData);

    // Hàm sắp xếp
    const handleSort = useCallback(
        (key, direction = "asc") => {
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

    const handleDefault = () => {
        setData(toolData);
    };

    return (
        <div className="">
            <div className="flex justify-center md:justify-between items-center mb-4 gap-3 flex-wrap ">
                <div className="flex gap-3 items-center">
                    <button onClick={() => handleDefault()} className="text-[11px]">
                        Default
                    </button>
                    <button onClick={() => handleSort("title", "asc")}>
                        <FaSortAlphaDown />
                    </button>
                    <button onClick={() => handleSort("title", "desc")}>
                        <FaSortAlphaDownAlt />
                    </button>
                    {/* Sắp xếp theo số câu hỏi */}
                    <button onClick={() => handleSortByNumber("lenght", "asc")}>
                        <TbSortAscendingNumbers />
                    </button>
                    <button onClick={() => handleSortByNumber("lenght", "desc")}>
                        <TbSortDescendingNumbers />
                    </button>
                </div>
                <input type="text" placeholder="Tìm tên tài liệu mà bạn cần..." className="w-full md:w-[500px]" onChange={(e) => handleSearch(e.target.value)} />
            </div>

            {!data && (
                <div className="h-[400px] flex items-center justify-center w-full">
                    <Spin className="text-primary" indicator={<LoadingOutlined spin />} size="large" />
                </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4">
                {data?.map((item, index) => (
                    <div className="bg-white rounded-xl h-[170px] flex flex-col md:flex-row overflow-hidden text-third shadow-md " key={index}>
                        <div className="relative flex-1">
                            <Image src={item.image} alt={item.title} className="object-cover absolute" priority fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
                                <h1 className="font-bold line-clamp-3">{item.title}</h1>
                            </div>
                            <div className="">
                                <p className="text-[12px] text-center">{handleCompareDate(item.date)}</p>
                                <button onClick={() => handleChangeRouterDeCuong(item)} className="text-sm w-full">
                                    Xem ngay
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
