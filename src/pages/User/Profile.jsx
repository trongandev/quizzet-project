import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { Tooltip, Modal, Avatar, Input, Skeleton, Popover, Button } from "antd";
import { IoMdSettings } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiTimer } from "react-icons/ci";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { get_api, post_api } from "../../services/fetchapi";
import Cookies from "js-cookie";
import { setNewUser } from "../../reducers/userSlice";
import { jwtDecode } from "jwt-decode";
import handleCompareDate from "../../utils/compareData";
export default function Profile() {
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);
    const [valueOtp, setValueOtp] = useState("");

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const token = Cookies.get("token");
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                navigate("/login");
            },
        });
    }
    useEffect(() => {
        const fetchAPI = async (id) => {
            const response = await get_api("/profile");
            dispatch(setNewUser(response.user));
            setProfile(response.user);
            setQuiz(response.quiz);
        };

        if (token !== undefined) {
            const decoded = jwtDecode(token);
            fetchAPI(decoded.user.id);
        }
    }, []);

    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const userProfile = {
            _id: profile._id,
            displayName: profile.displayName,
            profilePicture: profile.profilePicture,
        };

        const res = await post_api("/profile", userProfile, "PATCH");
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
        const form = document.querySelector(".profile");
        if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSendMail = async () => {
        console.log("send mail");
        const req = await get_api("/profile/sendmail");
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
        const req = await post_api("/profile/checkotp", { otp: valueOtp }, "POST");
        const data = await req.json();
        if (req.ok) {
            Swal.fire({
                title: "Xác thực thành công",
                text: data.message,
                icon: "success",
                willClose: () => {
                    setConfirmLoading(false);
                    setOpenProfile(false);
                    setProfile({ ...profile, verify: true });
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
    const showModalProfile = () => {
        setOpenProfile(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProfile({ ...profile, [id]: value });
        console.log(profile);
    };

    const [openTopic, setOpenTopic] = useState(false);

    const hideTopic = () => {
        setOpenTopic(false);
    };
    const handleOpenTopic = (newOpen, id) => {
        setOpenTopic(newOpen ? id : false);
    };

    const removeDoc = async (id) => {
        const res = await post_api(`/quiz`, { _id: id }, "DELETE");
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
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden ">
                    <img src={profile?.profilePicture} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-bold text-gray-700">{profile?.displayName}</h1>
                        {profile?.verify ? (
                            <Tooltip title="Tài khoản đã được xác thực">
                                <MdOutlineVerified color="#3b82f6" />
                            </Tooltip>
                        ) : (
                            ""
                        )}
                    </div>
                    {profile?.verify ? (
                        <p>{profile?.email}</p>
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
                <form action="" className="profile" onSubmit={(e) => handleUpdateProfile(e)}>
                    <div className="flex mb-3 gap-5">
                        <div className="flex-1">
                            <label htmlFor="displayName" className="block">
                                Tên của bạn
                            </label>
                            <Input onChange={(e) => handleInputChange(e)} type="text" id="displayName" name="displayName" placeholder="Nhập tên của bạn" value={profile.displayName} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="email" className="block">
                                Email
                            </label>
                            <Input type="text" id="email" name="email" placeholder="Nhập Email" value={profile.email} disabled />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="block">
                            Ảnh đại diện
                        </label>
                        <Input onChange={(e) => handleInputChange(e)} type="text" id="profilePicture" name="profilePicture" placeholder="dán URL ảnh vào đây" value={profile.profilePicture} />
                        <div className="flex items-center justify-center mt-2">
                            <div className="w-[75px] h-[75px] rounded-full overflow-hidden ">
                                <img src={profile.profilePicture} alt="" className="object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>
                </form>
                <Link to="/change-password">
                    <Button>Bấm vào để tới trang cập nhật mật khẩu</Button>
                </Link>
            </Modal>

            <hr className="my-5" />
            <div className="">
                <h1 className="text-lg font-bold text-green-500">Bài đăng của bạn</h1>
                <div className="bg-white p-5 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {quiz && quiz?.length === 0 ? (
                        <div>
                            <p>Bạn chưa đăng bài nào</p>
                            <NavLink to="/post">
                                <button className="bg-green-500 text-white mt-2">Tạo bài trắc nghiệm mới thôi</button>
                            </NavLink>
                        </div>
                    ) : (
                        ""
                    )}
                    {quiz &&
                        quiz?.map((item) => (
                            <div key={item.id} className="relative">
                                <div className="shadow-md border-2 rounded-lg overflow-hidden group ">
                                    <img src={item.img} alt="" className="h-[150px] w-full object-cover" />
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                <img src={profile.profilePicture} alt="" className="object-cover h-full w-full" />
                                            </div>
                                            <div className="">
                                                <div className="flex items-center gap-1">
                                                    <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{profile.displayName}</h2>
                                                    {profile?.verify ? (
                                                        <Tooltip title="Tài khoản đã được xác thực">
                                                            <MdOutlineVerified color="#3b82f6" />
                                                        </Tooltip>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                    <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                        <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                        <NavLink to={`/quiz/${item._id}`} className="text-right">
                                            {item.status ? <Button className="bg-green-600 text-white">Làm bài ngay</Button> : <Button className="bg-gray-200 text-black">Xem lại bài</Button>}
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 z-50">
                                    <Popover
                                        placement="bottom"
                                        content={
                                            <div className="w-[150px]">
                                                <Link to={`/edit/${item.slug}`} className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2">
                                                    <MdModeEdit /> Sửa
                                                </Link>
                                                <Button onClick={() => handleRemove(item._id)} className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2 w-full border-none">
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
                                            <NavLink to={`/quiz/${item.slug}`} className="text-right">
                                                <Button className="mt-3 text-red-700 font-bold flex gap-1 items-center">
                                                    {" "}
                                                    <FaEye />
                                                    Xem lại bài
                                                </Button>
                                            </NavLink>
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
