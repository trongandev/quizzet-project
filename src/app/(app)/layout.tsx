"use client";
import "../globals.css";
import { UserProvider } from "../../context/userContext";
import { SocketProvider } from "../../context/socketContext";
import CHeader from "../../components/CHeader";
import CFooter from "../../components/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { SiQuizlet } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { GiCardPick } from "react-icons/gi";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CShowMessage from "@/components/CShowMessage";

export default function RootLayout({ children }: any) {
    const pathname = usePathname();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        setToken(Cookies.get("token") || null);
    }, []);
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
            </head>
            <UserProvider>
                <SocketProvider>
                    <body className="bg-linear dark:!bg-gray-700">
                        <CHeader token={token || ""} />
                        <div className="flex items-center justify-center relative dark:bg-gray-700 dark:text-white">
                            <div className="w-[800px] md:w-[1000px] xl:w-[1200px] py-5 pt-20">{children}</div>
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
                                        <Link href="/tailieu" className={`flex items-center h-full justify-center ${pathname.startsWith("/tailieu") ? "active" : ""}`}>
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
                                            <GiCardPick size={25} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <CFooter />
                        <Analytics />
                        <GoogleAnalytics gaId="G-L681038P5E" />
                        <SpeedInsights />
                    </body>
                </SocketProvider>
            </UserProvider>
        </html>
    );
}
