import { SideBarAdmin } from "@/components/SideBarAdmin"
import "../../globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
export const metadata = {
    title: "Dashboard",
}

export default function RootLayout({ children }: any) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <SideBarAdmin />
                        <main className="flex-1">{children}</main>
                        <Toaster />
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
