import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig } from "@/components/ui/chart"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { GET_API } from "@/lib/fetchAPI"
import { Users, FileText, Flag, CreditCard, TrendingUp, Activity, WholeWord } from "lucide-react"
import { cookies } from "next/headers"
import { ClientChartWrapper } from "@/components/ClientChartWrapper"
import { IActivity } from "@/types/type"
import handleCompareDate from "@/lib/CompareDate"
import Link from "next/link"

const chartConfig = {
    count: {
        label: "Số lượng người dùng ",
        color: "#2563eb",
    },
    month: {
        label: "Tháng",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export default async function DashboardPage() {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value || ""
    const res = await GET_API("/admin/analystic", token)
    const analyze = [
        {
            title: "Tổng người dùng",
            value: res?.total?.user,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả người dùng trong hệ thống",
            bgColor: "dark:bg-gray-900/50",
            change: res?.percentageChanges?.user,
        },
        {
            title: "Bài đăng",
            value: res?.total?.quiz,
            icon: <FileText className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả bài đăng trong hệ thống",
            bgColor: "dark:bg-purple-900/50",
            change: res?.percentageChanges?.quiz,
        },
        {
            title: "Báo cáo",
            value: res?.total?.report,
            icon: <Flag className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả báo cáo trong hệ thống",
            bgColor: "dark:bg-red-900/50",
            change: res?.percentageChanges?.report,
        },
        {
            title: "Bộ Flashcards",
            value: res?.total?.listFlashCard || 0,
            icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
            description: "Tất cả bộ thẻ học trong hệ thống",
            bgColor: "dark:bg-blue-900/50",
            change: res?.percentageChanges?.listFlashCard,
        },
        {
            title: "Tổng số từ vựng",
            value: res?.total?.flashcard,
            icon: <WholeWord className="h-4 w-4 text-muted-foreground" />,
            description: "Tổng số từ vựng trong hệ thống",
            bgColor: "dark:bg-green-900/50",
            change: res?.percentageChanges?.flashcard,
        },
    ]

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Tổng quan hệ thống quản lý</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {analyze &&
                    analyze.map((item, index) => (
                        <Card className={`dark:border-white/10 ${item.bgColor}`} key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                {item.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="">{item.change}%</span> so với tháng trước
                                </p>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Thống kê hoạt động
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">{res?.chartData && <ClientChartWrapper chartData={res?.chartData} chartConfig={chartConfig} />}</CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Hoạt động gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4  max-h-[350px] overflow-y-auto">
                        {res?.activity?.map((activity: IActivity, index: number) => (
                            <div className="flex items-center gap-3" key={index}>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="text-sm">
                                    <p className="font-medium">
                                        <Link href={`/profile/${activity.userId._id}`}>{activity.userId.displayName}</Link> mới {activity.targetType}
                                    </p>
                                    <p className="text-muted-foreground">{handleCompareDate(activity.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
