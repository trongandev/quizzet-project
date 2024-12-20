const API_ENDPOINT = process.env.API_ENDPOINT;
export const GET_API = async (url: string, token: string) => {
    try {
        const res = await fetch(`${API_ENDPOINT}${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
};

export const GET_API_WITHOUT_COOKIE = async (url: string) => {
    try {
        const res = await fetch(API_ENDPOINT + url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
};

export const POST_API = async (url: string, data: any, method: string, token: string) => {
    try {
        const res = await fetch(`${API_ENDPOINT}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return await res;
    } catch (error) {
        console.log(error);
    }
};

export const POST_API_FILE = async (url: string, data: any, token: string) => {
    try {
        const res = await fetch(`${API_ENDPOINT}${url}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
        return await res;
    } catch (error) {
        console.log(error);
    }
};
