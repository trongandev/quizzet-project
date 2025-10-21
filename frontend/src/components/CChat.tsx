"use client"
import handleCompareDate from "@/lib/CompareDate"
import { GET_API, POST_API } from "@/lib/fetchAPI"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import CShowMessage from "./CShowMessage"
import { FaArrowLeft } from "react-icons/fa"
import { useSocket } from "@/context/socketContext"
import { IChat, IUser } from "@/types/type"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Loading from "./ui/loading"
import { MessageCircle, Search } from "lucide-react"
import { Input } from "./ui/input"
function useDebounce(value: any, duration = 300) {
    const [debounceValue, setDebounceValue] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, duration)
        return () => {
            clearTimeout(timer)
        }
    }, [value, duration])
    return debounceValue
}
interface Props {
    chat: IChat[]
    setChat: any
    unreadCountChat: number
    setUnreadCountChat: any
    token: string
    user: IUser | null
}
export default function CChat({ chat, setChat, unreadCountChat, setUnreadCountChat, token, user }: Props) {
    const [input, setInput] = useState("")

    const debouncedSearchTerm = useDebounce(input, 300)
    const [openChat, setOpenChat] = useState(false)
    const [chatMessId, setChatMessId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(null)
    const [search, setSearch] = useState<IUser[]>([])
    const [isSearch, setIsSearch] = useState(false)
    const { socket, onlineUsers } = useSocket()

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const req = await GET_API(`/profile/findbyname/${input}`, token)
            if (req?.ok) {
                setSearch(req?.users)
            } else {
                console.error(req?.message)
            }
            setLoading(false)
        }

        if (debouncedSearchTerm && input !== "") {
            fetchAPI()
        }
    }, [debouncedSearchTerm, input, token])

    // const handleRouterChat = async (item) => {
    //     const req = await GET_API(`/notify/${item?._id}`, token);
    //     if (req.ok) {
    //         setUnreadCountNotify(req?.unreadCount || 0);
    //         router.push(item?.link);
    //         setOpenNoti(false);
    //     }
    // };

    useEffect(() => {
        if (input === "") {
            setSearch([]) // Gán lại danh sách chat mặc định
        }
    }, [input, chat])

    const handleCreateAndCheckRoomChat = async (id_another_user: string, index: any) => {
        setLoadingChat(index)
        const req = await POST_API(
            "/chat/create-chat",
            {
                participants: [user?._id, id_another_user],
            },
            "POST",
            token
        )
        if (req) {
            const res = await req.json()
            if (req.ok) {
                setChatMessId(res?.chatId)
                setOpenChat(false)
                setUnreadCountChat(res?.countRead)
                setChat((prev: any) => prev.map((msg: IChat) => (msg._id === res.chatId ? { ...msg, is_read: true } : msg)))
            }
        }
        setLoadingChat(null)
    }

    const handleDeleteChat = () => {
        setChatMessId(null)
    }

    const checkOnline = (userId: string) => {
        return onlineUsers?.find((item: any) => item?._id === userId)
    }
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white relative">
                        {unreadCountChat > 0 && <div className="absolute -top-1 -right-1 h-[14px] w-[14px] text-[8px] rounded-full bg-red-500 text-white flex items-center justify-center font-mono tabular-nums">{unreadCountChat}</div>}

                        <MessageCircle size={18} />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="md:w-[500px] max-h-[400px] md:max-h-[600px] overflow-y-scroll ">
                    <div className="max-h-[600px]">
                        <div className="flex gap-2 items-center h-9  mb-3 w-full">
                            {isSearch && (
                                <div
                                    className="h-full flex items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
                                    onClick={() => {
                                        setIsSearch(false)
                                        setInput("")
                                    }}
                                >
                                    <FaArrowLeft />
                                </div>
                            )}

                            <div className="relative w-full border border-gray-300/50 dark:border-white/10 rounded-lg">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm mọi người..."
                                    className="pl-10 w-full md:w-64 border-none outline-none focus-visible:ring-0 "
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        setIsSearch(true)
                                    }}
                                />
                            </div>
                        </div>
                        {!isSearch &&
                            chat?.map((item, index) => {
                                const otherParticipant = item?.participants.find((p: any) => p?.userId?._id !== user?._id)
                                return (
                                    <div onClick={() => otherParticipant?.userId?._id && handleCreateAndCheckRoomChat(otherParticipant.userId._id, index)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600/50 flex items-center gap-2 cursor-pointer rounded-lg h-[80px]">
                                        <div className="w-[36px] h-[36px] md:w-[56px] md:h-[56px] relative">
                                            <Image src={otherParticipant?.userId?.profilePicture || "/avatar.jpg"} alt="" className="object-cover h-full absolute overflow-hidden rounded-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                            {otherParticipant?.userId?._id && checkOnline(otherParticipant.userId._id) && <div className="absolute z-1 right-1 bottom-0 w-3 h-3 rounded-full bg-[#3fbb46]" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm md:text-md dark:text-gray-300 line-clamp-2">
                                                <label htmlFor="" className="font-bold">
                                                    {otherParticipant?.userId?.displayName}
                                                </label>
                                                {/* {item?.content} */}
                                            </p>
                                            {item?.last_message ? (
                                                <div className="text-gray-500 text-[12px] ">
                                                    <p className="line-clamp-1 text-xs md:text-sm"> {item?.last_message} </p>
                                                    <p className="text-xs md:text-sm">{item?.last_message_date && handleCompareDate(item?.last_message_date)}</p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-[12px]">Chưa có tin nhắn!</p>
                                            )}
                                        </div>
                                        {loadingChat === index && <Loading />}

                                        {loadingChat !== index && !item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                    </div>
                                )
                            })}
                        {isSearch &&
                            search?.map((item, index) => (
                                <div onClick={() => handleCreateAndCheckRoomChat(item?._id, index)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer rounded-lg h-[80px]">
                                    <div className="w-[56px] h-[56px] relative">
                                        <Image src={item?.profilePicture || "/avatar.jpg"} alt="" className="object-cover h-full absolute overflow-hidden rounded-full" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                        {checkOnline(user?._id === item?._id ? item?._id : item?._id) && <div className="absolute z-1 right-1 bottom-0 w-3 h-3 rounded-full bg-[#3fbb46]" />}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                                            <label htmlFor="" className="font-bold">
                                                {item?.displayName}
                                            </label>{" "}
                                            {/* {item?.content} */}
                                        </p>
                                        <p className="text-gray-500 text-[12px]">Tham gia {item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {loadingChat === index && <Loading />}
                                </div>
                            ))}

                        {!isSearch && !loading && chat?.length === 0 && <div className="text-center text-gray-500">Bạn chưa có tin nhắn nào...</div>}
                        {loading && (
                            <div className="flex items-center justify-center w-full">
                                <Loading />
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <CShowMessage chatMessId={chatMessId} handleDeleteChat={handleDeleteChat} token={token} socket={socket} checkOnline={checkOnline} />
        </>
    )
}
