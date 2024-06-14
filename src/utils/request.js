import { collection, getDocs } from "firebase/firestore";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

export const get = async (url) => {
    const response = await fetch(`${API_URL}${url}`);
    return response.json();
};

export const post = async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const patch = async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const get_firebase = async (db, name_db) => {
    const querySnapshot = await getDocs(collection(db, name_db));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
    });
    return data;
};
