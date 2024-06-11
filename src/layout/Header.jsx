import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { deleteCookie, getCookie } from "../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../actions/login";

export default function Header() {
    const dispatch = useDispatch();
    const token = getCookie("token");
    const username = getCookie("username");

    const isLogin = useSelector((state) => state.loginReducer);

    const handleLogout = () => {
        deleteCookie("token");
        deleteCookie("id");
        deleteCookie("username");
        deleteCookie("email");
        dispatch(checkLogin(false));
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
                    {token && (
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
                {!token ? (
                    <div className="">
                        <a href="/login">
                            <button className="bg-green-500">Đăng nhập</button>
                        </a>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center">
                        <a href="/profile" className="flex gap-1">
                            Xin chào <p className="text-green-200 font-bold">{username}</p>
                        </a>
                        <button onClick={handleLogout} className="bg-red-500">
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
