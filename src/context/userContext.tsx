import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { GET_API } from "@/lib/fetchAPI";
import { IUser } from "@/types/type";
const UserContext = createContext<{ user: IUser | null; updateUser: (updatedUser: any) => void; clearUser: () => void } | undefined>(undefined);
export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const token = Cookies.get("token") || "";
    const fetchAPI = async () => {
        const req = await GET_API("/profile", token);
        setUser(req?.user);
    };

    useEffect(() => {
        if (Cookies.get("token")) fetchAPI();
    }, []);

    const updateUser = (updatedUser: any) => {
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
