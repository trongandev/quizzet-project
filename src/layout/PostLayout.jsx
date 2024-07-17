import { Button } from "antd";
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function PostLayout() {
    return (
        <div>
            <div className="flex gap-2 md:gap-3 mb-2 md:px-3 px-0 justify-between md:justify-start">
                <Link to="/post/gui">
                    <Button>Thêm bằng giao diện (Recommend )</Button>
                </Link>
                <Link to="/post/text">
                    <Button>Thêm bằng chữ</Button>
                </Link>
            </div>
        </div>
    );
}
