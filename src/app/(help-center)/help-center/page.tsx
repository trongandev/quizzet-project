"use client";

import React, { useState } from "react";
import { Input, Collapse, Card, Button, Form, message, Divider } from "antd";
import {
    SearchOutlined,
    QuestionCircleOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
    NotificationOutlined,
    MailOutlined,
    FileTextOutlined,
    BulbOutlined,
    RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
// import Image from "next/image";

const { Panel } = Collapse;
const { TextArea } = Input;

// FAQ Data
const faqData = [
    {
        key: "account",
        title: "Về tài khoản và đăng nhập",
        icon: <UserOutlined />,
        items: [
            {
                question: "Làm thế nào để tạo tài khoản Quizzet?",
                answer: "Bạn có thể tạo tài khoản bằng cách nhấp vào nút 'Đăng ký' ở góc trên bên phải, sau đó điền thông tin email và mật khẩu. Quizzet cũng hỗ trợ đăng nhập qua Google để thuận tiện hơn.",
                link: "https://quizzet.site/register",
            },
            {
                question: "Tôi quên mật khẩu/tên đăng nhập thì phải làm sao?",
                answer: "Tại trang đăng nhập, nhấp vào 'Quên mật khẩu?' và nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn trong vòng 5-10 phút.",
                link: "https://quizzet.site/forget",
            },
            {
                question: "Làm thế nào để thay đổi thông tin tài khoản?",
                answer: "Vào 'Hồ sơ cá nhân' từ menu người dùng, bạn có thể chỉnh sửa tên hiển thị, avatar, và các thông tin cá nhân khác. Để đổi mật khẩu, vào mục 'Cài đặt bảo mật'.",
                image: "/help-center/profile-setting.png",
            },
            {
                question: "Làm thế nào để xóa tài khoản Quizzet?",
                answer: "Liên hệ với chúng tôi qua email trongandev@gmail.com với tiêu đề 'Yêu cầu xóa tài khoản'. Lưu ý rằng việc này sẽ xóa vĩnh viễn tất cả dữ liệu của bạn và không thể khôi phục.",
                link: "mailto:trongandev@gmail.com",
            },
        ],
    },
    {
        key: "quiz",
        title: "Về tạo Quiz",
        icon: <QuestionCircleOutlined />,
        items: [
            {
                question: "Làm thế nào để tạo một bài Quiz mới?",
                answer: "Vào trang 'Quiz' và nhấp 'Tạo Quiz mới'. Nhập tiêu đề, mô tả, sau đó thêm câu hỏi theo từng câu hoặc sử dụng AI để tạo tự động theo chủ đề.",
            },
            {
                question: "Có những loại câu hỏi nào được hỗ trợ?",
                answer: "Hiện tại Quizzet hỗ trợ câu hỏi trắc nghiệm 4 đáp án (A, B, C, D). Chúng tôi đang phát triển thêm các loại câu hỏi khác như điền từ, đúng/sai trong các phiên bản tương lai.",
            },
            {
                question: "Tính năng 'Tạo Quiz bằng AI theo chủ đề' hoạt động như thế nào?",
                answer: "Chỉ cần nhập chủ đề mong muốn (ví dụ: 'Lịch sử Việt Nam', 'Toán lớp 10'), AI sẽ tự động tạo ra bộ câu hỏi phù hợp với độ khó và số lượng bạn chọn.",
            },
            {
                question: "Tính năng import file .docx/.xlsx sẽ ra mắt khi nào?",
                answer: "Tính năng này đang trong giai đoạn phát triển và dự kiến ra mắt trong Q2/2025. Bạn sẽ có thể import câu hỏi trực tiếp từ file Word/Excel.",
            },
        ],
    },
    {
        key: "flashcard",
        title: "Về Flashcard",
        icon: <BookOutlined />,
        items: [
            {
                question: "Làm thế nào để tạo một bộ Flashcard mới?",
                answer: "Vào mục 'Flashcard', nhấp 'Tạo bộ thẻ mới', đặt tên và chọn ngôn ngữ. Bạn có thể thêm từ thủ công hoặc sử dụng AI để tạo tự động từ danh sách từ vựng.",
            },
            {
                question: "AI hỗ trợ tạo Flashcard như thế nào?",
                answer: "Khi nhập một từ, AI sẽ tự động tạo: định nghĩa, phiên âm, loại từ, ví dụ câu, và ghi chú. Bạn cũng có thể sử dụng tính năng text-to-speech để nghe phát âm chuẩn.",
            },
            {
                question: "Có bao nhiêu chế độ luyện tập Flashcard?",
                answer: "Quizzet cung cấp 4 chế độ: 1) Flashcard truyền thống (lật thẻ), 2) Quiz trắc nghiệm, 3) Listening (nghe và chọn), 4) Fill Blank (điền từ còn thiếu).",
            },
            {
                question: "Tôi có thể theo dõi tiến độ học không?",
                answer: "Có! Hệ thống sẽ tự động theo dõi tiến độ học của bạn dựa trên đường cong lãng quên Ebbinghaus, phân loại từ thành: đã học, đã nhớ, cần ôn tập.",
            },
        ],
    },
    {
        key: "subject",
        title: "Về Subject Outline (Đề cương môn học)",
        icon: <FileTextOutlined />,
        items: [
            {
                question: "Làm thế nào để tìm kiếm đề cương môn học?",
                answer: "Sử dụng thanh tìm kiếm trong mục 'Đề cương' với từ khóa tên môn học, trường đại học, hoặc mã môn học. Bạn có thể lọc theo ngành, khóa học để tìm chính xác hơn.",
            },
            {
                question: "Làm thế nào để chia sẻ đề cương của tôi?",
                answer: "Nhấp 'Đóng góp đề cương', upload file PDF/Word và điền thông tin môn học. Sau khi được duyệt, đề cương sẽ xuất hiện trong thư viện chung.",
            },
            {
                question: "Có thể chuyển đổi đề cương thành Flashcard không?",
                answer: "Có! Sử dụng tính năng 'Tạo Flashcard từ đề cương' - AI sẽ phân tích nội dung và tự động tạo bộ thẻ học tập từ các khái niệm quan trọng.",
            },
        ],
    },
    {
        key: "general",
        title: "Về sử dụng nền tảng chung",
        icon: <SettingOutlined />,
        items: [
            {
                question: "Quizzet có hỗ trợ trên thiết bị di động không?",
                answer: "Có! Quizzet được thiết kế responsive, hoạt động mượt mà trên mọi thiết bị: máy tính, tablet, điện thoại. Chúng tôi cũng đang phát triển ứng dụng mobile native.",
            },
            {
                question: "Tôi gặp lỗi khi sử dụng thì phải làm sao?",
                answer: "Hãy thử làm mới trang (F5) hoặc xóa cache trình duyệt. Nếu vẫn lỗi, liên hệ với chúng tôi qua form hỗ trợ bên dưới với mô tả chi tiết lỗi.",
            },
            {
                question: "Quizzet có miễn phí không?",
                answer: "Quizzet hoàn toàn miễn phí cho tất cả tính năng cơ bản. Chúng tôi có kế hoạch ra mắt gói Premium với các tính năng nâng cao trong tương lai.",
            },
        ],
    },
];

// Quick guides data
const quickGuides = [
    {
        title: "Hướng dẫn tạo Quiz với AI",
        description: "Học cách sử dụng AI để tạo bài quiz chất lượng trong 5 phút",
        link: "#",
        icon: <QuestionCircleOutlined />,
    },
    {
        title: "Luyện tập Flashcard hiệu quả",
        description: "Tối ưu hóa việc học từ vựng với 4 chế độ luyện tập",
        link: "#",
        icon: <BookOutlined />,
    },
    {
        title: "Quản lý tài khoản và hồ sơ",
        description: "Cài đặt và cá nhân hóa trải nghiệm học tập của bạn",
        link: "#",
        icon: <UserOutlined />,
    },
    {
        title: "Xử lý lỗi thường gặp",
        description: "Giải quyết các vấn đề phổ biến khi sử dụng Quizzet",
        link: "#",
        icon: <SettingOutlined />,
    },
];

export default function HelpCenter() {
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // Filter FAQ based on search term
    const filteredFaqData = faqData
        .map((category) => ({
            ...category,
            items: category.items.filter((item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase())),
        }))
        .filter((category) => category.items.length > 0);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleContactSubmit = async (values: any) => {
        try {
            // Here you would typically send the form data to your backend
            console.log("Contact form submitted:", values);
            messageApi.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.");
            form.resetFields();
        } catch (error) {
            console.error("Contact form error:", error);
            messageApi.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trung tâm trợ giúp Quizzet</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Tìm câu trả lời cho mọi thắc mắc về việc sử dụng Quizzet</p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <Input
                                size="large"
                                placeholder="Tìm kiếm câu hỏi, tính năng hoặc hướng dẫn..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Quick Guides */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hướng dẫn nhanh</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickGuides.map((guide, index) => (
                                <Card key={index} hoverable className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg">
                                    <div className="text-center">
                                        <div className="text-3xl text-blue-500 mb-4">{guide.icon}</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{guide.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{guide.description}</p>
                                        <Button type="link" className="mt-3 p-0">
                                            Xem hướng dẫn <RightOutlined className="text-xs" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Câu hỏi thường gặp (FAQ)</h2>{" "}
                        {filteredFaqData.length > 0 ? (
                            <div className="space-y-6">
                                {filteredFaqData.map((category) => (
                                    <Card key={category.key} className="shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <div className="text-blue-500 text-xl mr-3">{category.icon}</div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                                        </div>

                                        <Collapse ghost size="large" expandIconPosition="end">
                                            {category.items.map((item, index) => (
                                                <Panel header={<span className="font-medium text-gray-800 dark:text-gray-200">{item.question}</span>} key={`${category.key}-${index}`}>
                                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                                                    {/* {item.link && (
                                                        <Link href={item.link} className="mt-2">Hoặc bấm vào đây</Link>)}
                                                    {item.image && (
                                                        <div>
                                                            <Image src={item.image} alt="Tutorial" className="object-cover" width={500} height={350} ></Image>

                                                        </div>
                                                    )} */}
                                                </Panel>
                                            ))}
                                        </Collapse>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <div className="text-gray-400 text-4xl mb-4">
                                    <SearchOutlined />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-gray-600 dark:text-gray-300">Thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ</p>
                            </Card>
                        )}
                    </div>

                    {/* Updates & Announcements */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            <NotificationOutlined className="mr-2" />
                            Thông báo và cập nhật
                        </h2>
                        <div className="space-y-4">
                            <Card className="border-l-4 border-l-blue-500">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-4">
                                        <BulbOutlined className="text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tính năng mới: Luyện tập Flashcard theo khoa học</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Dựa trên đường cong lãng quên Ebbinghaus để tối ưu hóa việc ghi nhớ</p>
                                        <span className="text-xs text-gray-500">19/06/2025</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <div className="flex items-start">
                                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-4">
                                        <SettingOutlined className="text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cải thiện hiệu suất hệ thống</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Tăng tốc độ tải trang và cải thiện trải nghiệm người dùng</p>
                                        <span className="text-xs text-gray-500">15/06/2025</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <Card
                            title={
                                <span className="flex items-center">
                                    <MailOutlined className="mr-2" />
                                    Liên hệ hỗ trợ
                                </span>
                            }>
                            <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
                                <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
                                    <Input placeholder="Nhập họ và tên của bạn" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email!" },
                                        { type: "email", message: "Email không hợp lệ!" },
                                    ]}>
                                    <Input placeholder="email@example.com" />
                                </Form.Item>

                                <Form.Item name="subject" label="Chủ đề" rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}>
                                    <Input placeholder="Mô tả ngắn gọn vấn đề của bạn" />
                                </Form.Item>

                                <Form.Item name="message" label="Mô tả chi tiết" rules={[{ required: true, message: "Vui lòng mô tả vấn đề!" }]}>
                                    <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block size="large">
                                        Gửi yêu cầu hỗ trợ
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>

                        <Card title="Thông tin liên hệ khác" className="h-fit">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Email hỗ trợ</h4>
                                    <p className="text-blue-500">support@quizzet.com</p>
                                </div>

                                <Divider />

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Thời gian hỗ trợ</h4>
                                    <p className="text-gray-600 dark:text-gray-300">Thứ 2 - Chủ nhật: 8:00 - 22:00 (GMT+7)</p>
                                </div>

                                <Divider />

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Thời gian phản hồi</h4>
                                    <p className="text-gray-600 dark:text-gray-300">Thường trong vòng 24 giờ</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Legal Links */}
                    <Card title="Chính sách và điều khoản">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href="/privacy-policy"
                                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <FileTextOutlined className="text-blue-500 mr-3" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Chính sách bảo mật</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Cách chúng tôi bảo vệ dữ liệu của bạn</p>
                                </div>
                            </Link>

                            <Link
                                href="/terms-of-service"
                                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <FileTextOutlined className="text-blue-500 mr-3" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Điều khoản dịch vụ</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Quy định sử dụng nền tảng</p>
                                </div>
                            </Link>

                            <Link
                                href="/copyright-policy"
                                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <FileTextOutlined className="text-blue-500 mr-3" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Chính sách bản quyền</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Về nội dung và sở hữu trí tuệ</p>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
