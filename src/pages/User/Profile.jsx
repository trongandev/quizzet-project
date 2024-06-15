import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { get_firebase } from "../../utils/request";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, sendEmailVerification, updateProfile } from "firebase/auth";
import { UserOutlined } from "@ant-design/icons";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { Tooltip, Button, Modal, Avatar, Input } from "antd";
import { IoMdSettings } from "react-icons/io";

export default function Profile() {
    const params = useParams();
    const [profile, setProfile] = useState({});

    const navigate = useNavigate();

    const auth = getAuth();

    const db = getFirestore();

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

    useEffect(() => {
        handleCheckLogin();
    }, []);

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

    const [quiz, setQuiz] = useState([]);

    useEffect(() => {
        const fetchBook = async () => {
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
        fetchBook();
    }, []);

    console.log(quiz);

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
            <button className="flex items-center gap-2 bg-yellow-200 mt-3" onClick={showModal}>
                <IoMdSettings /> Cập nhật
            </button>
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
                <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {quiz?.map((item) => (
                        <NavLink to={`/quiz/${item.id}`} className="relative" key={item.id}>
                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                <img src={item.data.img} alt="" className="h-[150px] w-full object-cover" />
                                <div className="p-3">
                                    <h1 className="text-lg group-hover:text-red-500 h-[28px]">{item.data.title}</h1>
                                    <p className="text-gray-500 line-clamp-2 h-[48px] my-3">{item.data.content}</p>
                                    <div className="text-right">
                                        <button className="bg-green-500 text-white">Làm bài ngay</button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0">
                                <p className="text-green-500 bg-green-200 p-[4px] rounded-lg text-[10px]">{item.data.date_post}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
