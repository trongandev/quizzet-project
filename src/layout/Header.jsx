import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { Button, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLogin(false);
                window.location.href = "/";
            })
            .catch((error) => {
                Swal.fire({
                    title: "Gặp lỗi trong quá trình đăng xuất",
                    text: "Mã lỗi\n" + error.code + "\n" + error.message,
                    icon: "error",
                });
            });
    };

    const handleCheckLogin = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                setIsLogin(true);
                setUser(user);
            }
        });
    };

    useEffect(() => {
        handleCheckLogin();
    }, []);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    return (
        <header className="bg-orange-500 px-10 text-white">
            <div className="flex items-center justify-between">
                <a href="/">
                    <h1 className="text-2xl font-bold">QuizzEt</h1>
                </a>
                <ul className="flex">
                    <li>
                        <NavLink to="/" className="block px-5 py-3">
                            Trang chủ
                        </NavLink>
                    </li>
                    {isLogin && (
                        <>
                            <li>
                                <NavLink to="/topic" className="block px-5 py-3 ">
                                    Chủ đề
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/answer" className="block px-5 py-3 ">
                                    Đáp án
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                {!isLogin ? (
                    <div className="">
                        <a href="/login">
                            <button className="bg-green-500">Đăng nhập</button>
                        </a>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1">
                            <Popover
                                content={
                                    <>
                                        <Link to={`/profile/${user.uid}`} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <UserOutlined />
                                            <p>Quản lí tài khoản</p>
                                        </Link>
                                        <div onClick={handleLogout} className="flex gap-2 items-center p-2 hover:bg-gray-100 hover:text-red-500 cursor-pointer">
                                            <FiLogOut />
                                            Đăng xuất
                                        </div>
                                    </>
                                }
                                title={user.email}
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>
                                {user.photoURL ? (
                                    <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                                        <img src={user.photoURL} alt="" className="object-cover" />
                                    </div>
                                ) : (
                                    <Avatar size={35} icon={<UserOutlined />} />
                                )}
                            </Popover>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
