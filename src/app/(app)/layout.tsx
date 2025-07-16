"use client"
import "../globals.css"
import { UserProvider } from "../../context/userContext"
import { SocketProvider } from "../../context/socketContext"
import CHeader from "../../components/CHeader"
import CFooter from "../../components/Footer"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"
import { SiQuizlet } from "react-icons/si"
import { FaPeopleGroup } from "react-icons/fa6"
import { AiFillHome } from "react-icons/ai"
import { FaFileAlt } from "react-icons/fa"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FaRegCreditCard } from "react-icons/fa"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({ children }: any) {
    const pathname = usePathname()

    return (
        <html lang="en">
            <head>
                <Script
                    id="hotjar"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: ` (function (c, s, q, u, a, r, e) {
        c.hj=c.hj||function(){(c.hj.q=c.hj.q||[]).push(arguments)};
        c._hjSettings = { hjid: a };
        r = s.getElementsByTagName('head')[0];
        e = s.createElement('script');
        e.async = true;
        e.src = q + c._hjSettings.hjid + u;
        r.appendChild(e);
    })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', 5301586);`,
                    }}
                />

                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-L681038P5E"></Script>
                <meta name="google-site-verification" content="DuQVeLh37iTPFVESiVVs5Fh5B-cbES9nd2xKpCWXqCA" />
                <Script defer src="https://cloud.umami.is/script.js" data-website-id="01e0d2d3-5b2d-460e-b7e0-b3dff7bc0294"></Script>
            </head>
            <body className="bg-gray-200">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <UserProvider>
                        <SocketProvider>
                            <CHeader />
                            <div className=" relative dark:bg-gray-700 dark:text-white">
                                <TooltipProvider>
                                    <div className="">{children}</div>
                                </TooltipProvider>
                                <Toaster />
                                <div className="fixed bottom-0 bg-gray-100 dark:bg-slate-800/90 dark:text-white  text-black h-[48px] w-full block md:hidden z-10">
                                    <ul className="flex h-full">
                                        <li className="flex-1">
                                            <Link href="/" className={`flex items-center h-full justify-center ${pathname == "/" ? "active" : ""}`}>
                                                <AiFillHome size={25} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/quiz" className={`flex items-center h-full justify-center ${pathname.startsWith("/quiz") ? "active" : ""}`}>
                                                <SiQuizlet size={21} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/decuong" className={`flex items-center h-full justify-center ${pathname.startsWith("/decuong") ? "active" : ""}`}>
                                                <FaFileAlt size={22} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/congdong" className={`flex items-center h-full justify-center ${pathname.startsWith("/congdong") ? "active" : ""}`}>
                                                <FaPeopleGroup size={25} />
                                            </Link>
                                        </li>
                                        <li className="flex-1">
                                            <Link href="/flashcard" className={`flex items-center h-full justify-center ${pathname.startsWith("/flashcard") ? "active" : ""}`}>
                                                <FaRegCreditCard size={25} />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <CFooter />
                        </SocketProvider>
                    </UserProvider>
                    <Analytics />
                    <GoogleAnalytics gaId="G-L681038P5E" />
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    )
}
