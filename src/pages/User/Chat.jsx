import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import { IoIosSettings } from "react-icons/io";
// import { UserOutlined } from "@ant-design/icons";
// import { IoIosCall } from "react-icons/io";
// import { IoVideocam } from "react-icons/io5";
// import { IoIosInformationCircle } from "react-icons/io";
// import { BiSolidSend } from "react-icons/bi";
// import { MdEmojiEmotions } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Chat(props) {
    // const [profile, setProfile] = useState(null);
    // const [user, setUser] = useState({});

    // useEffect(() => {
    //     // Lắng nghe sự thay đổi trạng thái xác thực và cập nhật profile
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setProfile(user);
    //         } else {
    //             setProfile(null);
    //         }
    //     });
    // }, []);
    // console.log(profile);

    // useEffect(() => {
    //     // Chỉ chạy khi profile đã được cập nhật
    //     const fetchUser = async () => {
    //         if (profile) {
    //             const userQuery = query(collection(db, "users"), where("uid", "!=", profile.uid));
    //             const userQuerySnapshot = await getDocs(userQuery);
    //             const userData = userQuerySnapshot.docs.map((doc) => ({
    //                 ...doc.data(),
    //                 id: doc.id,
    //             }));
    //             setUser(userData);
    //         }
    //     };
    //     fetchUser();
    // }, [profile]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="">
            <div className="flex justify-between items-center px-3 h-[44px]">
                <Link to="/chat">
                    <h1 className="text-2xl">Chats</h1>
                </Link>
                <Button className="">
                    <IoIosSettings />
                </Button>
            </div>
            {/* <div className="border-t-[1px] my-3 h-[530px] overflow-y-scroll">
                {props.user?.map((item) => (
                    <Link key={item.id} to={`/chat/room/${item.id}`} className="flex gap-2 items-center hover:bg-gray-200 p-2 hover:cursor-pointer">
                        <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative">
                            <img
                                src={auth.currentUser?.uid === item.currentUser?.uid ? item.anotherUser?.photoURL : item.currentUser?.photoURL}
                                className="w-full h-full rounded-full object-cover"
                                alt=""
                            />
                            <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                        </div>
                        <div className="">
                            <h1 className="font-bold">{auth.currentUser?.uid === item.currentUser?.uid ? item.anotherUser?.displayName : item.currentUser?.displayName}</h1>
                            <p className="text-gray-500">Chat now</p>
                        </div>
                    </Link>
                ))}
            </div> */}
            <div className="px-3 text-right">
                <Button className="" onClick={showModal}>
                    <FaCirclePlus />
                </Button>
                <Modal title="Tìm bạn bè mới" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div className="">
                        <Input placeholder="Tìm kiếm bạn bè mới của bạn..."></Input>
                    </div>
                    {/* <div className="py-3">
                        {user.map((item) => (
                            <div className="flex gap-3 items-center justify-between" key={item.uid}>
                                <label htmlFor={item.uid} className="block w-[85%]">
                                    <div className="flex gap-3 items-center ">
                                        <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] relative">
                                            <img src={item.photoURL} className="w-full h-full rounded-full" alt="" />
                                            <div className="absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-1"></div>
                                        </div>
                                        <h1 className="">{item.displayName}</h1>
                                    </div>
                                </label>
                                <div className="">
                                    <input type="checkbox" id={item.uid} />
                                </div>
                            </div>
                        ))}
                    </div> */}
                </Modal>
            </div>
        </div>
    );
}
