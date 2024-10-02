import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { get_api } from "../../services/fetchapi";
export default function Refer() {
    const params = useParams();
    const [tool, setTool] = useState([]);
    useEffect(() => {
        const fetchQuiz = async () => {
            const req = await get_api(`/admin/so/${params.id}`);
            setTool(req);
        };

        fetchQuiz();
    }, []);
    document.title = "Quiz - " + tool?.title;
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl ">
                    Bộ đề môn: <label className="text-green-500 font-bold ">{tool.title}</label>{" "}
                </h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold ">{tool.lenght}</label> câu hỏi
                </p>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {tool &&
                    tool.quest?.data_so.map((item, index) => (
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
