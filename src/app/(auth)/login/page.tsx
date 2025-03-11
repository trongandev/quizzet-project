"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { message, Spin } from "antd";
import { GoogleCircleFilled, GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
export default function LoginForm() {
    const router = useRouter();
    const token = Cookies.get("token") || "";
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const fetchProfile = async () => {
        try {
            const res = await GET_API("/profile", token);
            if (!res.ok) {
                Cookies.remove("token");
            }
        } catch (error) {
            Cookies.remove("token");
        }
    };
    useEffect(() => {
        if (token) {
            fetchProfile();
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

    const fetchLogin = async (values: any) => {
        try {
            const res = await POST_API("/auth/login", values, "POST", token);
            if (res) {
                const data = await res.json();
                if (res.ok) {
                    Cookies.set("token", data.token, { expires: 30 });
                    router.push("/");
                } else {
                    messageApi.open({
                        type: "warning",
                        content: data.message,
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            messageApi.open({
                type: "error",
                content: (error as Error).message,
            });
        }
    };

    const handleBackRouter = () => {
        router.back();
    };

    const handleLoginGoogle = async () => {
        window.location.href = process.env.API_ENDPOINT + "/auth/google";
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            Cookies.set("token", token, { expires: 30 });
            const fetchAPI = async () => {
                await GET_API("/profile", token);
            };
            fetchAPI();

            router.push("/");
        }
    }, []);

    return (
        <div className="flex justify-center flex-col items-center h-full bg-white p-5 rounded-xl">
            {contextHolder}
            <div className="text-third">
                <form onSubmit={formik.handleSubmit}>
                    <div onClick={handleBackRouter}>
                        <IoIosArrowBack size={25} />
                    </div>
                    <Image unoptimized alt="" width={150} height={150} src="/logo.png"></Image>

                    <h1 className="text-2xl font-bold text-primary">Đăng nhập</h1>
                    <p>Đăng nhập để trải nghiệm Quizzet tốt hơn nhé</p>

                    <div className="mb-1 mt-5">
                        <input type="email" placeholder="Email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}{" "}
                    </div>
                    <div className="mb-5">
                        <input
                            type="password"
                            placeholder="Mật khẩu của bạn..."
                            name="password"
                            id="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.password}</div> : null}{" "}
                    </div>
                    <div className="mb-5">
                        <button type="submit" className="btn btn-primary w-full flex gap-5 items-center justify-center" disabled={loading}>
                            {loading && <Spin className="text-white" indicator={<LoadingOutlined spin />} size="default" />}
                            Đăng nhập
                        </button>
                    </div>
                    <div className="mt-5 flex justify-between items-center text-sm">
                        <p>
                            <Link href="/register" className="underline text-primary">
                                Đăng ký
                            </Link>
                        </p>
                        <Link href="/forget" className="underline text-primary">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </form>
                <div className="my-5">
                    <div className="relative mb-3">
                        <div className="absolute w-full h-[1px] bg-gray-300"></div>
                        <div className="absolute w-full flex items-center justify-center bottom-[-9px]">
                            <p className=" bg-white px-2 text-gray-500 text-sm">Hoặc</p>
                        </div>
                    </div>
                    {/* onClick={() => googleLogin()} */}
                </div>
                <div className="mt-10 pt-3">
                    <button
                        className="flex items-center gap-2 w-full border border-gray-300 text-gray-500 rounded-full overflow-hidden px-5 py-2  hover:bg-gray-100 duration-200 hover:text-gray-800"
                        onClick={handleLoginGoogle}>
                        <GoogleOutlined size={40} />
                        <p className="text-sm">Đăng nhập bằng Google</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
