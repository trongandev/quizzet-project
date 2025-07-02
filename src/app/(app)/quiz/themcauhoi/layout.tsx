"use client";
import { AICreateView } from "@/components/quiz/AICreateView";
import { DraftsView } from "@/components/quiz/DrawView";
import { FileImportView } from "@/components/quiz/FileImportView";
import { HomeView } from "@/components/quiz/HomeView";
import { ManualCreateView } from "@/components/quiz/ManualCreateView";
import { SideBarQuiz } from "@/components/quiz/SideBarQuiz";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
export default function RootLayout({ children }: any) {
    const [activeView, setActiveView] = useState("home");

    const renderContent = () => {
        switch (activeView) {
            case "home":
                return <HomeView onViewChange={setActiveView} />;
            case "ai-create":
                return <AICreateView onViewChange={setActiveView} />;
            case "file-import":
                return <FileImportView onViewChange={setActiveView} />;
            case "manual-create":
                return <ManualCreateView />;
            case "drafts":
                return <DraftsView onViewChange={setActiveView} />;
            case "settings":
                return (
                    <div className="p-6 text-center">
                        <h1 className="text-2xl font-bold">Cài đặt</h1>
                        <p className="text-muted-foreground mt-2">Trang cài đặt đang được phát triển...</p>
                    </div>
                );
            case "help":
                return (
                    <div className="p-6 text-center">
                        <h1 className="text-2xl font-bold">Trợ giúp</h1>
                        <p className="text-muted-foreground mt-2">Trang trợ giúp đang được phát triển...</p>
                    </div>
                );
            default:
                return <HomeView onViewChange={setActiveView} />;
        }
    };
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <SideBarQuiz activeView={activeView} onViewChange={setActiveView} />
                <SidebarInset className="flex-1">
                    <main className="flex-1 overflow-auto py-20 !bg-transparent">{renderContent()}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
