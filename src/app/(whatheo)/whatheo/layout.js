import "../../globals.css";
import AdminNav from "./AdminNav";
export const metadata = {
    title: "Dashboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={``}>
                <div className="flex bg-gray-200 h-[100vh]">
                    <div className="w-[20%] bg-white border-[1px]">
                        <AdminNav />
                    </div>
                    <div className="w-[80%] bg-white p-5">{children}</div>
                </div>
            </body>
        </html>
    );
}
