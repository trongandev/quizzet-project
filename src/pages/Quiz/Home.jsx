import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { Tooltip } from "antd";
import { MdOutlineVerified } from "react-icons/md";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { get_api } from "../../services/fetchapi";
import { jwtDecode } from "jwt-decode";
import { setNewUser } from "../../reducers/userSlice";
import handleCompareDate from "../../utils/compareData";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async (userId) => {
    const response = await get_api("/profile/" + userId);
    return response.user;
};

// Function to fetch quiz data
const fetchQuiz = async () => {
    const response = await get_api("/quiz");
    return response.quiz;
};

// Function to fetch tool data
const fetchTool = async () => {
    const response = await get_api("/admin/suboutline");
    return response;
};

export default function Home() {
    const dispatch = useDispatch();
    const token = Cookies.get("token");

    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded?.user?.id;

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["profile", userId],
        queryFn: () => fetchProfile(userId),
        enabled: !!userId,
    });

    const { data: quizData, isLoading: quizLoading } = useQuery({
        queryKey: ["quiz"],
        queryFn: fetchQuiz,
    });

    const { data: toolData, isLoading: toolLoading } = useQuery({
        queryKey: ["tool"],
        queryFn: fetchTool,
    });

    useEffect(() => {
        if (profileData) {
            dispatch(setNewUser(profileData));
        }
    }, [profileData, dispatch]);

    return (
        <div className=" ">
            <div className="">
                <div className="bg-white p-5">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Chào mừng bạn đến với QuizzEt</h1>
                    <p className="text-sm md:text-md text-gray-500">
                        QuizzEt là trang web giúp bạn tạo ra các bài quiz online một cách dễ dàng và nhanh chóng. Bạn có thể tạo ra các câu hỏi, trả lời và chia sẻ với bạn bè.
                    </p>
                </div>
                <div className="bg-white p-5 mt-2 text-red-500 flex justify-between items-center flex-col md:flex-row gap-3 md:gap-0">
                    <p>Bạn có thể thêm bài quiz mới ở đây</p>
                    <Link to="/post">
                        <button className="bg-green-500 text-white">Thêm bài mới</button>
                    </Link>
                </div>
                {quizLoading ? (
                    <div className="h-[400px] flex items-center justify-center w-full bg-white p-5 mt-2">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                ) : (
                    <div className="bg-white p-5 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quizData &&
                            quizData?.map((item) => (
                                <div key={item._id}>
                                    <div className=" shadow-md border-2 rounded-lg overflow-hidden">
                                        <Link to={`/quiz/${item.slug}`} className="block w-full h-[150px] overflow-hidden">
                                            <img src={item.img} alt="" className="h-full w-full object-cover hover:scale-110 duration-300" />
                                        </Link>
                                        <div className="p-3">
                                            <Link to={`/profile/${item.uid._id}`} className="flex items-center gap-2 mb-3 ">
                                                <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                    <img src={item.uid.profilePicture} alt="" className="object-cover h-full" />
                                                </div>
                                                <div className="group">
                                                    <div className="flex items-center gap-1">
                                                        <h2 className="text-gray-800 text-sm line-clamp-1 overflow-hidden group-hover:underline">{item.uid.displayName}</h2>
                                                        {item.uid.verify ? (
                                                            <Tooltip title="Tài khoản đã được xác thực">
                                                                <MdOutlineVerified color="#3b82f6" />
                                                            </Tooltip>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[10px] flex gap-1 items-center">
                                                        <CiTimer color="#1f2937" /> {handleCompareDate(item.date)}
                                                    </p>
                                                </div>
                                            </Link>
                                            <h1 className="text-lg h-[28px] lg:h-[56px] font-bold text-gray-800">{item.title}</h1>
                                            <p className="text-gray-700 line-clamp-2 h-[23px] lg:h-[45px] my-3 text-[15px]">{item.content}</p>
                                            <div className="flex justify-between items-center">
                                                <p>Lượt làm: {item.noa}</p>
                                                <Link to={`/quiz/${item.slug}`} className="text-right">
                                                    <button className="bg-green-600 text-white">Làm bài ngay</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                <div className="bg-white p-5 mt-2 text-red-500 ">
                    <h1 className="text-xl md:text-2xl text-green-700 font-bold">Một số tài liệu ôn các môn chuyên ngành</h1>
                    <p className="text-sm md:text-md text-gray-500">Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để gửi tài liệu cho mình nhá 😍😍</p>
                    <a href="mailto: thngan25k3@gmail.com">
                        <button className="bg-green-500 text-white mt-2">Yêu cầu tài liệu mới</button>
                    </a>
                </div>
                <div className="bg-white ">
                    <div className="">
                        {toolLoading ? (
                            <div className="h-[400px] flex items-center justify-center w-full">
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </div>
                        ) : (
                            <div className="bg-white px-2 py-5 mt-2 grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-4">
                                {toolData &&
                                    toolData.map((item, index) => (
                                        <NavLink to={`/decuong/${item.slug}`} className="relative" key={index}>
                                            <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                                                <img src={item.image} alt="" className="h-[150px] w-full object-cover" />
                                                <div className="p-3">
                                                    <h1 className="text-[15px] text-green-500 font-bold h-[48px] line-clamp-2">{item.title}</h1>
                                                    <p className="text-[13px] mb-2">
                                                        Tổng câu hỏi: <label className="text-red-500 font-bold">{item.lenght}</label>{" "}
                                                    </p>
                                                    <button className="bg-green-600 text-white">Xem ngay</button>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 left-0">
                                                <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{handleCompareDate(item.date)}</p>
                                            </div>
                                        </NavLink>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
