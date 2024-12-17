"use client";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
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
            Cookies.set("token", token, { expires: 1 });
            const fetchAPI = async () => {
                const req = await GET_API("/profile", token);
                console.log(req);
            };
            fetchAPI();

            router.push("/");
        }
    }, []);

    return (
        <div className="flex justify-center flex-col items-center h-full bg-white p-5 rounded-xl">
            <div className="text-third">
                <form onSubmit={formik.handleSubmit}>
                    <div onClick={handleBackRouter}>
                        <IoIosArrowBack size={25} />
                    </div>
                    <Image alt="" width={150} height={150} src="/logo.png"></Image>

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
                        <button type="submit" className=" w-full flex gap-5 items-center justify-center" disabled={loading}>
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
                        <div className="absolute w-full h-[1px] bg-gray-500"></div>
                        <div className="absolute w-full flex items-center justify-center bottom-[-12px]">
                            <p className=" bg-white px-2 ">Hoặc tiếp tục với</p>
                        </div>
                    </div>
                    {/* onClick={() => googleLogin()} */}
                </div>
                <div className="mt-10 pt-3">
                    <div className="flex border-2 border-primary rounded-full overflow-hidden h-[60px]">
                        <button className="bg-white flex-1 flex justify-center py-3 hover:bg-gray-200 rounded-l-full  ">
                            <Image
                                alt=""
                                width={35}
                                height={35}
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/480px-Facebook_Logo_%282019%29.png"></Image>
                        </button>
                        <div className="w-[1px] h-full bg-primary"></div>
                        <button className="bg-white flex-1 flex justify-center py-3 hover:bg-gray-200 rounded-r-full" onClick={handleLoginGoogle}>
                            <Image alt="" width={35} height={35} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"></Image>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
