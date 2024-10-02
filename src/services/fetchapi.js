import Cookies from "js-cookie";

const token = Cookies.get("token") || "";

export const get_api = async (url_endpoint) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}${url_endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {}
};

export const post_api = async (url_endpoint, body, method) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}${url_endpoint}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return await res;
    } catch (error) {}
};
