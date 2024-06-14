import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { NavLink, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTopic } from "react-icons/md";
import { RiQuestionAnswerLine } from "react-icons/ri";

export default function DefaultLayout() {
    const [isLogin, setIsLogin] = useState(false);

    const auth = getAuth();

    const handleCheckLogin = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogin(true);
            }
        });
    };

    useEffect(() => {
        handleCheckLogin();
    }, []);

    return (
        <>
            <Header />
            <div className="relative">
                <div className="p-2 md:p-5 lg:p-10 bg-gray-100 ">
                    <Outlet />
                </div>
                <div className="fixed bottom-0 bg-gray-300 text-black h-[48px] w-full block md:hidden">
                    <ul className="flex h-full">
                        <li className="flex-1">
                            <NavLink to="/" className="flex items-center gap-2 h-full justify-center">
                                <IoHomeOutline size={25} /> Trang chủ
                            </NavLink>
                        </li>
                        {isLogin && (
                            <>
                                <li className="flex-1">
                                    <NavLink to="/topic" className="flex items-center gap-2 h-full justify-center">
                                        <MdOutlineTopic size={25} /> Chủ đề
                                    </NavLink>
                                </li>
                                <li className="flex-1">
                                    <NavLink to="/answer" className="flex items-center gap-2 h-full justify-center">
                                        <RiQuestionAnswerLine size={25} /> Đáp án
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
}
