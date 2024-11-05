import React from "react";
import "@/app/globals.css";
export default function CFooter() {
    return (
        <footer className="">
            <div className="">
                <hr />
                <div className="flex gap-3 justify-center my-5 text-gray-500">
                    <p>Bản quyền thuộc về <span className="rubik-wet-paint-regulars">Quizzet</span> </p>
                    <p>&copy; 2024</p>
                </div>
            </div>
        </footer>
    );
}
