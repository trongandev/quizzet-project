import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { FaRegEye } from "react-icons/fa";
import { get_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";

export default function HistoryTool() {
    const [history, setHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const showModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        const fetchBook = async () => {
            const fetchTopic = await get_api("/tool/history");
            console.log(fetchTopic);
            setHistory(fetchTopic);
        };
        fetchBook();
    }, []);

    // const handleChangeStatus = async (id, status) => {
    //     const newTopic = history.map((item) => {
    //         if (item.id === id) {
    //             item.status = !item.status;
    //         }
    //         return item;
    //     });
    //     setHistory(newTopic);
    //     const quizDocRef = doc(db, "quiz", id);

    //     try {
    //         await updateDoc(quizDocRef, {
    //             status: !status,
    //         });
    //     } catch (error) {
    //         Swal.fire({
    //             title: "Có lỗi xảy ra",
    //             text: error.message,
    //             icon: "error",
    //         });
    //     }
    // };

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
                                Tên Môn
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên user
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Password
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thông tin
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Headers
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Thời gian
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
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
                                        <p>{item.subject}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{item.username}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{item.password}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{item.message}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button onClick={() => showModal(item)}>
                                            <FaRegEye />
                                        </Button>
                                    </td>

                                    <td className="px-6 py-4">{handleCompareDate(item.created_at)}</td>
                                    <td className="px-6 py-4">
                                        {item.status ? (
                                            <p className="text-green-500 bg-green-200 rounded-full text-center py-[1px] ">Thành công</p>
                                        ) : (
                                            <p className="text-red-500 bg-red-200 rounded-full text-center py-[1px] ">Thất bại</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {selectedItem && (
                    <Modal title="Thông tin chi tiết" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1050}>
                        <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
                    </Modal>
                )}
            </div>
        </div>
    );
}
