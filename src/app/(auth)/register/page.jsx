"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import ReCAPTCHA from "react-google-recaptcha";
import { GET_API, POST_API } from "@/lib/fetchAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
export default function RegisterForm() {
    const token = Cookies.get("token");
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    // const [capVal, setCapVal] = useState(null);

    const formik = useFormik({
        initialValues: {
            displayName: "",
            email: "",
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            displayName: Yup.string().required("Vui lòng nhập họ tên của bạn"),
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string().required("Vui lòng nhập password"),
            rePassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: (values) => {
            const profile = {
                displayName: values.displayName,
                email: values.email,
                password: values.password,
            };
            setLoading(true);
            fetchRegister(profile);
        },
    });

    const fetchRegister = async (profile) => {
        const res = await POST_API("/auth/register", profile, "POST", token);
        const data = await res.json();
        if (res.ok) {
            messageApi.open({
                type: "success",
                content: data.message,
            });
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } else {
            messageApi.open({
                type: "warning",
                content: data.message,
            });
        }
        setLoading(false);
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
                await GET_API("/profile", token);
            };
            fetchAPI();

            router.push("/");
        }
    }, []);

    const handleBackRouter = () => {
        router.back();
    };
    return (
        <div className="flex justify-center flex-col items-center h-full bg-white p-5 rounded-xl">
            {contextHolder}
            <div className="text-third">
                <form onSubmit={formik.handleSubmit}>
                    <div onClick={handleBackRouter}>
                        <IoIosArrowBack size={25} />
                    </div>
                    <Image unoptimized alt="" width={150} height={150} src="/logo.png"></Image>

                    <h1 className="text-2xl font-bold text-primary">Đăng ký</h1>
                    <p>Đăng ký để trải nghiệm Quizzet tốt hơn nhé</p>
                    <div className="my-5 space-y-2">
                        <div className="">
                            <input
                                type="text"
                                placeholder="Nhập họ tên của bạn..."
                                name="displayName"
                                id="displayName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.displayName}
                            />
                            {formik.touched.displayName && formik.errors.displayName ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.displayName}</div> : null}
                        </div>
                        <div className="">
                            <input type="email" placeholder="Email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}{" "}
                        </div>
                        <div className="">
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
                        <div className="flex-1">
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu của bạn..."
                                name="rePassword"
                                id="re-password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rePassword}
                            />
                            {formik.touched.rePassword && formik.errors.rePassword ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.rePassword}</div> : null}
                        </div>
                    </div>
                    <div className="mb-5">
                        <button type="submit" className="btn btn-primary w-full flex gap-5 items-center justify-center" disabled={loading}>
                            {loading && <Spin className="text-white" indicator={<LoadingOutlined spin />} size="default" />}
                            Đăng nhập
                        </button>
                    </div>
                    <div className="my-5 text-sm">
                        <p>
                            Bạn đã có tài khoản rồi à?{" "}
                            <Link href="/login" className="underline text-primary">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </form>
                <div className="">
                    <div className="relative mb-3">
                        <div className="absolute w-full h-[1px] bg-gray-500"></div>
                        <div className="absolute w-full flex items-center justify-center bottom-[-10px]">
                            <p className=" bg-white px-2 ">Hoặc tiếp tục với</p>
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-3">
                    <div className="flex border-2 border-gray-200 rounded-full overflow-hidden h-[60px]">
                        <button className="bg-white flex-1 flex justify-center py-3 hover:bg-gray-200 rounded-l-full  ">
                            <Image
                                unoptimized
                                alt=""
                                width={35}
                                height={35}
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/480px-Facebook_Logo_%282019%29.png"></Image>
                        </button>
                        <div className="w-[1px] h-full bg-gray-200"></div>
                        <button className="bg-white flex-1 flex justify-center py-3 hover:bg-gray-200 rounded-r-full" onClick={handleLoginGoogle}>
                            <Image
                                unoptimized
                                alt=""
                                width={35}
                                height={35}
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"></Image>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
