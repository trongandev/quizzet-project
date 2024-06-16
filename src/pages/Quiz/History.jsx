import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, get_firebase, post } from "../../utils/request";
import { getCookie } from "../../helpers/cookie";
import Swal from "sweetalert2";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import sortArrayByTime from "../../helpers/sort";
import { IoIosTimer } from "react-icons/io";

export default function History() {
    const db = getFirestore();

    const [user, setUser] = useState({});
    const [history, setHistory] = useState([]);

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
    }, [auth]);
    console.log(user.uid);

    useEffect(() => {
        if (user) {
            const fetchQuiz = async () => {
                const querySnapshot = await getDocs(collection(db, "histories"));
                const filteredQuiz = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(data);
                    if (data.uid === user.uid) {
                        filteredQuiz.push({
                            ...doc.data(),
                            id: doc.id,
                        });
                    }
                });

                const result = sortArrayByTime(filteredQuiz);

                setHistory(result);
            };

            fetchQuiz();
        }
    }, [user, db]);

    // console.log(quiz)
    console.log(history);
    return (
        <div>
            <p className="text-2xl font-bold text-green-500">Lịch sử làm bài</p>
            <div className="grid grid-cols-4 gap-5 my-5 relative">
                {history.length === 0 ? "Bạn chưa có lịch sử làm bài..." : ""}
                {history.map((item) => (
                    <div key={item.id} className="bg-white p-3 border-[1px] shadow-md">
                        <h1 className="text-lg mb-3 text-green-500 font-bold h-[56px] line-clamp-2">{item.title}</h1>
                        <p>
                            Số câu đúng:{" "}
                            <label className="text-green-500 font-bold">
                                {item.score}/{item.questions.length}
                            </label>{" "}
                        </p>
                        <p className="text-gray-500 flex gap-1 items-center">
                            <IoIosTimer /> {item.date}
                        </p>
                        <a href={`answer/${item.id}`} className="block text-right mt-3">
                            <button className="bg-green-500 text-white ">Xem chi tiết</button>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
