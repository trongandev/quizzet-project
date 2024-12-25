"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
export default function Forget() {
    const router = useRouter();
    const token = Cookies.get("token");
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        }),
        onSubmit: (values) => {
            fetchForget(values.email);
            setLoading(true);
        },
    });

    const fetchForget = async (email) => {
        const req = await POST_API("/auth/forget", { email: email }, "POST", token);
        const data = await req.json();
        if (req.ok) {
            messageApi.open({
                type: "success",
                content: data.message,
                duration: 3000,
            });
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } else {
            messageApi.open({
                type: "error",
                content: data.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center flex-col items-center h-full bg-white p-5 rounded-xl">
            {contextHolder}

            <div className="text-third  w-[400px]">
                <form onSubmit={formik.handleSubmit}>
                    <Link href="/">
                        <IoIosArrowBack size={25} />
                    </Link>
                    <Image unoptimized alt="" width={150} height={150} src="/logo.png"></Image>

                    <h1 className="text-2xl font-bold text-primary">Quên mật khẩu</h1>

                    <div className="my-3">
                        <label htmlFor="email" className="block">
                            Nhập email đã đăng ký của bạn
                        </label>
                        <input type="email" placeholder="Nhập email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}
                    </div>
                    <div className="mb-5">
                        <button type="submit" className="btn btn-primary w-full flex gap-5 items-center justify-center" disabled={loading}>
                            {loading && <Spin className="text-white" indicator={<LoadingOutlined spin />} size="default" />}
                            Gửi yêu cầu mật khẩu mới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
