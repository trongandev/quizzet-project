import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { Toaster } from "sonner";

export const metadata = {
    title: "Quizzet - Đăng nhập",
    description: "Đăng nhập để trải nghiệm Quizzet tốt hơn nhé",
    openGraph: {
        title: `Quizzet | Đăng nhập`,
        description: `Đăng nhập để trải nghiệm Quizzet tốt hơn nhé`,
        type: "website",
        images: "/login.png",
        url: "https://quizzet.site/login",
    },
};

export default function RootLayout({ children }: any) {
    return (
        <html lang="en">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <body className="min-h-screen flex items-center justify-center dark:bg-slate-700/30 bg-white w-full ">{children}</body>
                <Toaster />
            </ThemeProvider>
        </html>
    );
}
