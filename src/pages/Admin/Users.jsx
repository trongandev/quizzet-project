import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import Admin from "./Admin";
import { Route, Routes } from "react-router-dom";
import { get, patch } from "../../utils/request";
import { Switch } from "antd";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Users() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const listAllUsers = (nextPageToken) => {
            // List batch of users, 1000 at a time.
            getAuth()
                .listUsers(1000, nextPageToken)
                .then((listUsersResult) => {
                    listUsersResult.users.forEach((userRecord) => {
                        console.log("user", userRecord.toJSON());
                    });
                    if (listUsersResult.pageToken) {
                        // List next batch of users.
                        listAllUsers(listUsersResult.pageToken);
                    }
                })
                .catch((error) => {
                    console.log("Error listing users:", error);
                });
        };
        // Start listing users from the beginning, 1000 at a time.
        listAllUsers();
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
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
