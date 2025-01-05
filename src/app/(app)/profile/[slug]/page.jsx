"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { FaFacebookMessenger, FaRegFlag } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useUser } from "@/context/userContext";
import Cookies from "js-cookie";
import Link from "next/link";
import handleCompareDate from "@/lib/CompareDate";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { message, Image as Images, Spin, Modal } from "antd";
import Image from "next/image";

export default function ProfileUID({ params }) {
    const { slug } = params;
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);

    const router = useRouter();
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const defaultReport = { type_of_violation: "spam", content: "" };
    const [report, setReport] = useState(defaultReport);

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/profile/${slug}`, token);
            setProfile(req.user);
            setQuiz(req.quiz);
        };

        fetchAPI();
    }, []);
    const { user } = useUser();

    const handleCreateAndCheckRoomChat = async (id_another_user) => {
        const req = await GET_API(`/chat/check/${id_another_user}`, token);
        if (req.ok && req.exists) {
            // Phòng chat đã tồn tại, điều hướng đến phòng chat
            router.push(`/chat/${req.chatId}`);
        } else if (req.ok && !req.exists) {
            // Phòng chat chưa tồn tại, tạo mới
            const createReq = await POST_API(
                "/chat/create-chat",
                {
                    participants: [user._id, id_another_user],
                },
                "POST",
                token
            );
            const reqData = await createReq.json();
            if (reqData.ok) {
                router.push(`/chat/${reqData.chat}`);
            } else {
                messageApi.open({
                    type: "error",
                    content: reqData.message,
                });
            }
        } else {
            messageApi.open({
                type: "error",
                content: reqData.message,
            });
        }
    };
    if (profile.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        handleSendReport();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSendReport = async () => {
        setConfirmLoading(true);
        const newReport = {
            type_of_violation: report.type_of_violation,
            content: report.content,
            link: `/profile/${params?.slug}`,
        };
        const req = await POST_API(`/report`, { ...newReport }, "POST", token);
        const res = await req.json();
        if (res.ok) {
            messageApi.success(res.message);
            handleCancel();
            setReport(defaultReport);
        } else {
            messageApi.error(res.message);
        }
        setConfirmLoading(false);
    };

    return (
        <div className="px-3 md:px-0">
            {contextHolder}
            {profile ? (
                <>
                    <div className="flex gap-3 items-center">
                        <Images src={profile?.profilePicture} alt="" className="object-cover rounded-full" width={100} height={100} />
                        <div className="">
                            <div className="flex flex-col">
                                <div className="flex gap-1 items-center">
                                    <h1 className="text-2xl font-bold text-gray-700">{profile?.displayName}</h1>
                                    {profile?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                </div>
                                <p className="text-secondary">{profile?.email}</p>
                                <p className="text-secondary">Tham gia vào ngày {new Date(profile?.created_at).toLocaleDateString("vi-VN")}</p>
                                <div className="flex items-center gap-2 text-secondary">
                                    <p>Báo cáo vi phạm?</p>
                                    <div className="mb-0 xl:mb-1 hover:text-primary cursor-pointer bg-gray-200 w-[25px] h-[25px] flex items-center justify-center rounded-lg" onClick={showModal}>
                                        <FaRegFlag size={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal title="Báo cáo vi phạm" open={open} onOk={handleOk} okText="Gửi yêu cầu" confirmLoading={confirmLoading} onCancel={handleCancel}>
                        <div>
                            <p>Loại báo cáo</p>
                            <select value={report.type_of_violation} onChange={(e) => setReport({ ...report, type_of_violation: e.target.value })}>
                                <option value="spam">Spam</option>
                                <option value="không phù hợp">Không phù hợp</option>
                                <option value="khác">Khác</option>
                            </select>
                            <textarea
                                placeholder="Nhập nôi dung cần báo cáo..."
                                className="mt-3 h-[200px]"
                                value={report.content}
                                onChange={(e) => setReport({ ...report, content: e.target.value })}></textarea>
                        </div>
                    </Modal>
                    {token && (
                        <button onClick={() => handleCreateAndCheckRoomChat(params.slug)} className="btn btn-primary flex gap-2 items-center mt-2" disabled={!token}>
                            <FaFacebookMessenger />
                            Nhắn tin
                        </button>
                    )}

                    <hr className="my-5" />
                    <div className="">
                        <h1 className="text-2xl font-bold text-primary" key={profile?._id}>
                            Các bài đăng của {profile?.displayName}
                        </h1>
                        <div className=" mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quiz &&
                                quiz?.map((item) => (
                                    <div key={item._id} className="rounded-[12px]  shadow-md h-[400px]">
                                        <div className="overflow-hidden relative h-full rounded-[8px]">
                                            <Image
                                                src={item?.img || "/meme.jpg"}
                                                alt={item?.title}
                                                className="absolute h-full w-full object-cover hover:scale-110 duration-300  brightness-90"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                                <h1 className="text-lg font-bold">{item?.title}</h1>
                                                <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item?.content}</p>

                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex flex-col">
                                                        <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                            <FaRegEye /> Lượt làm: {item?.noa}
                                                        </p>
                                                        <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                            <CiTimer color="#D9D9D9" /> {handleCompareDate(item?.date)}
                                                        </p>
                                                    </div>

                                                    <Link href={`/quiz/${item?.slug}`} className="block">
                                                        <button className="btn btn-primary flex gap-1 items-center text-sm">
                                                            Làm bài <IoArrowForwardCircleOutline />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {quiz && quiz.length === 0 && (
                            <div className="flex justify-center items-center h-[400px] w-full">
                                <p className="animate-bounce">Người này chưa có đăng bài nào...</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h1>Người này không tồn tại</h1>
                </>
            )}
        </div>
    );
}
