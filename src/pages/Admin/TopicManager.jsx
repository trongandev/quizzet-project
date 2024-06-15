import React, { useEffect, useState } from "react";
import { get, get_firebase, patch } from "../../utils/request";
import { Switch, Button, Popover } from "antd";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";

export default function TopicManager() {
    const [topic, setTopic] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const fetchTopic = await get_firebase(db, "quiz");
            console.log(fetchTopic);
            setTopic(fetchTopic);
        };
        fetchBook();
    }, []);

    const handleChangeStatus = async (id, status) => {
        const newTopic = topic.map((item) => {
            if (item.id === id) {
                item.status = !item.status;
            }
            return item;
        });
        setTopic(newTopic);
        const quizDocRef = doc(db, "quiz", id);

        try {
            await updateDoc(quizDocRef, {
                status: !status,
            });
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
        }
    };

    const removeDoc = async (id) => {
        try {
            await deleteDoc(doc(db, "quiz", id));
            setTopic(topic.filter((item) => item.id !== id));
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
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
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen, id) => {
        setOpen(newOpen ? id : false);
    };

    return (
        <div>
            <h1 className="text-lg text-green-500 font-bold">Quản lí tài khoản người dùng</h1>

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
                        {topic &&
                            topic.map((item, index) => (
                                <tr className="bg-white border-b hover:bg-gray-100 hover:cursor-pointer" key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <img src={item.img} className="w-[150px] h-[50px] object-cover" alt="" />
                                    </td>
                                    <td className="px-6 py-4 hover:text-red-500 hover:underline">
                                        <a target="_blank" href={`/quiz/${item.id}`} rel="noreferrer">
                                            {item.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 w-[150px]">{item.content}</td>

                                    <td className="px-6 py-4">{item.date_post}</td>
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
                                                            <Switch checked={item.status} onClick={() => handleChangeStatus(item.id, item.status)} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <p>Xoá bài viết</p>
                                                            <Button>
                                                                <FaRegTrashAlt size={20} onClick={() => handleRemove(item.id)} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            title="Tính năng"
                                            placement="topLeft"
                                            trigger="click"
                                            open={open === item.id}
                                            onOpenChange={(newOpen) => handleOpenChange(newOpen, item.id)}>
                                            <Button className="w-[30px] h-[30px] bg-gray-300 p-2 rounded-full">
                                                <HiDotsHorizontal />
                                            </Button>
                                        </Popover>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
