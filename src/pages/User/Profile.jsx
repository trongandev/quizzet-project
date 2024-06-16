import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, sendEmailVerification, updateProfile } from "firebase/auth";
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

export default function Profile() {
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);

    const navigate = useNavigate();

    const auth = getAuth();

    const db = getFirestore();

    useEffect(() => {
        const handleCheckLogin = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log(user);
                    setProfile(user);
                } else {
                    Swal.fire({
                        title: "Bạn chưa đăng nhập",
                        text: "Bạn sẽ được chuyển hướng sau 1s",
                        icon: "error",
                        timer: 1000,
                        didClose: () => {
                            navigate("/");
                        },
                    });
                }
            });
        };

        handleCheckLogin();
    }, [auth, navigate]);

    useEffect(() => {
        if (profile) {
            const fetchQuiz = async () => {
                const querySnapshot = await getDocs(collection(db, "quiz"));
                const filteredQuiz = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(data);
                    if (data.uid === profile.uid) {
                        filteredQuiz.push({
                            id: doc.id,
                            data: data,
                        });
                    }
                });

                setQuiz(filteredQuiz);
            };

            fetchQuiz();
        }
    }, [profile, db]);

    const handleSendMail = () => {
        const user = auth.currentUser;
        sendEmailVerification(user).then(() => {
            Swal.fire({
                title: "Đã gửi mail xác thực",
                text: "Vui lòng kiểm tra email của bạn",
                icon: "success",
            });
        });
    };

    console.log(profile);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("Content of the modal");

    const showModal = () => {
        setOpen(true);
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const auth = getAuth();

        updateProfile(auth.currentUser, {
            displayName: profile.displayName,
            photoURL: profile.photoURL,
            phoneNumber: profile.phoneNumber,
        })
            .then(() => {
                setOpen(false);
                setConfirmLoading(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: "Cập nhật thất bại",
                    text: error.message,
                    icon: "error",
                });
            });
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const form = document.querySelector(".profile");
        if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
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
        try {
            await deleteDoc(doc(db, "quiz", id));
            setQuiz(quiz.filter((item) => item.id !== id));
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

    return (
        <div>
            <div className="flex gap-3 items-center">
                {profile.photoURL ? (
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden ">
                        <img src={profile.photoURL} alt="" className="object-cover h-full" />
                    </div>
                ) : (
                    <Avatar size={100} icon={<UserOutlined />} />
                )}
                <div className="">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-bold text-gray-700">{profile.displayName || profile.email}</h1>
                        {profile.emailVerified ? (
                            <Tooltip title="Tài khoản đã được xác thực">
                                <MdOutlineVerified color="#3b82f6" />
                            </Tooltip>
                        ) : (
                            ""
                        )}
                    </div>
                    {profile.emailVerified ? (
                        <p>{profile.email}</p>
                    ) : (
                        <>
                            <p>Tài khoản chưa xác thực email</p>
                            <button className="text-red-700 bg-red-200 mt-2" onClick={handleSendMail}>
                                Gửi lại mã xác thực
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Button className="flex items-center gap-2 bg-yellow-200 mt-3" onClick={showModal}>
                <IoMdSettings /> Cập nhật
            </Button>
            <Modal title="Cập nhật thêm thông tin tài khoản của bạn" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
                <form action="" onSubmit={handleUpdateProfile} className="profile">
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
                        <label htmlFor="photoURL" className="block">
                            Ảnh đại diện
                        </label>
                        <Input onChange={(e) => handleInputChange(e)} type="text" id="photoURL" name="photoURL" placeholder="dán URL ảnh vào đây" value={profile.photoURL} />
                        <div className="flex items-center justify-center mt-2">
                            {profile.photoURL ? (
                                <div className="w-[75px] h-[75px] rounded-full overflow-hidden ">
                                    <img src={profile.photoURL} alt="" className="object-cover h-full" />
                                </div>
                            ) : (
                                <Avatar size={75} icon={<UserOutlined />} />
                            )}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="block">
                            Số điện thoại
                        </label>
                        <Input onChange={(e) => handleInputChange(e)} type="number" id="phoneNumber" name="phoneNumber" placeholder="Nhập số điện thoại của bạn vào đây" value={profile.phoneNumber} />
                    </div>
                </form>
            </Modal>

            <hr className="my-5" />
            <div className="">
                <h1 className="text-lg font-bold text-green-500">Bài đăng của bạn</h1>
                <div className="bg-white p-5 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {quiz.length === 0 ? (
                        <div>
                            <p>Bạn chưa đăng bài nào</p>
                            <NavLink to="/post">
                                <button className="bg-green-500 text-white mt-2">Tạo bài trắc nghiệm mới thôi</button>
                            </NavLink>
                        </div>
                    ) : (
                        ""
                    )}
                    {quiz?.map((item) => (
                        <div key={item.id} className="relative">
                            <div className="shadow-md border-2 rounded-lg overflow-hidden group ">
                                <img src={item.data.img} alt="" className="h-[150px] w-full object-cover" />
                                <div className="p-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        {item.data.image_author ? (
                                            <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                <img src={item.data.image_author} alt="" className="object-cover h-full" />
                                            </div>
                                        ) : (
                                            <Avatar className="w-[40px] h-[40px] md:w-[35px] md:h-[35px]" icon={<UserOutlined />} />
                                        )}
                                        <div className="">
                                            <div className="flex items-center gap-1">
                                                <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{item.data.author || item.data.email}</h2>
                                                {!quiz.data?.verify ? (
                                                    <Tooltip title="Tài khoản đã được xác thực">
                                                        <MdOutlineVerified color="#3b82f6" />
                                                    </Tooltip>
                                                ) : (
                                                    "chưa có"
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                <CiTimer color="#1f2937" /> {item.data.date_post}
                                            </p>
                                        </div>
                                    </div>
                                    <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.data.title}</h1>
                                    <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.data.content}</p>
                                    <NavLink to={`/quiz/${item.id}`} className="text-right">
                                        {item.data.status ? <Button className="bg-green-600 text-white">Làm bài ngay</Button> : <Button className="bg-gray-200 text-black">Xem lại bài</Button>}
                                    </NavLink>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 z-50">
                                <Popover
                                    placement="bottom"
                                    content={
                                        <div className="w-[150px]">
                                            <Link to={`/edit/${item.id}`} className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2">
                                                <MdModeEdit /> Sửa
                                            </Link>
                                            <Button onClick={() => handleRemove(item.id)} className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2 w-full border-none">
                                                <FaTrash /> Xoá
                                            </Button>
                                        </div>
                                    }
                                    trigger="click"
                                    open={openTopic === item.id}
                                    onOpenChange={(newOpen) => handleOpenTopic(newOpen, item.id)}>
                                    <Button>
                                        <HiDotsHorizontal />
                                    </Button>
                                </Popover>
                            </div>
                            {!item.data.status ? (
                                <div className="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-80">
                                    <div className="bg-gray-100 text-center text-red-700 text-2xl font-bold h-full flex items-center justify-center flex-col">
                                        <p>Đang kiểm duyệt</p>
                                        <NavLink to={`/quiz/${item.id}`} className="text-right">
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
