import React, { useEffect, useState } from "react";
import { Switch, Button, Popover, message, Spin } from "antd";
import Swal from "sweetalert2";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { get_api, post_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";
import { LoadingOutlined } from "@ant-design/icons";

export default function TopicManager() {
    const [topic, setTopic] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSwitch, setLoadingSwitch] = useState(false);

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await get_api("/quiz/admin");
            if (req.ok) {
                log("success", "Fetch chủ đề thành công!");
                setTopic(req.quiz);
                setLoading(true);
            } else {
                log("error", req.message);
            }
        };
        fetchAPI();
    }, []);

    const handleChangeStatus = async (id, status) => {
        setLoadingSwitch(true);
        const req = await post_api(`/quiz/${id}`, { status: !status }, "PATCH");
        const data = await req.json();
        if (req.ok) {
            setLoadingSwitch(false);

            const newTopic = topic.map((item) => {
                if (item._id === id) {
                    item.status = !item.status;
                }
                return item;
            });
            setTopic(newTopic);
            log("success", data.message);
        } else {
            log("error", data.message);
        }
    };

    const removeDoc = async (id) => {
        const req = await post_api(`/quiz`, { _id: id }, "DELETE");
        const data = await req.json();
        if (req.ok) {
            setTopic(topic.filter((item) => item._id !== id));
            log("success", "Xoá thành công!");
        } else {
            log("success", data.message);
        }
    };

    const handleRemove = async (id) => {
        Swal.fire({
            title: "Bạn chắc chắn muốn xoá bài viết này chứ",
            text: "Mọi người sẽ không thấy bài này nữa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xoá",
        }).then((result) => {
            if (result.isConfirmed) {
                removeDoc(id);
            }
        });
    };

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleOpenChange = (newOpen, id) => {
        setOpen(newOpen ? id : false);
    };

    const log = (method, text) => {
        if (method === "success") {
            messageApi.success(text);
        } else if (method === "error") {
            messageApi.error(text);
        } else if (method === "warning") {
            messageApi.warning(text);
        } else if (method === "loading") {
            messageApi.loading(text);
        } else {
            messageApi.info(text);
        }
    };

    const showModal = () => {
        setOpen(true);
    };

    return (
        <div>
            {contextHolder}
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-green-500 font-bold">Quản lí bài đămg</h1>
            </div>

            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right ">
                    <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hình ảnh
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên bài đăng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nội dung
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Ngày đăng
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
                        {loading &&
                            topic &&
                            topic.map((item, index) => (
                                <tr className="bg-white border-b hover:bg-gray-100 hover:cursor-pointer" key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="">
                                        <img src={item.img} className="w-[150px] object-cover h-[80px]" alt="" />
                                    </td>
                                    <td className="px-6 py-4 hover:text-red-500 hover:underline">
                                        <a target="_blank" href={`/quiz/${item.slug}`} rel="noreferrer">
                                            {item.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 w-[150px]">{item.content}</td>

                                    <td className="px-6 py-4">{handleCompareDate(item.date)}</td>
                                    <td className="px-6 py-4">
                                        {item.status ? (
                                            <div className="bg-green-200 text-green-500 rounded-full text-center px-1">Duyệt</div>
                                        ) : (
                                            <div className="bg-red-200 text-red-500 rounded-full text-center px-1">Chưa duyệt</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <Popover
                                            content={
                                                <>
                                                    <div className="">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <p>{item.status ? "Duyệt bài viết" : "Chưa duyệt"}</p>
                                                            <Switch loading={loadingSwitch} checked={item.status} onClick={() => handleChangeStatus(item._id, item.status)} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <p>Xoá bài viết</p>
                                                            <Button onClick={() => handleRemove(item._id)}>
                                                                <FaRegTrashAlt size={20} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            title="Tính năng"
                                            placement="topLeft"
                                            trigger="click"
                                            open={open === item._id}
                                            onOpenChange={(newOpen) => handleOpenChange(newOpen, item._id)}>
                                            <Button className="w-[30px] h-[30px] bg-gray-300 p-2 rounded-full">
                                                <HiDotsHorizontal />
                                            </Button>
                                        </Popover>
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
    );
}
