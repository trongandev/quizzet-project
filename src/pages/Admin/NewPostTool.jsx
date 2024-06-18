import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { get_firebase } from "../../utils/request";
import { addDoc, collection, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { CiTrash } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import template from "../../data/template";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import sortArrayByTime from "../../helpers/sort";
export default function NewPostTool() {
    const [tool, setTool] = useState([]);
    const [isPost, setIsPost] = useState(false);

    const db = getFirestore();
    useEffect(() => {
        const fetchTool = async () => {
            const fetchTopic = await get_firebase(db, "tool");
            const result = sortArrayByTime(fetchTopic);
            setTool(result);
        };
        fetchTool();
        setIsPost(false);
    }, [isPost]);

    const removeDoc = async (id) => {
        try {
            await deleteDoc(doc(db, "tool", id));
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

    const handlePost = async () => {
        const now = new Date();
        const data = {
            name: "kiemtoan",
            title: "Kiểm toán",
            image: "https://media.tapchitaichinh.vn/images/upload/duongthanhhai/12072020/kiemtoan.jpg   ",
            description: "Các đáp án, ôn tập về bộ môn Kiểm toán",
            date: format(now, "HH:mm:ss dd/MM/yyyy"),
        };

        try {
            await addDoc(collection(db, "tool"), {
                ...data,
                quest: template,
            });
        } catch (error) {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: error.message,
                icon: "error",
            });
        }
        setIsPost(true);

        Swal.fire({
            title: "Thêm thành công",
            icon: "success",
        });
    };

    console.log(tool);
    return (
        <div className="">
            <div className="">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg text-green-500 font-bold">Quản lí tool</h1>
                    <Button onClick={handlePost} className="flex gap-1 items-center">
                        <IoAdd />
                        Thêm mới
                    </Button>
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
                                    Mô tả
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
                            {tool.map((item, index) => (
                                <tr className="bg-white border-b " key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <img src={item.image} alt="" className="w-[150px] h-[100px] object-cover" />
                                    </td>
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/tool/${item.name}`}>{item.title}</Link>
                                    </td>

                                    <td className="px-6 py-4">{item.description}</td>
                                    <td className="px-6 py-4">{item.date}</td>
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
