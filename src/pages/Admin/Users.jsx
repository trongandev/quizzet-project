import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import Admin from "./Admin";
import { Route, Routes } from "react-router-dom";
import { get, patch } from "../../utils/request";
import { Switch } from "antd";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function Users() {
    const [user, setUser] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchBook = async () => {
            const querySnapshot = await getDocs(collection(db, "quiz"));
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        };
        fetchBook();
    }, []);

    console.log(user);

    const handleChangeStatus = (id, status) => {
        const newUser = user.map((item) => {
            if (item.id === id) {
                item.status = !item.status;
            }
            return item;
        });
        setUser(newUser);

        patch(`users/${id}`, { status: !status });
    };

    const handleChangeRole = (id, value) => {
        console.log(id + " " + value);
        const newUser = user.map((item) => {
            if (item.id === id) {
                item.role = value;
            }
            return item;
        });
        console.log(newUser);
        setUser(newUser);

        patch(`users/${id}`, { role: value });
    };

    return (
        <div className="">
            <div className="">
                <h1 className="text-lg text-green-500 font-bold">Quản lí tài khoản người dùng</h1>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left rtl:text-right ">
                        <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên User
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày đăng ký
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quyền vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {user &&
                                user.map((item, index) => (
                                    <tr className="bg-white border-b " key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">{item.username}</td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">{item.createdAt}</td>

                                        <td className="px-6 py-4">
                                            {item.status ? (
                                                <div className="bg-green-200 text-green-500 rounded-full text-center px-1">Đang hoạt động</div>
                                            ) : (
                                                <div className="bg-red-200 text-red-500 rounded-full text-center px-1">Huỷ tài khoản</div>
                                            )}
                                            {/* <div className="bg-green-200 text-green-500 rounded-full text-center px-1">Đang hoạt động</div> */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                onChange={(e) => handleChangeRole(item.id, e.target.value)}
                                                name=""
                                                id=""
                                                value={item.role}
                                                className="text-red-500 text-center font-bold border-[1px] border-red-500 ">
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <div className=""></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Switch checked={item.status} onClick={() => handleChangeStatus(item.id, item.status)} />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
