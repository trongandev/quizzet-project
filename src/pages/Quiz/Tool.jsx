import { getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { get_firebase } from "../../utils/request";
import sortArrayByTime from "../../helpers/sort";

export default function Tool() {
    const [data, setdata] = useState([]);

    const db = getFirestore();
    useEffect(() => {
        const fetchTool = async () => {
            const fetchTopic = await get_firebase(db, "tool");
            const result = sortArrayByTime(fetchTopic);
            setdata(result);
        };
        fetchTool();
    }, []);
    return (
        <div className="">
            <div className="bg-white p-5 mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    <NavLink to={`/tool/${item.name}`} className="relative" key={index}>
                        <div className=" shadow-md border-2 rounded-lg overflow-hidden group">
                            <img src={item.image} alt="" className="h-[150px] w-full object-cover" />
                            <div className="p-3">
                                <h1 className="text-lg text-green-500 font-bold h-[56px]">{item.title}</h1>
                                <p className="text-gray-500 line-clamp-2 h-[48px] my-1">{item.description}</p>
                                <div className="text-right">
                                    <button className="bg-green-500 text-white">Xem ngay</button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0">
                            <p className="text-green-500 bg-green-200 p-2 rounded-lg text-sm font-bold">{item.date}</p>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
