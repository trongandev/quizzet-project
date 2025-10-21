"use client";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/userContext";
import { Toaster } from "sonner";

export default function RootLayout({ children }: any) {
    return (
        <html lang="en">
            <body className="">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <UserProvider>{children}</UserProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
