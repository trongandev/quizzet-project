import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_firebase } from "../../utils/request";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";

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
                        navigator("/");
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
    return (
        <div>
            <div className="flex gap-3 items-center">
                {profile.photoURL ? (
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden ">
                        <img src={profile.photoURL} alt="" className="object-cover w-full" />
                    </div>
                ) : (
                    <Avatar size={100} icon={<UserOutlined />} />
                )}
                <div className="">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-bold text-gray-700">{profile.displayName || profile.email}</h1>
                        {profile.emailVerified ? <MdOutlineVerified color="#3b82f6" /> : ""}
                    </div>
                    {profile.emailVerified ? (
                        ""
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
            <hr className="my-5" />
            <div className="">
                <h1 className="text-lg font-bold text-green-500">Bài đăng của bạn</h1>
            </div>
        </div>
    );
}
