import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateRandomToken } from "../../helpers/cookie";
import { get, post } from "../../utils/request";
import Swal from "sweetalert2";

export default function Register() {
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Vui lòng nhập username"),
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string().required("Vui lòng nhập password"),
            rePassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: (values) => {
            const randomToken = generateRandomToken(24);

            const checkUser = get(`users?username=${values.username}`);
            checkUser.then((res) => {
                if (res.length > 0) {
                    Swal.fire({
                        title: "Username đã tồn tại",
                        icon: "error",
                        timer: 900,
                    });
                    return;
                } else {
                    const response = post("users", {
                        username: values.username,
                        email: values.email,
                        password: values.password,
                        token: randomToken,
                    });

                    Swal.fire({
                        title: "Đăng ký thành công",
                        text: "Bạn sẽ tự chuyển hướng sau 1s",
                        icon: "success",
                        timer: 1000,
                        didClose: () => {
                            window.location.href = "/login";
                        },
                    });
                }
            });
        },
    });

    return (
        <div className="flex justify-center flex-col items-center">
            <form onSubmit={formik.handleSubmit} action="" className=" w-[500px] border-[1px] border-green-500 px-10 py-5 rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Đăng ký tài khoản mới</h1>
                <div className="mb-3">
                    <label htmlFor="username" className="block">
                        Nhập username
                    </label>
                    <input type="text" placeholder="Nhập username của bạn..." name="username" id="username" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                    {formik.touched.username && formik.errors.username ? <div className="text-red-500">{formik.errors.username}</div> : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="block">
                        Nhập email
                    </label>
                    <input type="email" placeholder="Nhập email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                    {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                </div>
                <div className="flex gap-3 mb-5">
                    <div className="flex-1">
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
                        {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="re-password" className="block">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu của bạn..."
                            name="rePassword"
                            id="re-password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.rePassword}
                        />
                        {formik.touched.rePassword && formik.errors.rePassword ? <div className="text-red-500">{formik.errors.rePassword}</div> : null}
                    </div>
                </div>
                <div className="mb-3 text-right">
                    <button type="submit" className="bg-green-500 text-white w-full">
                        Đăng ký ngay
                    </button>
                </div>
                <div className="mt-5">
                    <p>
                        Bạn đã có tài khoản rồi à?{" "}
                        <a href="/login" className="text-green-500">
                            Đăng nhập thôi
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}
