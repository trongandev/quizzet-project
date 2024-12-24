"use client";
import { GET_API } from "@/lib/fetchAPI";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { HiMiniSpeakerWave } from "react-icons/hi2";

export default function PractiveFlashcard({ params }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0);
    const [loadingAudio, setLoadingAudio] = useState(null);

    const [flashcard, setFlashcard] = useState({});
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchFlashCard = async () => {
            const req = await GET_API(`/flashcards/${params?.slug}`, token);
            console.log(req);
            if (req.ok) {
                setFlashcard(req.listFlashCards.flashcards);
            } else {
                messageApi.open({
                    type: "error",
                    content: req.message,
                });
            }
        };
        fetchFlashCard();
    }, []);
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
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

    const handleChangeIndex = (type) => {
        if (type === "next") {
            if (index < flashcard.length - 1) {
                setIndex(index + 1);
            } else {
                setIndex(0);
            }
        } else {
            if (index > 0) {
                setIndex(index - 1);
            } else {
                setIndex(flashcard.length - 1);
            }
        }
        setIsFlipped(false);
        speakWord(flashcard[index + 1]?.title, 1, flashcard[index + 1]?._id);
    };
    return (
        <div className="flex items-center justify-center h-[90%] flex-col gap-5">
            <div
                className="relative w-[600px] h-[400px] border rounded-md shadow-md cursor-pointer"
                style={{ perspective: "1000px" }} // Đặt góc nhìn để hiệu ứng lật hoạt động
                onClick={handleFlip}>
                <div
                    className={`absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                    style={{
                        transformStyle: "preserve-3d", // Bảo toàn hiệu ứng 3D khi lật
                    }}>
                    {/* Mặt trước */}
                    <div
                        className="absolute inset-0 bg-white flex items-center justify-center backface-hidden"
                        style={{
                            backfaceVisibility: "hidden",
                        }}>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{flashcard[index]?.title}</p>
                            <div className="flex items-center gap-1 mr-2 cursor-pointer" onClick={() => speakWord(flashcard[index]?.title, 1, flashcard[index]?._id)}>
                                {loadingAudio == flashcard[index]?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                <p>US</p>
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(flashcard[index]?.title, 2, flashcard[index]?._id)}>
                                {loadingAudio == flashcard[index]?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                                UK
                            </div>
                        </div>
                    </div>

                    {/* Mặt sau */}
                    <div
                        className="absolute inset-0 bg-gray-100 flex items-center justify-center backface-hidden"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}>
                        <p className="text-md text-gray-700">{flashcard[index]?.define}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-5 w-[600px] flex justify-between shadow-md">
                <button onClick={() => handleChangeIndex("prev")}>prev</button>
                <button>Đã biết</button>
                <button>Chưa biết</button>
                <button onClick={() => handleChangeIndex("next")}>next</button>
            </div>
        </div>
    );
}
