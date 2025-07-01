"use client";

import { BarChart3, Users, FileText, History, Wrench, Flag, CreditCard, UserCheck, Clock, Bell, LayoutDashboard, Sun, Moon } from "lucide-react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import Link from "next/link";
import { useTheme } from "next-themes";

const menuItems = [
    {
        title: "Dashboard",
        url: "/whatheo",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/whatheo/users",
        icon: Users,
    },
    {
        title: "Flashcard",
        url: "/whatheo/flashcards",
        icon: CreditCard,
    },
    {
        title: "Topic",
        url: "/whatheo/quizs",
        icon: FileText,
    },

    {
        title: "History",
        url: "/whatheo/histories",
        icon: History,
    },
    {
        title: "Subject Outline",
        url: "/whatheo/subject-outline",
        icon: Wrench,
    },
    {
        title: "Report",
        url: "/whatheo/reports",
        icon: Flag,
    },

    // {
    //     title: "Thông báo trang chủ",
    //     url: "/whatheo/notifications",
    //     icon: Bell,
    // },
];

export function SideBarAdmin() {
    const { theme, setTheme } = useTheme();

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-green-600">Trang quản lí</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý hệ thống</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white">
                            <Sun size={18} className="" onClick={() => setTheme("light")} />
                        </div>
                    ) : (
                        <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-primary dark:text-white/60 hover:text-white">
                            <Moon size={18} className="" onClick={() => setTheme("dark")} />
                        </div>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">Admin Dashboard v2.0</div>
            </SidebarFooter>
        </Sidebar>
    );
}
