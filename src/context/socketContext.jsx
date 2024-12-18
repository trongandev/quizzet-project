import React, { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from "./userContext";

// Tạo Context
const SocketContext = createContext();

// Provider Component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { user } = useUser();
    useEffect(() => {
        const newSocket = io(process.env.API_SOCKET, {
            transports: ["websocket"],
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (socket === null) return;
        socket.emit("newUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });
        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket, user]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

// Hook để sử dụng socket dễ dàng
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
