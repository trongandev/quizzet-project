import { Toaster } from 'sonner'

export default function AuthLayout({ children }: any) {
    return (
        <html lang="en">
            <body className="min-h-screen flex items-center justify-center dark:bg-slate-700/30 bg-white w-full ">{children}</body>
            <Toaster />
        </html>
    )
}
