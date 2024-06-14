import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

export default function Forget() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        }),
        onSubmit: (values) => {
            const auth = getAuth();
            sendPasswordResetEmail(auth, values.email)
                .then(() => {
                    Swal.fire({
                        title: "Gửi yêu cầu thành công",
                        text: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu",
                        icon: "success",
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Gặp lỗi tron quá trình đặt lại mật khẩu",
                        text: "Mã lỗi\n" + error.code + "\n" + error.message,
                        icon: "success",
                    });
                });
        },
    });

    return (
        <div className="flex justify-center flex-col items-center">
            <div className=" w-[500px] border-[1px] border-green-500 px-10 py-5 rounded-lg shadow-lg bg-white">
                <form action="" onSubmit={formik.handleSubmit} className="">
                    <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Quên mật khẩu</h1>

                    <div className="mb-3">
                        <label htmlFor="email" className="block">
                            Nhập email đã đăng ký của bạn
                        </label>
                        <input type="email" placeholder="Nhập email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                    </div>
                    <div className="mb-5">
                        <button type="submit" className="bg-green-500 text-white  w-full">
                            Gửi yêu cầu mật khẩu mới
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
                </form>
            </div>
        </div>
    );
}
