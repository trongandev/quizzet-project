"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { Modal, Input, Popover, Button } from "antd";
import { IoMdSettings } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiTimer } from "react-icons/ci";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Cookies from "js-cookie";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import handleCompareDate from "@/lib/CompareDate";

export default function CProfile() {
    const [user, setUser] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const token = Cookies.get("token");

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchAPI = async () => {
            const req = await GET_API("/profile", token);
            setUser(req.user);
            setQuiz(req.quiz);
            setLoading(true);
        };
        fetchAPI();
    }, [loading, token]);
    const [valueOtp, setValueOtp] = useState("");

    const router = useRouter();

    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                router.push("/login");
            },
        });
    }

    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const userProfile = {
            _id: user._id,
            displayName: user.displayName,
            profilePicture: user.profilePicture,
        };

        const res = await POST_API("/profile", userProfile, "PATCH", token);
        const data = await res.json();
        if (res.ok) {
            setOpen(false);
            setConfirmLoading(false);
        } else {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: data.message,
                icon: "error",
            });
            setConfirmLoading(false);
        }
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const form = document.querySelector(".profileData");
        if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSendMail = async () => {
        const req = await GET_API("/profile/sendmail", token);
        if (req.ok) {
            Swal.fire({
                title: "Đã gửi mail xác thực",
                text: "Vui lòng kiểm tra email của bạn",
                icon: "success",
                willClose: () => {
                    setOpenProfile(true);
                },
            });
        } else {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: "Vui lòng thử lại sau",
                icon: "error",
            });
        }
    };

    const handleOkProfile = async () => {
        setConfirmLoading(true);
        const req = await POST_API("/profile/checkotp", { otp: valueOtp }, "POST", token);
        const data = await req.json();
        if (req.ok) {
            Swal.fire({
                title: "Xác thực thành công",
                text: data.message,
                icon: "success",
                willClose: () => {
                    setConfirmLoading(false);
                    setOpenProfile(false);
                    setProfile({ ...profileData, verify: true });
                },
            });
        } else {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: data.message,
                icon: "error",
            });
            setConfirmLoading(false);
        }
    };

    const handleCancelProfile = () => {
        setOpenProfile(false);
    };
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
    };

    const [openTopic, setOpenTopic] = useState(false);

    const handleOpenTopic = (newOpen, id) => {
        setOpenTopic(newOpen ? id : false);
    };

    const removeDoc = async (id) => {
        const res = await POST_API(`/quiz`, { _id: id }, "DELETE", token);
        const data = await res.json();
        if (res.ok) {
            setQuiz(quiz.filter((item) => item._id !== id));
        } else {
            Swal.fire({
                title: "Có lỗi xảy ra",
                text: data.message,
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

    const onChange = (text) => {
        setValueOtp(text);
    };
    const sharedProps = {
        onChange,
    };

    return (
        <div>
            <div className="flex gap-3 items-center">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden relative">
                    <Image src={user?.profilePicture} alt="" className="object-cover h-full w-full absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <div className="">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-bold text-gray-700">{user?.displayName}</h1>
                        {user?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                    </div>
                    {user?.verify ? (
                        <p>{user?.email}</p>
                    ) : (
                        <>
                            <p>Tài khoản chưa xác thực email</p>
                            <button className="text-red-700 bg-red-200 mt-2" onClick={handleSendMail}>
                                Mã xác thực
                            </button>
                            <Modal title="Nhập mã xác thực" open={openProfile} onOk={() => handleOkProfile()} confirmLoading={confirmLoading} onCancel={handleCancelProfile}>
                                <p>Chúng tôi đã gửi lại mã xác thực đến email của bạn</p>
                                <p>Nhập mã xác thực ở đây</p>
                                <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
                            </Modal>
                        </>
                    )}
                </div>
            </div>
            <Button className="flex items-center gap-2 bg-yellow-200 mt-3" onClick={showModal}>
                <IoMdSettings /> Cập nhật
            </Button>
            <Modal title="Cập nhật thêm thông tin tài khoản của bạn" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
                <form action="" className="profileData" onSubmit={(e) => handleUpdateProfile(e)}>
                    <div className="flex mb-3 gap-5">
                        <div className="flex-1">
                            <label htmlFor="displayName" className="block">
                                Tên của bạn
                            </label>
                            <Input onChange={(e) => handleInputChange(e)} type="text" id="displayName" name="displayName" placeholder="Nhập tên của bạn" value={user?.displayName} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="email" className="block">
                                Email
                            </label>
                            <Input type="text" id="email" name="email" placeholder="Nhập Email" value={user?.email} disabled />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="block">
                            Ảnh đại diện
                        </label>
                        <Input onChange={(e) => handleInputChange(e)} type="text" id="profilePicture" name="profilePicture" placeholder="dán URL ảnh vào đây" value={user?.profilePicture} />
                        <div className="flex items-center justify-center mt-2">
                            <div className="w-[75px] h-[75px] rounded-full overflow-hidden relative ">
                                <Image src={user?.profilePicture} alt="" className="object-cover w-full h-full absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            </div>
                        </div>
                    </div>
                </form>
                <Link href="/change-password">
                    <Button>Bấm vào để tới trang cập nhật mật khẩu</Button>
                </Link>
            </Modal>

            <hr className="my-5" />
            <div className="">
                <h1 className="text-lg font-bold text-green-500">Bài đăng của bạn</h1>
                {!loading && (
                    <div className="h-[400px] flex items-center justify-center w-full">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                )}
                {loading && quiz?.length === 0 && (
                    <div>
                        <p>Bạn chưa đăng bài nào</p>
                        <Link href="/post">
                            <button className="bg-green-500 text-white mt-2">Tạo bài trắc nghiệm mới thôi</button>
                        </Link>
                    </div>
                )}
                <div className="bg-white p-5 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading &&
                        quiz?.map((item) => (
                            <div key={item.id} className="relative">
                                <div className="shadow-md border-2 rounded-lg overflow-hidden group ">
                                    <div className="relative h-[150px]">
                                        <Image src={item?.img} alt="" className="h-full w-full object-cover absolute" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                <Image
                                                    src={user?.profilePicture}
                                                    alt=""
                                                    className="object-cover h-full w-full absolute"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="">
                                                <div className="flex items-center gap-1">
                                                    <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{user.displayName}</h2>
                                                    {user?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                </div>
                                                <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                    <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                        <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                        <Link href={`/quiz/${item._id}`} className="text-right">
                                            {item.status ? <Button className="bg-green-600 text-white">Làm bài ngay</Button> : <Button className="bg-gray-200 text-black">Xem lại bài</Button>}
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 z-50">
                                    <Popover
                                        placement="bottom"
                                        content={
                                            <div className="w-[150px]">
                                                <Link href={`/edit/${item.slug}`} className="flex items-center  gap-2 hover:bg-gray-200 px-3 py-2">
                                                    <MdModeEdit /> Sửa
                                                </Link>
                                                <Button onClick={() => handleRemove(item._id)} className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2  border-none">
                                                    <FaTrash /> Xoá
                                                </Button>
                                            </div>
                                        }
                                        trigger="click"
                                        open={openTopic === item._id}
                                        onOpenChange={(newOpen) => handleOpenTopic(newOpen, item._id)}>
                                        <Button>
                                            <HiDotsHorizontal />
                                        </Button>
                                    </Popover>
                                </div>
                                {!item.status ? (
                                    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-80">
                                        <div className="bg-gray-100 text-center text-red-700 text-2xl font-bold h-full flex items-center justify-center flex-col">
                                            <p>Đang kiểm duyệt</p>
                                            <Link href={`/quiz/${item.slug}`} className="text-right">
                                                <Button className="mt-3 text-red-700 font-bold flex gap-1 items-center">
                                                    {" "}
                                                    <FaEye />
                                                    Xem lại bài
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
