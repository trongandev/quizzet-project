import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function HelpCenterPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Trợ giúp</h1>
                </div>
                <p className="text-muted-foreground">Hỗ trợ các phương pháp thực hiện trong quá trình tạo bằng AI</p>
            </div>
        </div>
    );
}
