import { Button, Modal, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { get_api, post_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";
import { MdContentPaste } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { LoadingOutlined } from "@ant-design/icons";

export default function NewPostTool() {
    const [tool, setTool] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTool = async () => {
            setLoading(true);
            const req = await get_api("/admin/suboutline");

            setTool(req);
        };
        fetchTool();
    }, []);

    const removeDoc = async (id) => {
        const req = await post_api(`/admin/suboutline`, { id: id }, "DELETE");
        const data = await req.json();
        if (req.ok) {
            setTool(tool.filter((item) => item._id !== id));
            log("success", "Xoá thành công!");
        } else {
            log("error", data.message);
        }
    };

    const handleDelete = async (id) => {
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
    const [data, setData] = useState({});

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        handlePost();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleInput = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const handleChangeJSON = (e) => {
        setData({ ...data, quest: JSON.parse(e.target.value) });
    };

    const handlePost = async () => {
        const newData = { ...data, date: new Date().toISOString() };
        const req = await post_api("/admin/suboutline", newData, "POST");
        const res = await req.json();
        if (req.ok) {
            setOpen(false);
            setConfirmLoading(false);
            setTool([...tool, newData]);
            setData({});
            log("success", "Thêm thành công!");
        } else {
            log("error", res.message);
        }
        setConfirmLoading(false);
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            console.log(text);
            setData({
                ...data,
                image: text,
            });
        });
    };
    const [messageApi, contextHolder] = message.useMessage();

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
    return (
        <div className="">
            {contextHolder}
            <div className="">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg text-green-500 font-bold">Quản lí tool</h1>
                    <Button onClick={showModal} className="flex gap-1 items-center">
                        <IoAdd />
                        Thêm mới
                    </Button>
                    <Modal title="Thêm bài mới" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
                        <div className="space-y-3">
                            <div className="form-group  flex-1">
                                <div className="">
                                    <label htmlFor="title">Tên bài</label>
                                    <div className="flex gap-1">
                                        <Input type="text" id="title" placeholder="Nhập tiêu đề của bài" autoFocus tabIndex="1" onChange={(e) => handleInput(e)} value={data.title} />
                                        <Link to={`https://www.google.com/search?q=${data.title}&udm=2`} target="_black">
                                            <Button>
                                                <FiSearch />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Hình ảnh</label>
                                <div className="flex gap-1">
                                    <Button onClick={handlePaste}>
                                        <MdContentPaste />
                                    </Button>
                                    <Input type="text" id="image" placeholder="Nhập URL hình ảnh" tabIndex="2" onChange={(e) => handleInput(e)} value={data.image} />
                                </div>
                            </div>{" "}
                            <div className="form-group">
                                <label htmlFor="data">Data</label>
                                <TextArea type="text" id="quest" placeholder="Nhập Data" tabIndex="3" onChange={(e) => handleChangeJSON(e)} value={data.quest} />
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
                                    Hình ảnh
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Slug bài
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên bài
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading &&
                                tool &&
                                tool.map((item, index) => (
                                    <tr className="bg-white border-b " key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">
                                            <img src={item.image} alt="" className="w-[150px] h-[100px] object-cover" />
                                        </td>
                                        <td className="px-6 py-4">{item.slug}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/decuong/${item.slug}`}>{item.title}</Link>
                                        </td>

                                        <td className="px-6 py-4">{handleCompareDate(item?.date)}</td>
                                        <td className="px-6 py-4">
                                            <Button onClick={() => handleDelete(item._id)}>
                                                <CiTrash />
                                            </Button>
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
