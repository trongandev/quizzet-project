import React, { createContext, useState, useContext, useEffect, useRef } from "react"
import Cookies from "js-cookie"
import { GET_API } from "@/lib/fetchAPI"
import { IUser } from "@/types/type"

const UserContext = createContext<
    | {
          user: IUser | null
          loading: boolean
          updateUser: (updatedUser: any) => void
          clearUser: () => void
          refetchUser: () => void
      }
    | undefined
>(undefined)

export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(false)
    const isInitialized = useRef(false)
    const isFetching = useRef(false)

    const fetchAPI = async () => {
        const token = Cookies.get("token")
        if (!token) {
            setUser(null)
            return
        }

        // Tránh gọi API đồng thời
        if (isFetching.current) {
            return
        }

        try {
            isFetching.current = true
            setLoading(true)
            const req = await GET_API("/profile/getoneprofile", token)
            if (req?.user) {
                setUser(req.user)
            } else {
                // Nếu không có user trong response, clear token
                Cookies.remove("token")
                setUser(null)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            // Nếu có lỗi xác thực, clear token
            Cookies.remove("token")
            setUser(null)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }

    useEffect(() => {
        // Chỉ fetch một lần khi component mount
        if (!isInitialized.current) {
            isInitialized.current = true
            fetchAPI()
        }

        // Event listener cho focus và visibility change
        const handleFocus = () => {
            const token = Cookies.get("token")
            if (token && !user && !isFetching.current) {
                fetchAPI()
            }
        }

        const handleVisibilityChange = () => {
            const token = Cookies.get("token")
            if (!document.hidden && token && !user && !isFetching.current) {
                fetchAPI()
            }
        }

        window.addEventListener("focus", handleFocus)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("focus", handleFocus)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [user]) // Chỉ depend vào user

    // Interval riêng biệt để kiểm tra token
    useEffect(() => {
        const intervalId = setInterval(() => {
            const token = Cookies.get("token")
            if (token && !user && !loading && !isFetching.current) {
                fetchAPI()
            } else if (!token && user) {
                setUser(null)
            }
        }, 10000) // Tăng từ 5s lên 10s để giảm tần suất

        return () => clearInterval(intervalId)
    }, [user, loading])

    const updateUser = (updatedUser: any) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedUser,
        }))
    }

    const clearUser = () => {
        setUser(null)
        Cookies.remove("token")
    }

    const refetchUser = () => {
        if (!isFetching.current) {
            fetchAPI()
        }
    }

    return <UserContext.Provider value={{ user, loading, updateUser, clearUser, refetchUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
