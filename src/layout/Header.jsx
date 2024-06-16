import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { Button, Popover, Alert, Space, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const auth = getAuth();

    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLogin(false);
                navigate("/");
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

    const handleOpenNoti = (newOpen) => {
        setOpenNoti(newOpen);
    };
    return (
        <header className="bg-orange-500 px-2 md:px-5 lg:px-10 text-white w-full">
            <div className="flex items-center justify-between px-5 py-1 md:px-0 md:py-0">
                <Link to="/">
                    <h1 className="text-3xl bebas-neue-regular ">Quizzet</h1>
                </Link>
                <ul className="hidden md:flex">
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
                                <NavLink to="/history" className="block px-5 py-3 ">
                                    Lịch sử
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
                        <div className="flex gap-3 items-center">
                            <Popover
                                content={
                                    <Space
                                        direction="vertical"
                                        style={{
                                            width: "100%",
                                        }}>
                                        <Alert message="Tạo tài khoản thành công" type="success" showIcon />
                                    </Space>
                                }
                                trigger="click"
                                open={openNoti}
                                onOpenChange={handleOpenNoti}
                                title="Thông báo">
                                <Badge count={1} offset={[-5, 5]} size="small" className="text-white">
                                    <IoMdNotificationsOutline size={30} />
                                </Badge>
                            </Popover>
                            <Popover
                                content={
                                    <>
                                        <Link to={`/profile`} className="flex items-center gap-2 p-2 hover:bg-gray-100">
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
                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                        <img src={user.photoURL} alt="" className="object-cover h-full" />
                                    </div>
                                ) : (
                                    <Avatar className="w-[40px] h-[40px] md:w-[35px] md:h-[35px]" icon={<UserOutlined />} />
                                )}
                            </Popover>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
