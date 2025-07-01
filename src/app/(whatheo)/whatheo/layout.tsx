import { SideBarAdmin } from "@/components/SideBarAdmin";
import "../../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
export const metadata = {
    title: "Dashboard",
};

export default function RootLayout({ children }: any) {
    return (
        <html lang="vi">
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <SideBarAdmin />
                        <main className="flex-1">{children}</main>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
