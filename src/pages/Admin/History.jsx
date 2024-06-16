import React, { useEffect, useState } from "react";
import { get, get_firebase, patch } from "../../utils/request";
import { Switch, Button, Popover, Avatar } from "antd";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";

export default function History() {
    const [history, setHistory] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const fetchTopic = await get_firebase(db, "histories");
            console.log(fetchTopic);
            setHistory(fetchTopic);
        };
        fetchBook();
    }, []);

    const handleChangeStatus = async (id, status) => {
        const newTopic = history.map((item) => {
            if (item.id === id) {
                item.status = !item.status;
            }
            return item;
        });
        setHistory(newTopic);
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
            await deleteDoc(doc(db, "histories", id));
            setHistory(history.filter((item) => item.id !== id));
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
            <h1 className="text-lg text-green-500 font-bold">Lịch sử làm bài</h1>

            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right ">
                    <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên người làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên bài làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nội dung
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Ngày làm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Số câu đúng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {history &&
                            history.map((item, index) => (
                                <tr className="bg-white border-b hover:bg-gray-100 hover:cursor-pointer" key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.image ? (
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                <img src={item.image} alt="" className="object-cover h-full" />
                                            </div>
                                        ) : (
                                            <Avatar className="w-[40px] h-[40px] md:w-[35px] md:h-[35px]" icon={<UserOutlined />} />
                                        )}{" "}
                                        <p>{item.username || item.email}</p>
                                    </td>
                                    <td className="px-6 py-4 hover:text-red-500 hover:underline">
                                        <a target="_blank" href={`/answer/${item.id}`} rel="noreferrer">
                                            {item.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">{item.content}</td>

                                    <td className="px-6 py-4">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <p>
                                            {item.score}/{item.questions?.length}
                                        </p>
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
