// components/charts/ClientChartWrapper.tsx
"use client"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, XAxis } from "recharts"

interface ClientChartWrapperProps {
    chartData: any[]
}

// const chartConfig = {
//     count: {
//         label: "Số lượng người dùng ",
//         color: "#2563eb",
//     },
//     month: {
//         label: "Tháng",
//         color: "#60a5fa",
//     },
// } satisfies ChartConfig

const chartConfig = {
    japan: {
        label: "Nhật",
        color: "#3b82f6", // Blue
    },
    korea: {
        label: "Hàn",
        color: "#ef4444", // Red
    },
    english: {
        label: "Anh",
        color: "#10b981", // Green
    },
    germany: {
        label: "Đức",
        color: "#f59e0b", // Yellow
    },
    chinese: {
        label: "Trung",
        color: "#8b5cf6", // Purple
    },
    null: {
        label: "Khác",
        color: "#6b7280", // Gray
    },
} satisfies ChartConfig
export function ClientChartWrapper({ chartData }: ClientChartWrapperProps) {
    // Tạo function để convert số tháng thành tên tháng
    // const formatMonth = (monthNumber: number) => {
    //     const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    //     return months[monthNumber] || `Tháng ${monthNumber + 1}`
    // }

    // return (
    //     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    //         <BarChart accessibilityLayer data={chartData}>
    //             <CartesianGrid vertical={false} />
    //             <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => formatMonth(value)} />
    //             <ChartTooltip content={<ChartTooltipContent />} />
    //             <ChartLegend content={<ChartLegendContent />} />
    //             <Bar dataKey="count" fill="#2563eb" radius={4} />
    //         </BarChart>
    //     </ChartContainer>
    // )
    const getColor = (language: string) => {
        const colorMap: { [key: string]: string } = {
            japan: "#3b82f6",
            korea: "#ef4444",
            english: "#10b981",
            germany: "#f59e0b",
            chinese: "#8b5cf6",
            null: "#6b7280",
        }
        return colorMap[language] || "#6b7280"
    }
    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="language">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.language)} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="language" />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
            </PieChart>
        </ChartContainer>
    )
}
