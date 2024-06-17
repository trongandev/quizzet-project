import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";
export default function Refer() {
    const params = useParams();
    const [tool, setTool] = useState([]);

    const db = getFirestore();
    useEffect(() => {
        const fetchQuiz = async () => {
            const querySnapshot = await getDocs(collection(db, "tool"));

            querySnapshot.forEach((doc) => {
                if (doc.data().name === params.id) {
                    setTool(doc.data().quest);
                }
            });
        };

        fetchQuiz();
    }, []);
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl">Bộ đề môn {params.id}</h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold">{tool.length}</label> câu hỏi
                </p>
            </div>
            <div className="">
                {tool.map((item, index) => (
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
