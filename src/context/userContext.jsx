import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { GET_API } from "@/lib/fetchAPI";

const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const token = Cookies.get("token");
    const fetchAPI = async () => {
        const req = await GET_API("/profile", token);
        setUser(req.data.user);
    };

    useEffect(() => {
        if (Cookies.get("token")) fetchAPI();
    }, []);

    const updateUser = (updatedUser) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedUser,
        }));
    };

    const clearUser = () => {
        setUser(null);
        Cookies.remove("token");
    };

    return <UserContext.Provider value={{ user, updateUser, clearUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
