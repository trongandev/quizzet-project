import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateRandomToken } from "../../helpers/cookie";
import { get, post } from "../../utils/request";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
export default function Register() {
    const navigate = useNavigate();
    const [capVal, setCapVal] = useState(null);

    const handleCheckLogin = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    };

    useEffect(() => {
        handleCheckLogin();
    }, []);

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string().required("Vui lòng nhập password"),
            rePassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: (values) => {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    Swal.fire({
                        title: "Đăng ký thành công",
                        icon: "success",
                        timer: 1000,
                        didClose: () => {
                            navigate("/login");
                        },
                    });
                })
                .catch((error) => {
                    if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                        Swal.fire({
                            title: "Email đã được đăng kí",
                            icon: "error",
                        });
                    }
                });
        },
    });

    const auth = getAuth();

    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/");
            })
            .catch((error) => {
                Swal.fire({
                    title: "Đăng nhập thất bại",
                    text: "Vui lòng thử lại sau",
                    icon: "info",
                });
            });
    };

    const handleLoginWithFacebook = async () => {
        const provider = new FacebookAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/");
            })
            .catch((error) => {
                Swal.fire({
                    title: "Đăng nhập thất bại",
                    text: "Vui lòng thử lại sau",
                    icon: "info",
                });
            });
    };

    function onSubmit(token) {
        document.getElementById("demo-form").submit();
    }

    return (
        <div className="flex justify-center flex-col items-center ">
            <div className="w-full mt-10 md:mt-0 md:w-[500px] border-[1px] border-green-500 px-3 md:px-10 py-5 rounded-lg shadow-lg bg-white">
                <form onSubmit={formik.handleSubmit} action="" className="">
                    <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Đăng ký tài khoản mới</h1>

                    <div className="mb-3">
                        <label htmlFor="email" className="block">
                            Nhập email
                        </label>
                        <input type="email" placeholder="Nhập email của bạn..." name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                    </div>
                    <div className="mb-3">
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
                    </div>
                    <div className="mb-3">
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
                    <ReCAPTCHA sitekey="6LdxGvopAAAAALOqa3Ytk-IGNlYlfeOx6N1XHV8M" onChange={(val) => setCapVal(val)} />
                    <div className="mb-3 text-right">
                        <button type="submit" className="bg-green-500 text-white w-full mt-3" disabled={!capVal}>
                            Đăng ký ngay
                        </button>
                    </div>
                    <div className="mt-5">
                        <p>
                            Bạn đã có tài khoản rồi à?{" "}
                            <Link to="/login" className="text-green-500">
                                Đăng nhập thôi
                            </Link>
                        </p>
                    </div>
                </form>
                <div className="mt-5 text-gray-500">
                    <p className="">Hoặc bạn có thể</p>
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg mb-3 text-orange-700 font-bold mt-2" onClick={handleLoginWithGoogle}>
                        <FcGoogle size={30} /> Đăng ký bằng Google
                    </button>
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg text-blue-700 font-bold" onClick={handleLoginWithFacebook}>
                        <FaFacebook size={30} color="#1e40af" /> Đăng ký bằng Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}
