const API_URL = "http://localhost:3001/";

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
