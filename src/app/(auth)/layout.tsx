import "../globals.css";

export const metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập để trải nghiệm Quizzet tốt hơn nhé",
};

export default function RootLayout({ children }: any) {
    return (
        <html lang="en" className="h-screen flex items-center justify-center bg-linear">
            <body className="">{children}</body>
        </html>
    );
}
