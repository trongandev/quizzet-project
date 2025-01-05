"use client";
import React, { useEffect, useState } from "react";
import { Progress, Spin } from "antd";
import Cookies from "js-cookie";
import { GET_API } from "@/lib/fetchAPI";
import { LoadingOutlined } from "@ant-design/icons";

export default function Answer({ params }) {
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = params;
    const token = Cookies.get("token");
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API("/history/" + slug, token);
            setQuiz(req.history);
            setLoading(true);
        };
        fetchAPI();
    }, [slug, token]);

    return (
        <>
            {loading ? (
                <div className="">
                    <div className="flex justify-between flex-col md:flex-row gap-5 md:gap-0 px-5 text-third">
                        <div className="">
                            {quiz?.quiz_id && (
                                <>
                                    {" "}
                                    <h1 className="text-2xl font-bold text-primary">Bài quiz về chủ đê: {quiz?.quiz_id.title}</h1>
                                    <p className="text-secondary" key={quiz.id}>
                                        Nội dung: {quiz?.quiz_id.content}
                                    </p>
                                </>
                            )}

                            <p>
                                Tổng số câu đúng: {quiz?.score}/{quiz.questions?.data_history.length} câu
                            </p>
                            <p>
                                Tổng thời gian làm: {Math.floor(quiz?.time / 3600)}h:{Math.floor((quiz?.time % 3600) / 60)}p:{quiz?.time % 60}s
                            </p>
                        </div>
                        <div className="flex gap-5 text-center justify-center">
                            <div className="">
                                <Progress
                                    type="circle"
                                    percent={Math.floor((1 / quiz.questions?.data_history.length) * (quiz.questions?.data_history.length - quiz?.score) * 100)}
                                    strokeColor="#ff4d4f"
                                />
                                <p className="text-gray-600 mt-1">Câu sai: {quiz.questions?.data_history.length - quiz.score}</p>
                            </div>

                            <div className="">
                                <Progress type="circle" strokeColor="#2187d5" percent={Math.floor((quiz.score / quiz.questions?.data_history.length) * 100)} />
                                <p className="text-gray-600 mt-1">Tỉ lệ đúng</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {quiz.questions?.data_history.map((item, index) => (
                            <div className="bg-linear-item-2 p-5 mt-5 shadow-sm rounded-xl" key={item.id}>
                                <h1 className={` ${item.answer_correct === item.answer_choose ? "text-primary " : "text-red-500"}   mb-3 flex gap-2 items-center`}>
                                    <p className="text-lg font-bold">
                                        Câu {index + 1}: {item.question_name}
                                    </p>
                                    {item.answer_correct === item.answer_choose ? (
                                        <p className="text-white bg-primary px-3 rounded-md text-[12px]">Đúng</p>
                                    ) : (
                                        <p className="text-white bg-red-500 px-3 rounded-md text-[12px]">Sai</p>
                                    )}
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {item.answers?.map((answer, ansIndex) => (
                                        <div
                                            key={ansIndex}
                                            className={` relative  flex items-center  ${item.answer_correct === ansIndex ? "text-primary font-bold" : ""} ${
                                                item.answer_choose === ansIndex ? "" : ""
                                            }`}>
                                            <input type="radio" name={item.id} className="w-1 invisible" disabled id={`${index}ans${ansIndex}`} defaultChecked={item.answer_correct === ansIndex} />
                                            <label
                                                htmlFor={`${index}ans${ansIndex}`}
                                                className={`absolute font-bold w-10 h-10 flex items-center justify-center rounded-full ${
                                                    item.answer_correct === ansIndex ? "!bg-primary !text-white " : ""
                                                } ${item.answer_choose === ansIndex ? "bg-red-500 text-white" : " "}`}>
                                                {ansIndex === 0 ? "A" : ansIndex === 1 ? "B" : ansIndex === 2 ? "C" : "D"}
                                            </label>
                                            <label htmlFor={`${index}ans${ansIndex}`} className="block w-full ml-10 p-3">
                                                {answer}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-[500px] flex items-center justify-center">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
        </>
    );
}
