import { Button, Modal, Input, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { get_firebase } from "../../utils/request";
import { addDoc, collection, deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { CiTrash } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import Swal from "sweetalert2";
import sortArrayByTime from "../../helpers/sort";

export default function UserUseTool() {
    const [tool, setTool] = useState([]);
    const [isPost, setIsPost] = useState(false);

    const db = getFirestore();
    useEffect(() => {
        const fetchTool = async () => {
            const sort = await get_firebase(db, "user-tool");
            const result = sortArrayByTime(sort);
            setTool(result);
            console.log(result);
        };
        fetchTool();
        setIsPost(false);
    }, [isPost]);

    const removeDoc = async (id) => {
        try {
            await deleteDoc(doc(db, "user-tool", id));
            setTool(tool.filter((item) => item.id !== id));
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
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

    const handlePost = async () => {
        try {
            await addDoc(collection(db, "user-tool"), {
                ...data,
                isLocked: false,
            });
            setOpen(false);
            setConfirmLoading(false);
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
        }
        setIsPost(true);
        setData({});
        Swal.fire({
            title: "Thêm thành công",
            icon: "success",
        });
    };

    const handleChangeStatus = async (id, isLocked) => {
        const newTool = tool.map((item) => {
            if (item.id === id) {
                item.isLocked = !item.isLocked;
            }
            return item;
        });
        setTool(newTool);
        const quizDocRef = doc(db, "user-tool", id);

        try {
            await updateDoc(quizDocRef, {
                isLocked: !isLocked,
            });
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
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
                        <div className="">
                            <div className="form-group">
                                <label htmlFor="username">Tên đăng nhập</label>
                                <Input type="text" id="username" placeholder="Nhập username" value={data.username} onChange={(e) => handleInput(e)} />
                            </div>{" "}
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <Input type="text" id="password" placeholder="Nhập mật khẩu" value={data.password} onChange={(e) => handleInput(e)} />
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
                                    Trạng thái
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
                            {tool.map((item, index) => (
                                <tr className="bg-white border-b " key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>

                                    <td className="px-6 py-4">{item.username}</td>
                                    <td className="px-6 py-4">{item.password}</td>
                                    <td className="px-6 py-4">
                                        {item.isLocked ? <p className="text-red-500 font-bold">Locked</p> : <p className="text-green-500 font-bold">Active</p>}
                                        <Switch checked={item.isLocked} onClick={() => handleChangeStatus(item.id, item.isLocked)} />
                                    </td>

                                    <td className="px-6 py-4">{item.date || "Chưa kích hoạt"}</td>
                                    <td className="px-6 py-4">
                                        <Button onClick={() => handleDelete(item.id)}>
                                            <CiTrash />
                                        </Button>
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
