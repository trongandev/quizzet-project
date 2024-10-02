import React from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { post_api } from "../../services/fetchapi";
import Cookies from "js-cookie";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string().required("Vui lòng nhập password"),
        }),
        onSubmit: (values) => {
            fetchLogin(values);
        },
    });

    const fetchLogin = async (values) => {
        try {
            const res = await post_api("/auth/login", values, "POST");
            const data = await res.json();
            if (res.ok) {
                Cookies.set("token", data.token, { expires: 120 });
                navigate("/");
            } else {
                Swal.fire({
                    title: "Thất bại",
                    text: data.message,
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: error.message,
                icon: "error",
            });
        }
    };

    const googleLogin = useGoogleLogin({
        // onSuccess: async ({ code }) => {
        //     const tokens = await axios.post("http://localhost:5000/api/auth/google", {
        //         code,
        //     });
        //     console.log(tokens);
        // },
        // flow: "auth-code",
    });

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="w-full mt-10 md:mt-0 md:w-[500px] border-[1px] border-green-500 px-3 md:px-10 py-5 rounded-lg shadow-lg bg-white">
                <form onSubmit={formik.handleSubmit}>
                    <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Đăng nhập</h1>
                    <div className="mb-3">
                        <label htmlFor="email" className="block">
                            Nhập email
                        </label>
                        <input type="email" placeholder="Nhập email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}{" "}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="block">
                            Nhập password
                        </label>
                        <input
                            type="password"
                            placeholder="Nhập password của bạn..."
                            name="password"
                            id="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}{" "}
                    </div>
                    <div className="mb-5">
                        <button type="submit" className="bg-green-500 text-white  w-full">
                            Đăng nhập
                        </button>
                    </div>
                    <div className="mt-5">
                        <p>
                            Bạn chưa có tài khoản ư?{" "}
                            <Link to="/register" className="text-green-500">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                    <Link to="/forget" className="block mt-3 text-right text-sm text-gray-500 hover:text-blue-600 hover:cursor-pointer hover:underline">
                        Quên mật khẩu?
                    </Link>
                </form>
                <div className="mt-5 text-gray-500 ">
                    <p className="">Hoặc bạn có thể</p>
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg mb-3 text-orange-700 font-bold mt-2" onClick={() => googleLogin()}>
                        <FcGoogle size={30} /> Đăng nhập bằng Google
                    </button>
                </div>
            </div>
        </div>
    );
}
