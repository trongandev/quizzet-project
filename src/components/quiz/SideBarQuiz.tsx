"use client";

import { Bot, FileText, Upload, Save, Home, Settings, HelpCircle } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function SideBarQuiz() {
    const menuItems = [
        {
            title: "Trang chủ",
            icon: Home,
            id: "",
        },
        {
            title: "Tạo bằng AI",
            icon: Bot,
            id: "ai-create",
            description: "Ra lệnh cho AI thực hiện",
            isHot: true,
        },
        {
            title: "Nhập từ file",
            icon: Upload,
            id: "file-import",
            description: "Từ docx, xlsx, PDF...",
        },
        {
            title: "Nhập tạo từ đầu",
            icon: FileText,
            id: "manual-create",
            description: "Nhập tay tất cả thông tin",
        },
    ];

    const bottomItems = [
        {
            title: "Cài đặt",
            icon: Settings,
            id: "settings",
        },
        {
            title: "Trợ giúp",
            icon: HelpCircle,
            id: "help",
        },
    ];
    const router = useRouter();

    return (
        <div className="">
            <Sidebar variant="floating" className="mt-20 w-64 h-[calc(100vh-200px)]">
                <SidebarHeader className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Q</span>
                        </div>
                        <span className="font-bold text-lg">QuizMaker</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Tạo Quiz</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton onClick={() => router.push(`/quiz/themcauhoi/${item.id}`)} className="w-full justify-start h-14 px-3">
                                            <item.icon className="mr-2 h-4 w-4" />
                                            <div className="flex flex-col items-start">
                                                <div className="">
                                                    <span>{item.title}</span>
                                                    {item.isHot && <span className="ml-2 text-xs text-red-500 bg-red-100 dark:text-red-200 dark:bg-red-800/50 px-2 animate-bounce rounded">Hot</span>}
                                                </div>
                                                {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => router.push(`/quiz/themcauhoi/drafts`)} className="w-full justify-start h-14 px-3">
                                        <Save className="mr-2 h-4 w-4" />
                                        <div className="flex flex-col items-start">
                                            <span>Nháp</span>
                                            <span className="text-xs text-muted-foreground">Lưu nháp lại các bài quiz </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        {bottomItems.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton onClick={() => router.push(`/quiz/themcauhoi/${bottomItems[1].id}`)}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
