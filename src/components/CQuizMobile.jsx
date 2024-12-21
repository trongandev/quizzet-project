"use client";
import handleCompareDate from "@/lib/CompareDate";
import { subjectOption } from "@/lib/subjectOption";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { FaRegEye, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
export default function CQuizMobile({ quizData }) {
    const [toggleBtnSortAlpha, setToggleBtnSortAlpha] = useState(true);
    const [toggleBtnSortNumber, setToggleBtnSortNumber] = useState(true);

    const [data, setData] = useState(quizData);

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
        const search = quizData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
    };

    const handleSearchSubject = (value) => {
        if (value === "none") {
            setData(quizData);
            return;
        }
        const search = quizData.filter((item) => item.subject == value);
        setData(search);
    };
    const handleDefault = () => {
        setData(quizData);
    };
    return (
        <div className="w-full">
            <div className="flex justify-center md:justify-between items-center mb-4 gap-3 flex-wrap ">
                <div className="flex gap-3 items-center">
                    <Tooltip placement="top" title="Sắp xếp theo thời gian">
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
                        <Tooltip placement="top" title="Sắp xếp theo số lượt làm tăng dần">
                            <button onClick={() => handleSortByNumber("noa", "asc")}>
                                <TbSortAscendingNumbers />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip placement="top" title="Sắp xếp theo số lượt làm giảm dần">
                            <button onClick={() => handleSortByNumber("noa", "desc")}>
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
                    <input type="text" placeholder="Tìm tên câu hỏi mà bạn cần..." className="w-full md:w-[250px]" onChange={(e) => handleSearch(e.target.value)} />
                    <div className="flex-1 flex gap-3 justify-end">
                        <Link href="/quiz/themcauhoi" className="block ">
                            <button className="w-full lg:w-[170px]">Thêm câu hỏi</button>
                        </Link>
                        <Link href="/quiz/nganhang" className="block ">
                            <button className="w-full lg:w-[170px]">Thi thử</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="w-[340px] md:w-[400px] mySwiper">
                {data?.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className=" rounded-xl  shadow-md h-[400px]">
                            <div className="overflow-hidden relative h-full rounded-[8px]">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    className="absolute h-full w-full object-cover hover:scale-110 duration-300  brightness-75"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                                <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                    <h1 className="text-lg font-bold">{item.title}</h1>
                                    <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                                    <div className="flex justify-end items-center gap-1 mb-[1px] text-[10px]">
                                        <FaRegEye />
                                        <p className="">Lượt làm: {item.noa}</p>
                                    </div>
                                    <div className="flex justify-between items-center gap-1">
                                        <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                                            <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                <Image
                                                    unoptimized
                                                    src={item.uid.profilePicture}
                                                    alt={item.uid.displayName}
                                                    className="absolute object-cover h-full"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    priority
                                                />
                                            </div>
                                            <div className="group">
                                                <div className="flex items-center gap-1">
                                                    <h2 className="text-sm line-clamp-1 overflow-hidden group-hover:underline">{item.uid.displayName}</h2>
                                                    {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                </div>
                                                <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                    <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                                </p>
                                            </div>
                                        </Link>

                                        <Link href={`/quiz/${item.slug}`} className="block">
                                            <button className="flex gap-1 items-center text-sm">
                                                Làm bài <IoArrowForwardCircleOutline />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {data && data.length === 0 ? <p className="text-primary">Không có tài liệu nào...</p> : ""}
        </div>
    );
}
