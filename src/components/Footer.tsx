import React from "react";
import "@/app/globals.css";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { GrGithub } from "react-icons/gr";
export default function CFooter() {
    return (
        <footer className="">
            <div className="mt-5 bg-secondary text-white w-full">
                <div className="flex gap-3 justify-center  py-2">
                    <p>
                        Bản quyền thuộc về <span className="rubik-wet-paint-regulars">Quizzet</span>{" "}
                    </p>
                    <p>&copy; 2024</p>
                </div>
                <div className="flex gap-5 items-center justify-center py-2">
                    <p>Liên hệ</p>
                    <Link href="https://www.facebook.com/trongandev" target="_blank">
                        <FaFacebook size={30} />
                    </Link>
                    <Link href="https://github.com/angutboiz" target="_blank">
                        <GrGithub size={30} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
