// components/charts/ClientChartWrapper.tsx
"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

interface ClientChartWrapperProps {
    chartData: any[]
    chartConfig: ChartConfig
}

export function ClientChartWrapper({ chartData, chartConfig }: ClientChartWrapperProps) {
    // Tạo function để convert số tháng thành tên tháng
    const formatMonth = (monthNumber: number) => {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
        return months[monthNumber] || `Tháng ${monthNumber + 1}`
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => formatMonth(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="#2563eb" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
