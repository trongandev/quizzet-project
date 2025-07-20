import "../globals.css"
import Script from "next/script"

import { getCachedDailyTasks } from "@/lib/cacheData"
import LayoutQuizzet from "@/components/LayoutQuizzet"

export default async function RootLayout({ children }: any) {
    const tasks = await getCachedDailyTasks()

    return (
        <html lang="en" suppressHydrationWarning>
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
                <LayoutQuizzet tasks={tasks}>{children}</LayoutQuizzet>
            </body>
        </html>
    )
}
