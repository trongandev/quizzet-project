import React from "react";
import AdminNav from "./AdminNav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex bg-gray-200 h-[100vh]">
            <div className="w-[20%] bg-white border-[1px]">
                <AdminNav />
            </div>
            <div className="w-[80%] bg-white p-5">
                <Outlet />
            </div>
        </div>
    );
}
