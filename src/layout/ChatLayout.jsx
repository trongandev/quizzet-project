import React, { useEffect, useState } from "react";
import Chat from "../pages/User/Chat";
// import ChatRoom from "../pages/User/ChatRoom";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";

export default function ChatLayout() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const handleRenderUser = async () => {
            // const querySnapshot = await getDocs(collection(db, "room"));
            // const filteredQuiz = [];
            // querySnapshot.forEach((doc) => {
            //     const data = doc.data();
            //     console.log(data);
            //     if (data.currentUser.uid === auth.currentUser.uid) {
            //         filteredQuiz.push({
            //             ...doc.data(),
            //             id: doc.id,
            //         });
            //     }
            //     setLoading(true);
            // });
            // setData(filteredQuiz);
        };

        handleRenderUser();
    }, []);
    return (
        <div className="flex bg-white border-gray-200 border-[1px] rounded-lg shadow-sm ">
            <div className=" h-[83vh] w-[25%]  py-2 border-r-[1px] ">
                {loading ? (
                    <Chat user={data} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Spin />
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}
