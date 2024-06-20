import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Button } from "antd";
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
                <h1 className="text-2xl ">Bộ đề môn {params.id}</h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold ">{tool.length}</label> câu hỏi
                </p>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {tool.map((item, index) => (
                    <div className=" bg-white  p-5" key={index}>
                        <h1 className=" font-bold text-lg">
                            Câu {index + 1}: {item.question.replace("Câu ", "")}
                        </h1>

                        <p className="text-green-500">{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
