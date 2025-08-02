"use client"
import CHeader from "@/components/CHeader"
import CFooter from "@/components/Footer"
import FooterNavBar from "@/components/FooterNavBar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SocketProvider } from "@/context/socketContext"
import { UserProvider } from "@/context/userContext"
import { TASKS } from "@/types/type"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from "react"
import { ProgressProvider } from "@bprogress/next/app"
export default function LayoutQuizzet({ children, tasks }: { children: React.ReactNode; tasks: TASKS }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <UserProvider>
                <SocketProvider>
                    <CHeader tasks={tasks} />
                    <div className=" relative dark:bg-gray-700 dark:text-white">
                        <TooltipProvider>
                            <ProgressProvider height="4px" color="#2187d5" options={{ showSpinner: false }} shallowRouting>
                                {children}
                            </ProgressProvider>
                        </TooltipProvider>
                        <Toaster />
                        <FooterNavBar />
                    </div>
                    <CFooter />
                </SocketProvider>
            </UserProvider>
            <Analytics />
            <GoogleAnalytics gaId="G-L681038P5E" />
            <SpeedInsights />
        </ThemeProvider>
    )
}
