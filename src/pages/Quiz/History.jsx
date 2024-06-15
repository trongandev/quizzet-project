import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function History() {
    const [quiz, setQuiz] = useState([]);

    const db = getFirestore();

    const [user, setUser] = useState({});
    const auth = getAuth();

    useEffect(() => {
        const handleCheckLogin = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                }
            });
        };
        handleCheckLogin();
    }, []);
    console.log(user.uid);

    useEffect(() => {
        const fetchBook = async () => {
            const querySnapshot = await getDocs(collection(db, "histories"));
            querySnapshot.forEach((doc) => {
                setQuiz((prev) => [
                    ...prev,
                    {
                        id: doc.id,
                        data: doc.data(),
                    },
                ]);
            });
        };
        fetchBook();
    }, []);

    // console.log(quiz)
    console.log(quiz);
    return (
        <div>
            <p className="text-2xl font-bold text-green-500">Lịch sử làm bài</p>
            {/* <div className="grid grid-cols-4 gap-5 my-5">
                {history.map((item) => (
                    <div key={item.id} className="bg-white p-3 border-[1px] shadow-md">
                        <h1 className="text-lg mb-3">
                            Tên bài thi: <label className="text-green-500 font-bold">{item.title}</label>{" "}
                        </h1>
                        <p>
                            Số câu đúng:{" "}
                            <label className="text-green-500 font-bold">
                                {item.score}/{item.questions.length}
                            </label>{" "}
                        </p>
                        <p className="text-gray-500">Ngày thi: {item.date}</p>
                        <a href={`answer/${item.topic_id}`} className="block text-right mt-3">
                            <button className="bg-green-500 text-white ">Xem chi tiết</button>
                        </a>
                    </div>
                ))}
            </div> */}
        </div>
    );
}
