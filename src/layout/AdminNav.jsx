import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { MdOutlineTopic } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { VscBeaker } from "react-icons/vsc";
import { BsClockHistory } from "react-icons/bs";

export default function AdminNav() {
    return (
        <div>
            <h1 className="text-green-500 font-bold text-2xl text-center pt-3">Trang quản lí</h1>
            <hr className="my-3" />
            <ul className="text-gray-500">
                <li>
                    <Link to="/whatheo" className="p-3 flex items-center gap-2">
                        <MdDashboard />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <NavLink to="/whatheo/users" className="p-3 flex items-center gap-2">
                        <HiUsers />
                        Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/whatheo/topic" className="p-3 flex items-center gap-2">
                        <MdOutlineTopic />
                        Topic
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/whatheo/history" className="p-3 flex items-center gap-2">
                        <MdHistory />
                        History
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/whatheo/tool" className="p-3 flex items-center gap-2">
                        <FaTools />
                        Tool
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/whatheo/user-use-tool" className="p-3 flex items-center gap-2">
                        <VscBeaker />
                        Users Use Tool
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/whatheo/history-tool" className="p-3 flex items-center gap-2">
                        <BsClockHistory />
                        History Tool
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
