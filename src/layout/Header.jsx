import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Popover, Alert, Space, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMessengerLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
export default function Header() {
    const [open, setOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);

    const navigate = useNavigate();

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleOpenNoti = (newOpen) => {
        setOpenNoti(newOpen);
    };

    const token = Cookies.get("token");
    const user = useSelector((state) => state.user);

    const handleLogout = () => {
        Cookies.remove("token");
        window.location.reload();
    };

    return (
        <header className="bg-orange-500 px-2 md:px-5 lg:px-10 text-white w-full">
            <div className="flex items-center justify-between px-5 py-1 md:px-0 md:py-0">
                <Link to="/">
                    <h1 className="text-3xl bebas-neue-regular ">Quizzet</h1>
                </Link>
                <ul className="hidden md:flex">
                    <li>
                        <NavLink to="/" className="block px-5 py-3 ">
                            Trang chủ
                        </NavLink>
                    </li>
                    {token && (
                        <>
                            <li>
                                <NavLink to="/chude" className="block px-5 py-3 ">
                                    Chủ đề
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/lichsu" className="block px-5 py-3 ">
                                    Lịch sử
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li className="flex-1">
                        <NavLink to="/tailieu" className="block px-5 py-3 ">
                            Tài liệu
                        </NavLink>
                    </li>
                </ul>
                {!token ? (
                    <div className="">
                        <Link to="/login">
                            <button className="bg-green-500">Đăng nhập</button>
                        </Link>
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
                            <Badge count={1} offset={[-5, 5]} size="small" className="text-white">
                                <Link to={`/chat`}>
                                    <RiMessengerLine size={26} />
                                </Link>
                            </Badge>
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
                                title={user?.email}
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>
                                {user.profilePicture ? (
                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                        <img src={user.profilePicture} alt="" className="object-cover h-full" />
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
