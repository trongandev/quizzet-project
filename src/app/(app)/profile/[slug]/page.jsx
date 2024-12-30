"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { FaFacebookMessenger } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useUser } from "@/context/userContext";
import Cookies from "js-cookie";
import Link from "next/link";
import handleCompareDate from "@/lib/CompareDate";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { message, Image } from "antd";

export default function ProfileUID({ params }) {
    const { slug } = params;
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);

    const router = useRouter();
    const token = Cookies.get("token");
    const [messageApi, contextHolder] = message.useMessage();

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
                console.log(reqData.message);
                messageApi.open({
                    type: "error",
                    content: reqData.message,
                });
            }
        } else {
            console.log(req.message);
            messageApi.open({
                type: "error",
                content: reqData.message,
            });
        }
    };

    return (
        <div className="px-3 md:px-0">
            {contextHolder}
            {profile ? (
                <>
                    <div className="flex gap-3 items-center">
                        <Image src={profile?.profilePicture || "/meme.jpg"} alt="" className="object-cover rounded-full" width={100} height={100} />
                        <div className="">
                            <div className="flex flex-col">
                                <div className="flex gap-1 items-center">
                                    <h1 className="text-2xl font-bold text-gray-700">{profile?.displayName || "Đang tải..."}</h1>
                                    {profile?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                </div>
                                <p className="text-secondary">{profile?.email || "Đang tải..."}</p>
                                <p className="text-secondary">Tham gia vào ngày {new Date(profile?.created_at).toLocaleDateString("vi-VN") || "Đang tải..."}</p>
                            </div>
                        </div>
                    </div>
                    {token === undefined ? (
                        ""
                    ) : (
                        <button onClick={() => handleCreateAndCheckRoomChat(params.slug)} className="btn btn-primary flex gap-2 items-center mt-2" disabled={token === undefined}>
                            <FaFacebookMessenger />
                            Nhắn tin
                        </button>
                    )}

                    <hr className="my-5" />
                    <div className="">
                        <h1 className="text-2xl font-bold text-primary" key={profile._id}>
                            Các bài đăng của {profile.displayName || profile.email}
                        </h1>
                        <div className=" mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quiz &&
                                quiz?.map((item) => (
                                    <div key={item._id} className="rounded-[12px]  shadow-md h-[400px]">
                                        <div className="overflow-hidden relative h-full rounded-[8px]">
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                className="absolute h-full w-full object-cover hover:scale-110 duration-300  brightness-75"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority
                                                unoptimized
                                            />
                                            <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                                <h1 className="text-lg font-bold">{item.title}</h1>
                                                <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>

                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex flex-col">
                                                        <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                            <FaRegEye /> Lượt làm: {item.noa}
                                                        </p>
                                                        <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                            <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                                        </p>
                                                    </div>

                                                    <Link href={`/quiz/${item.slug}`} className="block">
                                                        <button className="flex gap-1 items-center text-sm">
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
