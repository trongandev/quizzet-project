"use client";
import React, { useEffect, useState } from "react";
import { Switch, message, Spin, Modal } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import { IoAdd } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import handleCompareDate from "@/lib/CompareDate";

export default function Notice() {
    const [notice, setNotice] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSwitch, setLoadingSwitch] = useState(false);
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        setLoading(true);

        const fetchNotice = async () => {
            const req = await GET_API("/notice", token);
            if (req.ok) {
                setNotice(req.notice);
                messageApi.success(req.message);
            } else {
                messageApi.error(req.message);
            }
            setLoading(false);
        };
        fetchNotice();
    }, []);

    const handleUpdateNotice = async (id, status) => {
        setLoadingSwitch(true);
        console.log(id, status);
        const req = await POST_API(`/notice/${id}`, { status: !status }, "PATCH", token);
        const data = req.json();
        if (req.ok) {
            setNotice(notice.map((item) => (item._id === id ? { ...item, status: !status } : item)));

            messageApi.success(data.message);
        } else {
            messageApi.error(data.message);
        }
        setLoadingSwitch(false);
    };

    const handleAddNotice = async () => {
        setConfirmLoading(true);
        console.log(newNotice);
        const req = await POST_API(`/notice`, newNotice, "POST", token);
        const data = req.json();
        if (req.ok) {
            setConfirmLoading(false);
            setNotice([...notice, data.notice]);
            setNewData(defaultNotice);
            messageApi.success(data.message);
        } else {
            messageApi.error(data.message);
        }
        setConfirmLoading(false);
    };

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const defaultNotice = { title: "", content: "", image: "", link: "", status: true };
    const [newNotice, setNewData] = useState(defaultNotice);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        handleAddNotice();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDelete = async (id) => {
        const req = await POST_API(`/notice`, { id }, "DELETE", token);
        const data = req.json();
        if (req.ok) {
            setNotice(notice.filter((item) => item._id !== id));
            messageApi.success(data.message);
        } else {
            messageApi.error(data.message);
        }
    };
    return (
        <div className="">
            {contextHolder}
            <div className="">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg text-primary font-bold">Quản lí thông báo trên trang chủ</h1>
                    <button onClick={showModal} className="flex gap-1 items-center btn btn-primary">
                        <IoAdd />
                        Thêm mới
                    </button>
                    <Modal title="Thêm bài mới" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Tiêu đề
                                </label>
                                <input type="text" name="title" id="title" className="" onChange={(e) => setNewData({ ...newNotice, title: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                    Nội dung
                                </label>
                                <textarea name="content" id="content" className="" onChange={(e) => setNewData({ ...newNotice, content: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Link
                                </label>
                                <input type="text" name="image" id="image" className="" onChange={(e) => setNewData({ ...newNotice, link: e.target.value })} />
                            </div>
                        </div>
                    </Modal>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left rtl:text-right ">
                        <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tiêu đề
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nội dung
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Link
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading &&
                                notice &&
                                notice.map((item, index) => (
                                    <tr className="bg-white border-b " key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">
                                            <p>{item?.title}</p>
                                        </td>
                                        <td className="px-6 py-4">{item?.content}</td>
                                        <td className="px-6 py-4">{item?.link}</td>

                                        <td className="px-6 py-4">
                                            <Switch loading={loadingSwitch} checked={item?.status} onClick={() => handleUpdateNotice(item?._id, item?.status)} />
                                        </td>
                                        <td className="px-6 py-4">{handleCompareDate(item?.created_at)}</td>
                                        <td className="px-6 py-4 ">
                                            <button className="mr-1 btn btn-primary ">
                                                <BiEdit />
                                            </button>
                                            <button className="btn btn-primary !bg-red-500" onClick={() => handleDelete(item._id)}>
                                                <CiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="w-full h-[500px] flex items-center justify-center">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    )}
                    {loading && notice.length === 0 && <div>Chưa có thông tin</div>}
                </div>
            </div>
        </div>
    );
}
