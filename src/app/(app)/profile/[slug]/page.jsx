"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { Button } from "antd";
import { CiTimer } from "react-icons/ci";
import { FaEye, FaRegEye } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { useUser } from "@/context/userContext";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import handleCompareDate from "@/lib/CompareDate";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

export default function ProfileUID({ params }) {
    const { slug } = params;
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);

    const router = useRouter();
    const token = Cookies.get("token");

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
            }
        } else {
            console.log(req.message);
        }
    };

    return (
        <div>
            {profile ? (
                <>
                    <div className="flex gap-3 items-center">
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden relative">
                            <Image src={profile.profilePicture} alt="" className="object-cover h-full absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                        <div className="">
                            <div className="flex gap-2 items-center">
                                <h1 className="text-2xl font-bold text-gray-700">{profile.displayName || profile.email}</h1>
                                {profile.emailVerified ? <MdOutlineVerified color="#3b82f6" /> : ""}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => handleCreateAndCheckRoomChat(params.slug)} className="flex gap-2 items-center mt-2">
                        <FaFacebookMessenger />
                        Nhắn tin
                    </button>

                    <hr className="my-5" />
                    <div className="">
                        <h1 className="text-2xl font-bold text-primary" key={profile._id}>
                            Các bài đăng của {profile.displayName || profile.email}
                        </h1>
                        <div className=" mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quiz && quiz.length === 0 && (
                                <div>
                                    <p>Người này chưa có đăng bài nào</p>
                                </div>
                            )}
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
