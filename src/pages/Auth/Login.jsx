import React, { useEffect } from "react";
import { get } from "../../utils/request";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { generateRandomToken, setCookie } from "../../helpers/cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { format } from "date-fns";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const addUserToFirebase = async (profile) => {
        const now = Date.now();

        const q = query(collection(db, "users"), where("uid", "==", profile.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // UID đã tồn tại, không thêm người dùng mới
            console.log("User already exists.");
            return;
        }

        await addDoc(collection(db, "users"), {
            displayName: profile.displayName || "",
            uid: profile.uid,
            email: profile.email,
            emailVerified: profile.emailVerified,
            photoURL: profile.photoURL || "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg",
            create_at: format(now, "HH:mm:ss dd/MM/yyyy"),
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        var email = e.target.email.value;
        var password = e.target.password.value;

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                Swal.fire({
                    title: "Đăng nhập thành công",
                    icon: "success",
                    didClose: () => {
                        navigate("/");
                    },
                });
                // ...
            })
            .catch((error) => {
                Swal.fire({
                    title: "Tài khoản hoặc mật khẩu không đúng",
                    icon: "error",
                });
            });
    };

    const provider = new GoogleAuthProvider();

    const handleLoginWithGoogle = async () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                addUserToFirebase(result.user);
                Swal.fire({
                    title: "Đăng nhập thành công",
                    text: "Bạn sẽ tự chuyển hướng sau 1s",
                    icon: "info",
                    timer: 100,
                    didClose: () => {
                        navigate("/");
                    },
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: "Đăng nhập thất bại, vui lòng thử lại sau",
                    icon: "error",
                });
            });
    };

    const handleLoginWithFacebook = async () => {
        Swal.fire({
            title: "Chức năng đang phát triển",
            icon: "info",
            timer: 900,
        });
    };

    function getASecureRandomPassword() {
        return generateRandomToken(24);
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="w-full mt-10 md:mt-0 md:w-[500px] border-[1px] border-green-500 px-3 md:px-10 py-5 rounded-lg shadow-lg bg-white">
                <form action="" onSubmit={handleLogin} className="">
                    <h1 className="text-2xl font-bold text-green-500 text-center mb-5">Đăng nhập</h1>
                    <div className="mb-3">
                        <label htmlFor="email" className="block">
                            Nhập email
                        </label>
                        <input type="text" placeholder="Nhập email của bạn..." name="email" id="email" />
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
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg mb-3 text-orange-700 font-bold mt-2" onClick={handleLoginWithGoogle}>
                        <FcGoogle size={30} /> Đăng nhập bằng Google
                    </button>
                    <button className="flex w-full gap-2 items-center border-2 rounded-lg text-blue-700 font-bold" onClick={handleLoginWithFacebook}>
                        <FaFacebook size={30} color="#1e40af" /> Đăng nhập bằng Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}
