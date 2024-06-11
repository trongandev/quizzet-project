import React from "react";
import { useParams } from "react-router-dom";
import kttt from "../../data/kttt";
export default function Refer() {
    const { id } = useParams();
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl">Bộ đề kinh tế chính trị</h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold">{kttt.length}</label> câu hỏi
                </p>
            </div>
            <div className="">
                {kttt.map((item, index) => (
                    <div className="mb-3 bg-white p-5" key={index}>
                        <p className="text-green-500 font-bold text-lg">{item.question}</p>
                        <p className="text-gray-500">A. Chưa có đáp án</p>
                        <p className="text-gray-500">B. Chưa có đáp án</p>
                        <p className="text-gray-500">C. Chưa có đáp án</p>
                        <p className="text-green-500">{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
