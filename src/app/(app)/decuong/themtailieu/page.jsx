"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Modal } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { FaBrain } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdContentPaste } from "react-icons/md";

export default function AddSO() {
    const defaultData = { title: "", image: "", quest: [] };
    const [data, setData] = useState(defaultData);
    const [quest, setQuest] = useState([]);
    const [responePrompt, setResponePrompt] = useState("");

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setData({
                ...data,
                image: text,
            });
        });
    };
    const regex = /^(A|a|B|b|C|c|D|d)\.\s+/;

    const handleChangeJSON = (e) => {
        const value = e.target.value.trim();
        setResponePrompt(value);
        const lines = value.split("\n");
        const result = [];
        let currentQuestion = null;

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            // Nếu dòng là câu hỏi
            if (trimmedLine.endsWith("?") || trimmedLine.endsWith(":")) {
                // Thêm câu hỏi mới
                currentQuestion = {
                    question: trimmedLine,
                    answer: "", // Tạm thời để trống đáp án
                };
                result.push(currentQuestion);
            } else if (currentQuestion) {
                // Nếu là đáp án, gắn vào câu hỏi gần nhất
                currentQuestion.answer = trimmedLine;
            }
        });

        setQuest(result);
        // Xử lý kết quả JSON tại đây (ví dụ: lưu vào state hoặc gửi lên server)
    };

    const [isModalOpenAI, setIsModalOpenAI] = useState(false);

    const showModalAI = () => {
        setIsModalOpenAI(true);
    };

    const handleOkAI = () => {
        setIsModalOpenAI(false);
    };

    const handleCancelAI = () => {
        setIsModalOpenAI(false);
    };

    const [promptValue, setPromptValue] = useState(` màu sắc có mấy loai?
        có 3 loại`);
    const [loading, setLoading] = useState(false);
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI);

    const handleSendPrompt = async () => {
        setLoading(true);
        setResponePrompt(promptValue);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        var defaultPrompt = `              
        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ về mà người dùng cần tạo
        2. Nếu người dùng chỉ cho chủ đề thì tạo 20 câu hỏi đáp án liên quan về chủ đề đó
        3. Cuối câu hỏi phải có dấu "?" hoặc ":"
        4. Chỉ trả ra câu hỏi và đáp án, không cần đánh số câu, không in đậm
        
        ví dụ:
        màu sắc có mấy loai?
        có 3 loại
        laptop là gì?
        là máy tính xách tay
        ...
        
`;
        const result = await model.generateContent(promptValue + defaultPrompt);
        var replace = result.response
            .text()
            .replace(/```json/g, "")
            .replace(/```/g, "");
        setLoading(false);
        hhandleChangeJSON({ target: { value: replace } });
    };

    return (
        <div className="text-third flex gap-3 min-h-[80vh] md:flex-row flex-col px-3 md:px-0">
            <div className="flex-1 bg-white rounded-lg p-5 shadow-md space-y-3">
                <div className="">
                    <p>Tên bài (*)</p>
                    <div className="flex gap-2 items-center">
                        <input type="text" placeholder="Nhập tiêu đề của bài" autoFocus tabIndex="1" onChange={(e) => setData({ ...data, title: e.target.value })} value={data.title} />
                        <Link href={`https://www.google.com/search?q=${data.title}&udm=2`} target="_black" className="block h-full">
                            <FiSearch />
                        </Link>
                    </div>
                </div>
                <div className="">
                    <p>Hình ảnh (*)</p>
                    <div className="flex gap-2 items-center">
                        <Button className="" onClick={handlePaste}>
                            <MdContentPaste />
                        </Button>
                        <input type="text" placeholder="Nhập URL hình ảnh" tabIndex="2" onChange={(e) => setData({ ...data, image: e.target.value })} value={data.image} />
                    </div>
                </div>
                <Button className="btn btn-second flex items-center gap-1" onClick={showModalAI}>
                    <FaBrain size={20} /> AI Generate
                </Button>
                <Modal
                    title="AI Generate Quiz"
                    open={isModalOpenAI}
                    onOk={handleSendPrompt}
                    onCancel={handleCancelAI}
                    footer={[
                        <Button key="back" onClick={handleCancelAI}>
                            Hủy bỏ
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleSendPrompt} loading={loading}>
                            Tạo đề cương
                        </Button>,
                    ]}>
                    <div className="">
                        <textarea
                            className="resize-none h-24"
                            maxLength={1000}
                            placeholder="Nhập prompt để tạo ra đề cương theo yêu cầu 
                                        Ví dụ: 20 câu đề cương về lịch sử Việt Nam"
                            onChange={(e) => setPromptValue(e.target.value)}
                        />
                    </div>
                </Modal>

                <div className="">
                    <p>Câu hỏi/đáp án (*)</p>
                    <textarea type="text" className="h-[250px] md:h-[350px]" placeholder="Nhập Data" tabIndex="3" onChange={(e) => handleChangeJSON(e)} value={promptValue} />
                </div>
                <Button className="">Tạo bài</Button>
            </div>
            <div className="flex-1 bg-white rounded-lg p-5 shadow-md">
                <h1>Bộ đề môn: {data?.title}</h1>
                <p>Tổng: {quest?.length} câu hỏi</p>
                <div className="flex flex-col gap-3 mt-3 max-h-[500px] overflow-y-scroll">
                    {quest?.map((item, index) => (
                        <div className=" bg-gray-200 shadow-sm rounded-xl  p-3 text-gray-500" key={index}>
                            <h1 className=" font-bold text-lg">
                                Câu {index + 1}: {item.question.replace("Câu ", "")}
                            </h1>

                            <p className="">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
