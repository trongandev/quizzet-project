import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return (
        <>
            <Header />
            <div className="p-10 bg-gray-100">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
