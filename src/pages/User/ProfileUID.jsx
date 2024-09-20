import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserOutlined } from "@ant-design/icons";
import { MdOutlineVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { Tooltip, Avatar, Button } from "antd";
import { CiTimer } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import sortArrayByTime from "../../helpers/sort";
import { FaFacebookMessenger } from "react-icons/fa6";

export default function ProfileUID() {
    const [profile, setProfile] = useState({});
    const [quiz, setQuiz] = useState([]);

    const params = useParams();

    const navigate = useNavigate();

    const auth = getAuth();

    const db = getFirestore();

    useEffect(() => {
        const handleRenderUser = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                if (data.uid === params.uid) {
                    setProfile(doc.data());
                }
            });
        };

        handleRenderUser();
    }, [auth, navigate]);

    useEffect(() => {
        if (profile) {
            const fetchQuiz = async () => {
                const querySnapshot = await getDocs(collection(db, "quiz"));
                const filteredQuiz = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.uid === profile.uid) {
                        filteredQuiz.push({
                            ...doc.data(),
                            id: doc.id,
                        });
                    }
                });

                const result = sortArrayByTime(filteredQuiz);

                setQuiz(result);
            };

            fetchQuiz();
        }
    }, [profile, db]);

    useEffect(() => {
        if (auth.currentUser.uid === params.uid) {
            navigate("/profile");
        }
    }, [params.uid]);

    const handleCreateRoomChat = async () => {
        if (!auth.currentUser) {
            Swal.fire({
                title: "Vui lòng đăng nhập để sử dụng tính năng này",
                icon: "error",
            });
            return;
        }
        const currentUser = {
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
        };

        const anotherUser = {
            uid: profile.uid,
            displayName: profile.displayName,
            photoURL: profile.photoURL,
        };

        // Tạo truy vấn để tìm phòng trò chuyện giữa hai người dùng
        const q = query(collection(db, "room"), where("anotherUser.uid", "==", anotherUser.uid));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);

        if (!querySnapshot.empty) {
            // Phòng trò chuyện đã tồn tại, điều hướng tới phòng này
            const existingRoom = querySnapshot.docs[0];
            navigate(`/chat/room/${existingRoom.id}`);
        } else {
            // Phòng trò chuyện chưa tồn tại, tạo phòng mới
            const newRoomRef = await addDoc(collection(db, "room"), {
                currentUser,
                anotherUser,
                date: serverTimestamp(),
                chat: [],
            });

            // Điều hướng tới phòng trò chuyện mới
            navigate(`/chat/room/${newRoomRef.id}`);
        }
    };

    return (
        <div>
            {profile ? (
                <>
                    <div className="flex gap-3 items-center">
                        {profile.photoURL ? (
                            <div className="w-[100px] h-[100px] rounded-full overflow-hidden ">
                                <img src={profile.photoURL} alt="" className="object-cover h-full" />
                            </div>
                        ) : (
                            <Avatar size={100} icon={<UserOutlined />} />
                        )}
                        <div className="">
                            <div className="flex gap-2 items-center">
                                <h1 className="text-2xl font-bold text-gray-700">{profile.displayName || profile.email}</h1>
                                {profile.emailVerified ? (
                                    <Tooltip title="Tài khoản đã được xác thực">
                                        <MdOutlineVerified color="#3b82f6" />
                                    </Tooltip>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    {auth.currentUser.uid === profile.uid ? (
                        ""
                    ) : (
                        <Button onClick={handleCreateRoomChat} className="w-[100px] flex gap-1 items-center mt-2">
                            <FaFacebookMessenger />
                            Nhắn tin
                        </Button>
                    )}

                    <hr className="my-5" />
                    <div className="">
                        <h1 className="text-lg font-bold text-green-500">Các bài đăng của {profile.displayName || profile.email}</h1>
                        <div className="bg-white p-5 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quiz.length === 0 ? (
                                <div>
                                    <p>Người này chưa có đăng bài nào</p>
                                </div>
                            ) : (
                                ""
                            )}
                            {quiz?.map((item) => (
                                <div key={item.id} className="relative">
                                    <div className="shadow-md border-2 rounded-lg overflow-hidden group ">
                                        <img src={item.img} alt="" className="h-[150px] w-full object-cover" />
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-3">
                                                {item.image_author ? (
                                                    <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                        <img src={item.image_author} alt="" className="object-cover h-full" />
                                                    </div>
                                                ) : (
                                                    <Avatar className="w-[40px] h-[40px] md:w-[35px] md:h-[35px]" icon={<UserOutlined />} />
                                                )}
                                                <div className="">
                                                    <div className="flex items-center gap-1">
                                                        <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden">{item.author || item.email}</h2>
                                                        {!quiz?.verify ? (
                                                            <Tooltip title="Tài khoản đã được xác thực">
                                                                <MdOutlineVerified color="#3b82f6" />
                                                            </Tooltip>
                                                        ) : (
                                                            "chưa có"
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                        <CiTimer color="#1f2937" /> {item.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <h1 className="text-lg h-[56px] font-bold text-gray-800">{item.title}</h1>
                                            <p className="text-gray-700 line-clamp-2 h-[45px] my-3 text-[15px]">{item.content}</p>
                                            <NavLink to={`/quiz/${item.id}`} className="text-right">
                                                {item.status ? <Button className="bg-green-600 text-white">Làm bài ngay</Button> : <Button className="bg-gray-200 text-black">Xem lại bài</Button>}
                                            </NavLink>
                                        </div>
                                    </div>

                                    {!item.status ? (
                                        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-80">
                                            <div className="bg-gray-100 text-center text-red-700 text-2xl font-bold h-full flex items-center justify-center flex-col">
                                                <p>Đang kiểm duyệt</p>
                                                <NavLink to={`/quiz/${item.id}`} className="text-right">
                                                    <Button className="mt-3 text-red-700 font-bold flex gap-1 items-center">
                                                        {" "}
                                                        <FaEye />
                                                        Xem lại bài
                                                    </Button>
                                                </NavLink>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h1>Người này không tồn tại</h1>
                </>
            )}
        </div>
    );
}
