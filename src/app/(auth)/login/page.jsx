"use client";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { BiHome } from "react-icons/bi";
export default function LoginForm() {
    const router = useRouter();
    const token = Cookies.get("token");
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        if (token) {
            router.push("/");
        }
    });

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
            setLoading(true);
            fetchLogin(values);
        },
    });

    const fetchLogin = async (values) => {
        try {
            const res = await POST_API("/auth/login", values, "POST", token);
            const data = await res.json();
            if (res.ok) {
                Cookies.set("token", data.token, { expires: 1 });
                // router.push("/");
            } else {
                Swal.fire({
                    title: "Thất bại",
                    text: data.message,
                    icon: "error",
                });
            }
            setLoading(false);
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: error.message,
                icon: "error",
            });
        }
    };

    // const googleLogin = useGoogleLogin({
    //     onSuccess: async ({ code }) => {
    //         const tokens = await axios.post("http://localhost:5000/api/auth/google", {
    //             code,
    //         });
    //         console.log(tokens);
    //     },
    //     flow: "auth-code",
    // });

    return (
        <div className="flex justify-center flex-col items-center h-full">
            <div className="w-full mt-10 md:mt-0 md:w-[500px] border-[1px] border-green-500 px-3 md:px-10 py-5 rounded-lg shadow-lg bg-white">
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex items-center mb-5">
                        <Link href="/">
                            <BiHome size={25} />
                        </Link>
                        <h1 className="text-2xl font-bold text-green-500 text-center w-full">Đăng nhập</h1>
                    </div>
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
                        <button type="submit" className="bg-green-500 text-white  w-full flex gap-5 items-center justify-center" disabled={loading}>
                            {loading && <Spin indicator={<LoadingOutlined spin />} size="default" />}
                            Đăng nhập
                        </button>
                    </div>
                    <div className="mt-5">
                        <p>
                            Bạn chưa có tài khoản ư?{" "}
                            <Link href="/register" className="text-green-500">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                    <Link href="/forget" className="block mt-3 text-right text-sm text-gray-500 hover:text-blue-600 hover:cursor-pointer hover:underline">
                        Quên mật khẩu?
                    </Link>
                </form>
                <div className="mt-5 text-gray-500 ">
                    <p className="">Hoặc bạn có thể</p>
                    {/* onClick={() => googleLogin()} */}
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg mb-3 text-orange-700 font-bold mt-2">
                        <FcGoogle size={30} /> Đăng nhập bằng Google
                    </button>
                </div>
            </div>
        </div>
    );
}
