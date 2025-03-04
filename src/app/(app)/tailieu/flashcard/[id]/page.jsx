"use client";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import { Switch } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function TaiLieuFlashcard({ params }) {
    const [data, setData] = useState([]);
    const [quest, setQuest] = useState([]);
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isRandomMode, setIsRandomMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await GET_API_WITHOUT_COOKIE(`/admin/suboutline/${params.id}`);
            setQuest(res.quest.data_so);
            delete res.quest;
            setData(res);
        };
        fetchData();
    }, []);

    const handleKeyDown = useCallback((e) => {
        switch (e.key.toLowerCase()) {
            case "arrowleft":
                handleChangeIndex("prev");
                break;
            case "arrowright":
                handleChangeIndex("next");
                break;
            case " ":
                e.preventDefault();
                setIsFlipped((prev) => !prev);
                break;
        }
    }, []);

    const handleChangeIndex = (type) => {
        let newIndex;
        if (isRandomMode) {
            do {
                newIndex = Math.floor(Math.random() * quest.length);
            } while (newIndex === index && quest.length > 1);
        } else {
            newIndex = type === "next" ? (index < quest.length - 1 ? index + 1 : 0) : index > 0 ? index - 1 : quest.length - 1;
        }
        setIndex(newIndex);
    };

    return (
        <div className="px-3 md:px-0 focus-visible:outline-none text-third dark:text-white" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="w-full flex items-center justify-center h-[90%] flex-col gap-5">
                <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full flex flex-col gap-5">
                        <div
                            className="relative w-full h-[500px] border rounded-md shadow-md overflow-hidden bg-white dark:bg-slate-800 border-white/10"
                            style={{ perspective: "1000px" }}
                            onClick={() => setIsFlipped(!isFlipped)}>
                            <div
                                className={`cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                                style={{ transformStyle: "preserve-3d" }}>
                                {/* Front Side */}
                                <div className="absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5" style={{ backfaceVisibility: "hidden" }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <p className="text-xl font-bold text-center">{quest[index]?.question}</p>
                                    </div>

                                    <p className="text-gray-500 text-sm">(Click to flip)</p>
                                </div>

                                {/* Back Side */}
                                <div
                                    className="absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}>
                                    <p className="text-lg text-gray-700 dark:text-white/70">{quest[index]?.answer}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 border border-white/10 dark:bg-slate-800/50 rounded-md overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleChangeIndex("prev")}>
                                <GrFormPrevious />
                                <p className="text-sm">Lùi lại</p>
                            </div>
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleChangeIndex("next")}>
                                <GrFormNext />
                                <p className="text-sm">Tiến tới</p>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="space-y-2">
                            <h2 className="font-medium">Cài đặt Random</h2>
                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 dark:text-white/70">Random câu hỏi</span>
                                        <Switch checked={isRandomMode} onChange={(checked) => setIsRandomMode(checked)} className="bg-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-3">
                            <h2 className="font-medium">Phím tắt</h2>
                            <div className="bg-gray-100 text-gray-500 dark:text-white/70 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500 rounded shadow text-sm">→</kbd>
                                    <span className="">Tiến tới</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500 rounded shadow text-sm">←</kbd>
                                    <span className="">Lùi lại</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500 rounded shadow text-sm">Space</kbd>
                                    <span className="">Lật thẻ </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
