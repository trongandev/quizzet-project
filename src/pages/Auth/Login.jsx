import React, { useEffect } from "react";
import { get } from "../../utils/request";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../helpers/cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        var username = e.target.username.value;
        var password = e.target.password.value;
        const response = await get(`users?username=${username}&password=${password}`);
        if (response.length === 0) {
            Swal.fire({
                title: "Tài khoản hoặc mật khẩu không đúng",
                icon: "error",
                timer: 900,
            });
            return;
        } else {
            setCookie("id", response[0].id, 1);
            setCookie("email", response[0].email, 1);
            setCookie("username", response[0].username, 1);
            setCookie("token", response[0].token, 1);
            Swal.fire({
                title: "Đăng nhập thành công",
                text: "Bạn sẽ tự chuyển hướng sau 1s",
                icon: "success",
                timer: 1000,
                didClose: () => {
                    navigate("/");
                },
            });
            dispatch(checkLogin(true));
        }
    };
    return (
        <div className="flex justify-center flex-col items-center">
            <form action="" onSubmit={handleLogin} className=" w-[500px] border-[1px] border-green-500 px-10 py-5 rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Đăng nhập</h1>
                <div className="mb-3">
                    <label htmlFor="username" className="block">
                        Nhập username
                    </label>
                    <input type="text" placeholder="Nhập username của bạn..." name="username" id="username" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="block">
                        Nhập password
                    </label>
                    <input type="password" placeholder="Nhập password của bạn..." name="password" id="password" />
                </div>
                <div className="mb-5">
                    <button type="submit" className="bg-green-500 text-white  w-full">
                        Đăng nhập
                    </button>
                </div>
                <div className="mt-5">
                    <p>
                        Bạn chưa có tài khoản ư?{" "}
                        <a href="/register" className="text-green-500">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}
