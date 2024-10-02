import { Button, Modal, Input, Switch, message, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import Swal from "sweetalert2";
import { get_api, post_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";
import { FaRegEye } from "react-icons/fa";
import { set } from "date-fns";

export default function UserUseTool() {
    const [tool, setTool] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTool = async () => {
            const sort = await get_api("/tool/user");
            message.success(sort.message);
            setTool(sort);
        };
        fetchTool();
    }, [loading]);

    console.log(tool);

    const removeDoc = async (id) => {
        const req = await post_api(`/tool/user`, { id: id }, "DELETE");
        const res = await req.json();
        if (req.ok) {
            message.success(res.message);
            setTool(tool.filter((item) => item._id !== id));
        } else {
            message.error(res.message);
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
    const [openDetail, setOpenDetail] = useState(false);
    const [loadingSwitch, setLoadingSwitch] = useState(false);
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

    const [dataDetail, setDataDetail] = useState({});
    const showModalDetail = (id) => {
        setOpenDetail(true);
        const findData = tool.find((item) => item._id === id);
        setDataDetail(findData);
    };

    const handleOkDetail = () => {
        setOpenDetail(false);
        handleUpdateUser();
    };

    const handleUpdateUser = async () => {
        setConfirmLoading(true);
        const req = await post_api(`/tool/user/${dataDetail._id}`, dataDetail, "PATCH");
        const res = await req.json();
        if (req.ok) {
            setOpenDetail(false);
            setConfirmLoading(false);
            setLoading(true);
            message.success(res.message);
        } else {
            message.error(res.message);
            setConfirmLoading(false);
        }
    };

    const handleChangeDataDetail = (e) => {
        setDataDetail({ ...dataDetail, [e.target.id]: e.target.value });
    };

    const handleCancelDetail = () => {
        setOpenDetail(false);
    };

    const handleInput = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const handlePost = async () => {
        setConfirmLoading(true);

        const res = await post_api("/tool/user", data, "POST");
        const req = await res.json();
        if (res.ok) {
            setOpen(false);
            setConfirmLoading(false);
            setLoading(true);
            message.success(req.message);
        } else {
            message.error(req.message);
            setConfirmLoading(false);
        }
    };

    const handleChangeStatus = async (id, status) => {
        setLoadingSwitch(true);
        const req = await post_api(`/tool/user/${id}`, { status: !status }, "PATCH");
        const res = await req.json();
        if (req.ok) {
            const newTool = tool.map((item) => {
                if (item._id === id) {
                    item.status = !item.status;
                }
                return item;
            });
            setTool(newTool);
            message.success(res.message);
            setLoadingSwitch(false);
        } else {
            message.error(res.message);
            setLoadingSwitch(false);
        }
    };

    const handleRandomPassword = () => {
        const randomLetterAndPassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomPassword = "";
        for (let i = 0; i < 12; i++) {
            randomPassword += randomLetterAndPassword.charAt(Math.floor(Math.random() * randomLetterAndPassword.length));
        }
        setData({ ...data, password: randomPassword });
        setDataDetail({ ...dataDetail, password: randomPassword });
    };

    const onChange = async (value, id) => {
        setLoadingSwitch(true);
        const req = await post_api(`/tool/user/${id}`, { count_login: value }, "PATCH");
        const res = await req.json();
        if (req.ok) {
            const newTool = tool.map((item) => {
                if (item._id === id) {
                    item.count_login = value;
                }
                return item;
            });
            setTool(newTool);
            message.success(res.message);
            setLoadingSwitch(false);
        } else {
            message.error(res.message);
            setLoadingSwitch(false);
        }
    };

    const onChangeFail = async (value, id) => {
        setLoadingSwitch(true);
        const req = await post_api(`/tool/user/${id}`, { failed_login_attempts: value }, "PATCH");
        const res = await req.json();
        if (req.ok) {
            const newTool = tool.map((item) => {
                if (item._id === id) {
                    item.failed_login_attempts = value;
                }
                return item;
            });
            setTool(newTool);
            message.success(res.message);
            setLoadingSwitch(false);
        } else {
            message.error(res.message);
            setLoadingSwitch(false);
        }
    };

    return (
        <div className="">
            <div className="">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg text-green-500 font-bold">Quản lí tool</h1>
                    <Button onClick={showModal} className="flex gap-1 items-center">
                        <IoAdd />
                        Thêm mới
                    </Button>
                    <Modal title="Thêm bài mới" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
                        <div className="space-y-2">
                            <div className="flex gap-3">
                                <div className="form-group flex-1">
                                    <label htmlFor="username">Tên đăng nhập</label>
                                    <Input type="text" id="username" placeholder="Nhập username" value={data.username} onChange={(e) => handleInput(e)} />
                                </div>
                                <div className="form-group flex-1">
                                    <label htmlFor="note">Ghi chú</label>
                                    <Input type="text" id="note" placeholder="Nhập note" value={data.note} onChange={(e) => handleInput(e)} />
                                </div>
                            </div>
                            <div className="">
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <div className="flex items-center gap-3">
                                        <Button onClick={handleRandomPassword}>Random password</Button>
                                        <Input className="flex-1" type="text" id="password" placeholder="Nhập mật khẩu" value={data.password} onChange={(e) => handleInput(e)} />
                                    </div>
                                </div>
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
                                    Tên đăng nhập
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mật khẩu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ghi chú
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số lần
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày kích hoạt
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tool &&
                                tool.map((item, index) => (
                                    <tr className="bg-white border-b " key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}
                                        </th>

                                        <td className="px-6 py-4">{item.username}</td>
                                        <td className="px-6 py-4">{item.password}</td>
                                        <td className="px-6 py-4">{item.note}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 items-center mb-1">
                                                <label htmlFor="count_login">Used</label>
                                                <InputNumber min={1} max={10} defaultValue={1} value={item.count_login} onChange={(value) => onChange(value, item._id)} disabled={loadingSwitch} />
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <label htmlFor="failed_login_attempts">Fail</label>
                                                <InputNumber
                                                    min={0}
                                                    max={5}
                                                    defaultValue={0}
                                                    value={item.failed_login_attempts}
                                                    onChange={(value) => onChangeFail(value, item._id)}
                                                    disabled={loadingSwitch}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.status ? <p className="text-green-500 font-bold">Active</p> : <p className="text-red-500 font-bold">Locked</p>}
                                            <Switch checked={item.status} loading={loadingSwitch} onClick={() => handleChangeStatus(item._id, item.status)} />
                                        </td>

                                        <td className="px-6 py-4">{handleCompareDate(item.created_at)}</td>
                                        <td className="px-6 py-4">{item.active_date ? handleCompareDate(item.active_date) : "Chưa kích hoạt"}</td>
                                        <td className="px-6 py-4 ">
                                            <div className="flex gap-1 items-center">
                                                <Button onClick={() => showModalDetail(item._id)} type="dashed">
                                                    <FaRegEye />
                                                </Button>
                                                <Button onClick={() => handleDelete(item._id)} danger type="primary">
                                                    <CiTrash />
                                                </Button>
                                                <Modal title="Cập nhật lại User" open={openDetail} onOk={handleOkDetail} confirmLoading={confirmLoading} onCancel={handleCancelDetail}>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-3">
                                                            <div className="form-group flex-1">
                                                                <label htmlFor="username">Tên đăng nhập</label>
                                                                <Input type="text" id="username" placeholder="Nhập username" value={dataDetail.username} onChange={(e) => handleChangeDataDetail(e)} />
                                                            </div>
                                                            <div className="form-group flex-1">
                                                                <label htmlFor="note">Ghi chú</label>
                                                                <Input type="text" id="note" placeholder="Nhập note" value={dataDetail.note} onChange={(e) => handleChangeDataDetail(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className="form-group">
                                                                <label htmlFor="password">Mật khẩu</label>
                                                                <div className="flex items-center gap-3">
                                                                    <Button onClick={handleRandomPassword}>Random password</Button>
                                                                    <Input
                                                                        className="flex-1"
                                                                        type="text"
                                                                        id="password"
                                                                        placeholder="Nhập mật khẩu"
                                                                        value={dataDetail.password}
                                                                        onChange={(e) => handleChangeDataDetail(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
