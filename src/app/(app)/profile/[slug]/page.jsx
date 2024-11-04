"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { Tooltip, Avatar, Button } from "antd";
import { CiTimer } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { GET_API } from "@/lib/fetchAPI";
import { useUser } from "@/context/userContext";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import handleCompareDate from "@/lib/CompareDate";

export default function ProfileUID({ params }) {
    const { slug } = params;
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API(`/profile/${slug}`, token);
            setProfile(req.user);
            setQuiz(req.quiz);
            setLoading(true);
        };

        fetchAPI();
    }, []);
    const { user, clearUser } = useUser();

    const handleCreateAndCheckRoomChat = async (id_another_user) => {
        const req = await GET_API(`/chat/check/${id_another_user}`, token);
        if (req.ok && req.exists) {
            // Phòng chat đã tồn tại, điều hướng đến phòng chat
            router.push(`/chat/room/${req.chatId}`);
        } else if (req.ok && !req.exists) {
            // Phòng chat chưa tồn tại, tạo mới
            const createReq = await post_api(
                "/chat/create-chat",
                {
                    participants: [user._id, id_another_user],
                },
                "POST"
            );
            const reqData = await createReq.json();
            if (reqData.ok) {
                router.push(`/chat/room/${reqData.chat}`);
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
                    <Button onClick={() => handleCreateAndCheckRoomChat(params.uid)} className="w-[100px] flex gap-1 items-center mt-2">
                        <FaFacebookMessenger />
                        Nhắn tin
                    </Button>

                    <hr className="my-5" />
                    <div className="">
                        <h1 className="text-lg font-bold text-green-500" key={profile._id}>
                            Các bài đăng của {profile.displayName || profile.email}
                        </h1>
                        <div className="bg-white p-5 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quiz && quiz.length === 0 && (
                                <div>
                                    <p>Người này chưa có đăng bài nào</p>
                                </div>
                            )}
                            {quiz &&
                                quiz?.map((item) => (
                                    <div key={item.id} className="relative">
                                        <div className="shadow-md border-2 rounded-lg overflow-hidden group ">
                                            <div className="relative h-[150px]">
                                                <Image src={item.img} alt="" className="h-full w-full object-cover absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                            </div>
                                            <div className="p-3">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                        <Image
                                                            src={profile.profilePicture}
                                                            alt=""
                                                            className="object-cover h-full absolute"
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <div className="flex items-center gap-1">
                                                            <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{profile.displayName}</h2>
                                                            {profile.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                        </div>
                                                        <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                            <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                                <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                                <Link href={`/quiz/${item.slug}`} className="text-right">
                                                    {item.status ? <Button className="bg-green-600 text-white">Làm bài ngay</Button> : <Button className="bg-gray-200 text-black">Xem lại bài</Button>}
                                                </Link>
                                            </div>
                                        </div>

                                        {!item.status && (
                                            <div className="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-80">
                                                <div className="bg-gray-100 text-center text-red-700 text-2xl font-bold h-full flex items-center justify-center flex-col">
                                                    <p>Đang kiểm duyệt</p>
                                                    <Link href={`/quiz/${item.id}`} className="text-right">
                                                        <Button className="mt-3 text-red-700 font-bold flex gap-1 items-center">
                                                            {" "}
                                                            <FaEye />
                                                            Xem lại bài
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
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
