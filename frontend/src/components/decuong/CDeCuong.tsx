"use client"
import { ISO } from "@/types/type"
import React, { useEffect, useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DeCuongTypeFile from "./DeCuongTypeFile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import CDeCuongTypeText from "./CDeCuongTypeText"
import { GET_API } from "@/lib/fetchAPI"
import DeCuongItem from "./DeCuongItem"
import Loading from "../ui/loading"
import Link from "next/link"
export default function CDeCuong({ findText, findFile }: any) {
    const [tab, setTab] = useState("my")
    const [loading, setLoading] = useState(false)
    const [SOUser, setSOUser] = useState<ISO[]>([])
    const [filterSOUser, setFilterSOUser] = useState<ISO[]>([])
    const [searchQuiz, setSearchQuiz] = useState("")

    const router = useRouter()
    const token = Cookies.get("token") || ""

    useEffect(() => {
        const fetchSOUser = async () => {
            setLoading(true)
            const res = await GET_API("/so/user", token)
            setSOUser(res)
            setFilterSOUser(res)
            setLoading(false)
        }

        if (token) {
            fetchSOUser()
        }
    }, [])

    const handleSearchQuiz = (value: string) => {
        setSearchQuiz(value)
        if (value.trim() === "") {
            setFilterSOUser(SOUser) // Reset to original data if search is empty
            return
        }
        const filteredData = SOUser.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
        setFilterSOUser(filteredData)
    }
    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px]  min-h-screen">
                <div className="px-2 md:px-0">
                    <div className="flex items-center gap-3 ">
                        <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                            <Users className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Đề cương</h1>
                            <p>Tổng hợp những đề cương được upload từ cộng đồng Quizzet</p>
                        </div>
                    </div>
                    <Tabs defaultValue="my" className="mt-8" value={tab} onValueChange={setTab}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
                            <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-gray-100 dark:bg-slate-600">
                                <TabsTrigger value="my" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                    Đề cương của tôi
                                </TabsTrigger>
                                <TabsTrigger value="community" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                    Khám phá cộng đồng
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center flex-col md:flex-row gap-3">
                                {tab === "my" && (
                                    <div className="relative w-full ">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input placeholder="Tìm kiếm đề cương..." className="pl-10 h-11 w-full md:w-64 " value={searchQuiz} onChange={(e) => handleSearchQuiz(e.target.value)} />
                                    </div>
                                )}

                                <Button onClick={() => router.push("/decuong/taodecuong")} className="h-11 w-full md:w-auto px-10 relative group overflow-hidden  bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                    <Plus className="h-4 w-4" />
                                    Tạo đề cương
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="my">
                            <div>
                                {token ? (
                                    <div className="mt-3">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
                                            {filterSOUser && filterSOUser.map((item) => <DeCuongItem item={item} key={item._id} />)}
                                            {loading && (
                                                <div className="flex items-center justify-center col-span-4 h-[500px]">
                                                    <Loading className="h-12 w-12" />{" "}
                                                </div>
                                            )}
                                            {token && !loading && filterSOUser?.length <= 0 && (
                                                <div className="h-[350px] col-span-12 flex flex-col gap-3 items-center justify-center ">
                                                    <p className="dark:text-gray-400">Bạn chưa có đề cương nào chia sẻ cho cộng đồng :(</p>
                                                    <Link href="/decuong/taodecuong">
                                                        <Button className="text-white">
                                                            <Plus />
                                                            Đẩy đề cương lên thôi
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className=" text-gray-700 mt-10 dark:text-gray-300 h-[350px] flex flex-col gap-3 items-center justify-center">
                                        <p>Bạn cần đăng nhập để có thể tạo đề cương</p>
                                        <Button className="dark:text-white" onClick={() => setTab("community")} variant="secondary">
                                            <Users className="h-4 w-4" /> Xem tab cộng đồng của chúng tôi
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="community">
                            <div className="mt-5">
                                <DeCuongTypeFile findFile={findFile} />
                                <CDeCuongTypeText findText={findText} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
