import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
import sortArrayByTime from "../../helpers/sort";
import { IoIosTimer } from "react-icons/io";
import Cookies from "js-cookie";
import { get_api } from "../../services/fetchapi";
import handleCompareDate from "../../utils/compareData";

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = Cookies.get("token");
    if (token === undefined) {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Vui lòng đăng nhập xem lại lịch sử làm bài",
            icon: "warning",
            didClose: () => {
                navigate("/login");
            },
        });
    }

    useEffect(() => {
        const fetchHistory = async () => {
            const req = await get_api("/history");
            if (req.ok) {
                setHistory(req.history);
                setLoading(true);
            }
        };

        fetchHistory();
    }, []);

    return (
        <>
            {loading ? (
                <div className="p-5 md:p-0">
                    <p className="text-2xl font-bold text-green-500">Lịch sử làm bài</p>
                    {history === undefined ? "Bạn chưa có lịch sử làm bài..." : ""}
                    <div className="grid md:grid-cols-4 gap-5 my-5 relative grid-cols-1 ">
                        {history &&
                            history.map((item) => (
                                <div key={item.id} className="bg-white border-[1px] shadow-md">
                                    <div className="p-3 ">
                                        <h1 className="text-lg mb-3 text-green-500 font-bold h-[56px] line-clamp-2">{item.title}</h1>
                                        <p>
                                            Số câu đúng:{" "}
                                            <label className="text-green-500 font-bold">
                                                {item.score}/{item.lenght}
                                            </label>{" "}
                                        </p>
                                        <p className="text-gray-500 flex gap-1 items-center">
                                            <IoIosTimer /> {handleCompareDate(item.date)}
                                        </p>
                                        <Link to={`/answer/${item._id}`} className="block text-right mt-3">
                                            <button className="bg-green-500 text-white ">Xem chi tiết</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <>Loading...</>
            )}
        </>
    );
}
