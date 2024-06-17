import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import data from "../../data";
export default function Refer() {
    const params = useParams();
    const [selectedData, setSelectedData] = useState([]);

    useEffect(() => {
        // Kiểm tra xem id có trong đối tượng data hay không
        if (data[params.id]) {
            setSelectedData(data[params.id]);
        } else {
            setSelectedData([]); // Nếu không tìm thấy dữ liệu, đặt mảng trống
        }
    }, [params.id]);
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl">Bộ đề môn {params.id}</h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold">{selectedData.length}</label> câu hỏi
                </p>
            </div>
            <div className="">
                {selectedData.map((item, index) => (
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
