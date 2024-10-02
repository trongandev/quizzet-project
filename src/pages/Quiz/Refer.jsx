import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { get_api } from "../../services/fetchapi";
import { useQuery } from "@tanstack/react-query";

const fetchSO = async (slug) => {
    const req = await get_api(`/admin/so/${slug}`);
    return req;
};

export default function Refer() {
    const params = useParams();
    const [tool, setTool] = useState([]);

    const { data: SOData, isLoading: SOLoading } = useQuery({
        queryKey: ["SO" + params.id],
        queryFn: () => fetchSO(params.id),
    });

    useEffect(() => {
        document.title = "Quiz - " + SOData?.title;
    }, []);
    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl ">
                    Bộ đề môn: <label className="text-green-500 font-bold ">{SOData?.title}</label>{" "}
                </h1>
                <p>
                    Tổng: <label className="text-red-500 font-bold ">{SOData?.lenght}</label> câu hỏi
                </p>
            </div>
            <div className="grid grid-cols-1  gap-2 md:gap-5 mt-5">
                {SOData &&
                    SOData?.quest?.data_so.map((item, index) => (
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
