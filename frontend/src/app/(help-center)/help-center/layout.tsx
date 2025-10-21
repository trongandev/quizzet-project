import "@/app/globals.css";
export const metadata = {
    title: "Trung tâm trợ giúp Quizzet",
    description:
        "Tìm câu trả lời cho mọi thắc mắc về việc sử dụng Quizzet và các sản phẩm của chúng tôi. Hướng dẫn, mẹo và hỗ trợ từ cộng đồng. Đặt câu hỏi và nhận trợ giúp từ những người dùng khác. Khám phá các bài viết hữu ích và hướng dẫn chi tiết để tối ưu hóa trải nghiệm học tập của bạn trên Quizzet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
