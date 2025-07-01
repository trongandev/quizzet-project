// components/charts/ClientChartWrapper.tsx
"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

interface ClientChartWrapperProps {
    data: any[];
    config: ChartConfig;
}

export function ClientChartWrapper({ data, config }: ClientChartWrapperProps) {
    return (
        <ChartContainer config={config}>
            <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
            </AreaChart>
        </ChartContainer>
    );
}
