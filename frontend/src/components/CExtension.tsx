"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Languages, BookOpen, Star, Download, Chrome, ChromeIcon as Firefox, Shield, Users, Brain, MousePointer, Save, FolderSyncIcon as Sync, Play, CheckCircle, Globe, Sparkles } from "lucide-react";
import Image from "next/image";
import CFooter from "./Footer";

export default function TranslationExtensionLanding() {
    const [activeDemo, setActiveDemo] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <Languages className="w-8 h-8 text-blue-600" />,
            title: "Dịch thuật tức thì",
            description: "Dịch từ vựng ngay lập tức chỉ với một cú click hoặc hover chuột",
            color: "bg-blue-50 border-blue-200",
        },
        {
            icon: <Save className="w-8 h-8 text-green-600" />,
            title: "Lưu từ thông minh",
            description: "Lưu từ vựng hay ho khi lướt web với một cú click đơn giản",
            color: "bg-green-50 border-green-200",
        },
        {
            icon: <Sync className="w-8 h-8 text-purple-600" />,
            title: "Đồng bộ Flashcard",
            description: "Tự động đồng bộ với tài khoản và tạo flashcard để ôn tập",
            color: "bg-purple-50 border-purple-200",
        },
    ];

    const stats = [
        { number: "500K+", label: "Người dùng", icon: <Users className="w-6 h-6" /> },
        { number: "50M+", label: "Từ đã dịch", icon: <Languages className="w-6 h-6" /> },
        { number: "10M+", label: "Flashcard tạo", icon: <BookOpen className="w-6 h-6" /> },
        { number: "4.9/5", label: "Đánh giá", icon: <Star className="w-6 h-6" /> },
    ];

    const demoSteps = [
        {
            title: "Bước 1: Chọn từ",
            description: "Chỉ cần bôi đen từ bạn muốn dịch",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
        },
        {
            title: "Bước 2: Dịch tức thì",
            description: "Extension hiển thị nghĩa ngay lập tức",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        },
        {
            title: "Bước 3: Lưu vào Flashcard",
            description: "Một click để lưu vào bộ flashcard cá nhân",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
        },
    ];

    const testimonials = [
        {
            name: "Nguyễn Minh Anh",
            role: "Sinh viên",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            content: "Extension này đã thay đổi cách tôi học tiếng Anh. Việc lưu từ vựng trở nên dễ dàng và tự động!",
            rating: 5,
        },
        {
            name: "Trần Văn Hùng",
            role: "Lập trình viên",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            content: "Tuyệt vời cho việc đọc tài liệu kỹ thuật. Dịch nhanh và chính xác, lưu từ rất tiện lợi.",
            rating: 5,
        },
        {
            name: "Lê Thị Mai",
            role: "Giáo viên",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            content: "Công cụ hoàn hảo cho việc chuẩn bị bài giảng. Flashcard tự động giúp tôi tiết kiệm rất nhiều thời gian.",
            rating: 5,
        },
    ];

    const browsers = [
        { name: "Chrome", icon: <Chrome className="w-8 h-8" />, users: "400K+", color: "text-blue-600" },
        { name: "Firefox", icon: <Firefox className="w-8 h-8" />, users: "80K+", color: "text-orange-600" },
        { name: "Edge", icon: <Globe className="w-8 h-8" />, users: "20K+", color: "text-green-600" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Languages className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quiz Translate</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Tính năng
                            </a>
                            <a href="#demo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Demo
                            </a>
                            <a href="#reviews" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Đánh giá
                            </a>
                            <a href="#download" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Tải về
                            </a>
                        </nav>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Cài đặt ngay
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`space-y-8 ${isVisible ? "animate-in slide-in-from-left duration-1000" : "opacity-0"}`}>
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Extension #1 về dịch thuật
                                </Badge>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                    Dịch & Học từ vựng <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">thông minh</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Extension dịch thuật tức thì và lưu từ vựng tự động vào flashcard. Biến việc lướt web thành trải nghiệm học tập hiệu quả!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 text-white">
                                    <Download className="w-5 h-5 mr-2" />
                                    Tải miễn phí
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                                    <Play className="w-5 h-5 mr-2" />
                                    Xem demo
                                </Button>
                            </div>

                            <div className="flex items-center space-x-8 pt-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">500K+ người dùng tin tưởng</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">4.9/5 đánh giá</span>
                                </div>
                            </div>
                        </div>

                        <div className={`relative ${isVisible ? "animate-in slide-in-from-right duration-1000" : "opacity-0"}`}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                                    <div className="space-y-6">
                                        {/* Browser mockup */}
                                        <div className="bg-gray-100 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500">example.com/article</div>
                                            </div>
                                            <div className="bg-white rounded p-4 space-y-3">
                                                <p className="text-gray-800">
                                                    The word{" "}
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded relative cursor-pointer">
                                                        &quot;serendipity&quot;
                                                        <div className="absolute top-full left-0 mt-2 bg-gray-900 text-white p-3 rounded-lg shadow-lg z-10 w-64">
                                                            <div className="text-sm">
                                                                <div className="font-semibold">serendipity</div>
                                                                <div className="text-gray-300">/ˌserənˈdipədē/</div>
                                                                <div className="mt-2">sự tình cờ may mắn</div>
                                                                <Button size="sm" className="mt-2 w-full bg-blue-600 hover:bg-blue-700">
                                                                    <Save className="w-4 h-4 mr-2" />
                                                                    Lưu vào Flashcard
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </span>{" "}
                                                    means finding something good without looking for it.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Flashcard preview */}
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900">Flashcard mới được tạo</h3>
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="text-lg font-semibold text-gray-900">serendipity</div>
                                                <div className="text-gray-600">sự tình cờ may mắn</div>
                                                <div className="text-sm text-gray-500 mt-2">Đã lưu vào bộ &quot;Từ vựng hàng ngày&quot;</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-fit">
                                    <div className="text-blue-600">{stat.icon}</div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn <span className="text-blue-600">TranslateX</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kết hợp hoàn hảo giữa dịch thuật tức thì và học từ vựng thông minh</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <Card key={index} className={`${feature.color} border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}>
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 p-4 bg-white rounded-full w-fit group-hover:scale-110 transition-transform">{feature.icon}</div>
                                    <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-700 leading-relaxed text-center">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Detailed Features */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <MousePointer className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dịch bằng hover</h3>
                                        <p className="text-gray-600">Chỉ cần di chuột qua từ để xem nghĩa ngay lập tức</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Brain className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI thông minh</h3>
                                        <p className="text-gray-600">Nhận diện ngữ cảnh để đưa ra bản dịch chính xác nhất</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Shield className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
                                        <p className="text-gray-600">Dữ liệu được mã hóa và không thu thập thông tin cá nhân</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="relative">
                            <Image
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                                alt="Extension features"
                                width={200}
                                height={50}
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl"></div>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            {/* <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Cách hoạt động</h2>
                        <p className="text-xl text-gray-600">Chỉ 3 bước đơn giản để bắt đầu học từ vựng</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {demoSteps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="relative mb-6 h-64 w-64">
                                    <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="absolute w-full h-64 object-cover rounded-2xl shadow-lg" />
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Testimonials */}
            {/* <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Người dùng nói gì?</h2>
                        <p className="text-xl text-gray-600">Hơn 500,000 người dùng tin tưởng TranslateX</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                                    <div className="flex items-center space-x-3">
                                        <Image src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Browser Support */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Hỗ trợ mọi trình duyệt</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {browsers.map((browser, index) => (
                            <div key={index} className="flex flex-col items-center space-y-4">
                                <div className={`p-4 rounded-full bg-gray-50 ${browser.color}`}>{browser.icon}</div>
                                <div>
                                    <div className="font-semibold text-gray-900">{browser.name}</div>
                                    <div className="text-sm text-gray-600">{browser.users} người dùng</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng nâng cao trình độ từ vựng?</h2>
                    <p className="text-xl mb-8 opacity-90">Tải TranslateX miễn phí và bắt đầu học từ vựng thông minh ngay hôm nay</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                            <Chrome className="w-5 h-5 mr-2" />
                            Tải cho Chrome
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                            <Firefox className="w-5 h-5 mr-2" />
                            Tải cho Firefox
                        </Button>
                    </div>
                    <p className="text-sm opacity-75">✓ Miễn phí hoàn toàn ✓ Không quảng cáo ✓ Bảo mật tuyệt đối</p>
                </div>
            </section>

            {/* Footer */}
            <CFooter />
        </div>
    );
}
