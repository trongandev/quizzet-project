import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { get_api } from "../../services/fetchapi";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { LoadingOutlined } from "@ant-design/icons";

const fetchSO = async (slug) => {
    const req = await get_api(`/admin/so/${slug}`);
    return req;
};

export default function Refer() {
    const params = useParams();

    const { data: SOData, isLoading: SOLoading } = useQuery({
        queryKey: ["SO" + params.id],
        queryFn: () => fetchSO(params.id),
    });

    return (
        <div className="">
            <Helmet>
                <title>{SOData?.title}</title>
                <meta name="description" content={SOData?.content} />
                <meta name="keywords" content={`${SOData?.title}, ${SOData?.content}`} />
                <meta property="og:title" content={SOData?.content} />
                <meta property="og:url" content={`https://www.trongan.site/decuong/${SOData?.slug}`} />
            </Helmet>
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
            {SOLoading && (
                <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
            )}
        </div>
    );
}
