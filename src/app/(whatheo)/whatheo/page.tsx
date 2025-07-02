import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GET_API } from "@/lib/fetchAPI";
import { Users, FileText, Flag, CreditCard, TrendingUp, Activity, WholeWord } from "lucide-react";
import { cookies } from "next/headers";
import { ClientChartWrapper } from "@/components/ClientChartWrapper";

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
];
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export default async function DashboardPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value || "";
    const res = await GET_API("/admin/analystic", token);
    console.log(res);
    const stats = [
        {
            title: "Tổng người dùng",
            value: res.user,
            change: "+12%",
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Bài đăng",
            value: res.quiz,
            change: "+8%",
            icon: FileText,
            color: "text-green-600",
        },
        {
            title: "Báo cáo",
            value: res.report,
            change: "-5%",
            icon: Flag,
            color: "text-red-600",
        },
        {
            title: "Bộ Flashcards",
            value: res.listFlashcard,
            change: "+15%",
            icon: CreditCard,
            color: "text-purple-600",
        },
        {
            title: "Tổng số từ vựng",
            value: res.flashcard,
            change: "+35%",
            icon: WholeWord,
            color: "text-pink-600",
        },
    ];

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
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span> so với tháng trước
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
                    <CardContent className="pl-2">
                        <ClientChartWrapper data={chartData} config={chartConfig} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Hoạt động gần đây
                        </CardTitle>
                        <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="text-sm">
                                    <p className="font-medium">Người dùng mới đăng ký</p>
                                    <p className="text-muted-foreground">2 phút trước</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="text-sm">
                                    <p className="font-medium">Bài đăng được duyệt</p>
                                    <p className="text-muted-foreground">5 phút trước</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <div className="text-sm">
                                    <p className="font-medium">Báo cáo mới</p>
                                    <p className="text-muted-foreground">10 phút trước</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
