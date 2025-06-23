"use client";
import React, { useEffect, useState } from "react";
import { Switch, message, Spin, Modal } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { IoMdCheckmark } from "react-icons/io";

export default function Report() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const defaultViolation = { is_violated: false, resolved_content: "" };
    const [violation, setViolation] = useState(defaultViolation);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        const fetchUser = async () => {
            const req = await GET_API("/report", token);
            if (req.ok) {
                setLoading(true);
                setReport(req?.result);
                messageApi.success(req.message);
            } else {
                messageApi.error(req.message);
            }
        };
        fetchUser();
    }, []);

    const [open, setOpen] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showModal = (id) => {
        setOpen(id);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        const req = await POST_API(`/report/${open}`, { ...violation }, "PATCH", token);
        const res = await req.json();
        if (req.ok) {
            setReport((prev) => (prev._id == open ? { ...prev, ...res?.data } : prev));
            messageApi.success(res.message);
        } else {
            messageApi.error(res.message);
        }
        setOpen(null);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(null);
    };
    return (
        <div className="">
            {contextHolder}
            <div className="">
                <h1 className="text-lg text-green-500 font-bold">Quản lí cáo cáo</h1>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left rtl:text-right ">
                        <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NGƯỜI GỬI
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    LOẠI/LINK BÁO CÁO
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NỘI DUNG
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    TRẠNG THÁI
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NGÀY TẠO
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NGƯỜI GIẢI QUYẾT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NGÀY GIẢI QUYẾT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    NỘI DUNG
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading &&
                                report &&
                                report.map((item, index) => (
                                    <tr className={` border-b  bg-white relative`} key={index}>
                                        <th scope="row" className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap`}>
                                            {index + 1}
                                            {item?.is_violated && <div className="absolute top-2 left-0 px-2 bg-red-500 text-white rounded-lg text-[10px]">Vi phạm</div>}
                                            {!item?.is_violated && item?.status == "resolved" && (
                                                <div className="absolute top-2 left-0 px-2 bg-green-500 text-white rounded-lg text-[10px]">An toàn</div>
                                            )}
                                        </th>

                                        <td className="px-6 py-4">
                                            <Link href={`/profile/${item?.user_report._id}`}>
                                                <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                    <Image
                                                        unoptimized
                                                        src={item?.user_report?.profilePicture}
                                                        alt=""
                                                        className="object-cover h-full absolute"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                                <p className="line-clamp-1" title={item?.user_report?.displayName}>
                                                    {item?.user_report?.displayName}
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`${item?.link}`} target="_blank" className="underline hover:text-primary">
                                                {item?.type_of_violation}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">{item?.content}</td>
                                        <td className="px-6 py-4 text-[12px]">
                                            {item.status == "pending" ? (
                                                <div className="bg-red-200 text-red-500 rounded-md text-center px-1">Peding</div>
                                            ) : (
                                                <div className="bg-green-200 text-green-500 rounded-md text-center px-1">Resolved</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4" title={new Date(item?.created_at).toLocaleString("vi-VN")}>
                                            {new Date(item?.created_at).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item?.resolved_by ? (
                                                <Link href={`/profile/${item?.resolved_by?._id}`}>
                                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                        <Image
                                                            unoptimized
                                                            src={item?.resolved_by?.profilePicture}
                                                            alt=""
                                                            className="object-cover h-full absolute"
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                    <p className="line-clamp-1" title={item?.resolved_by?.displayName}>
                                                        {item?.resolved_by?.displayName}
                                                    </p>
                                                </Link>
                                            ) : (
                                                "Chưa có"
                                            )}
                                        </td>
                                        <td className="px-6 py-4" title={new Date(item?.resolved_date).toLocaleString("vi-VN")}>
                                            {new Date(item?.resolved_date).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4">{item?.resolved_content || "Chưa có"}</td>
                                        <td className="px-6 py-4 ">
                                            <div className="bg-green-500 text-white  rounded-md w-[35px] h-[35px] flex items-center justify-center cursor-pointer" onClick={() => showModal(item._id)}>
                                                <IoMdCheckmark />
                                            </div>
                                            <Modal title="Xác nhận báo cáo" open={open == item._id} onOk={handleOk} okText="Duyệt báo cáo" confirmLoading={confirmLoading} onCancel={handleCancel}>
                                                <div className="space-y-2">
                                                    <p>Bài viết này có vi phạm hay không?</p>
                                                    <Switch
                                                        checkedChildren="Có"
                                                        unCheckedChildren="Không"
                                                        checked={violation.is_violated}
                                                        onChange={() => setViolation({ ...violation, is_violated: !violation.is_violated })}
                                                    />
                                                    <textarea
                                                        placeholder="Nội dung ghi nhận được..."
                                                        className="h-[200px]"
                                                        onChange={(e) => setViolation({ ...violation, resolved_content: e.target.value })}
                                                    />
                                                </div>
                                            </Modal>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && (
                        <div className="w-full h-[500px] flex items-center justify-center">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
