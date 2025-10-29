import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowRight, BookOpen, Check, Chrome, Github, Save, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const { user } = useAuth()

    const introductPage = [
        {
            title: 'Flashcard - Học hiệu quả với thẻ nhớ thông minh',
            image: '/intro/intro1.png',
            items: [
                'Tạo flashcard từ vựng đa ngôn ngữ nhanh chóng với sự trợ giúp của AI.',
                'AI tự động điền loại từ, ghi chú và ví dụ sinh động về cách sử dụng.',
                'Tăng cường khả năng ghi nhớ từ vựng với phương pháp học linh hoạt.',
            ],
        },
        {
            title: 'Ôn Tập Flashcard - Khắc Sâu Kiến Thức',
            image: '/intro/intro2.png',
            items: [
                'Cung cấp các tính năng ôn tập đa dạng để ghi nhớ từ vựng hiệu quả.',
                'Phát triển phản xạ nhanh với từ vựng trong các tình huống thực tế.',
                'Theo dõi tiến độ học tập và cải thiện dần khả năng ghi nhớ.',
            ],
        },
        {
            title: 'Chọn Giọng Nói - Cá Nhân Hóa Trải Nghiệm Học Tập',
            image: '/intro/intro3.png',
            items: [
                'Lựa chọn từ nhiều giọng nói khác nhau phù hợp với sở thích học tập.',
                'Cải thiện kỹ năng nghe thông qua các giọng nói đa dạng.',
                'Tạo ra môi trường học tập gần gũi và hấp dẫn hơn.',
            ],
        },
        // {
        //     title: 'Tài Liệu Đề Cương - Kho Tàng Tri Thức Từ Cộng Đồng',
        //     items: [
        //         'Truy cập nguồn tài liệu chuyên ngành phong phú từ cộng đồng.',
        //         'Công cụ hỗ trợ ghi nhớ câu hỏi và đáp án nhanh chóng.',
        //         'Nâng cao khả năng phản xạ trả lời câu hỏi trong các kỳ thi.',
        //     ],
        // },
    ]
    return (
        <div className=" my-5 md:my-10  dark:text-slate-300">
            <div className="space-y-20 w-full md:max-w-7xl mx-auto px-3 md:px-0">
                {import.meta.env.VITE_MAINTAINANCE_MODE === 'true' && (
                    <div className=" font-medium text-center">
                        <h1 className="text-xl md:text-2xl xl:text-4xl">⚠️ Chào bạn, trang web chúng tôi đang bảo trì ⚠️</h1>
                        <p className="mt-5">Chúng tôi đang nỗ lực nâng cấp hệ thống để phục vụ bạn tốt hơn. Cảm ơn bạn đã kiên nhẫn chờ đợi!</p>
                        <p>Quá trình này có thể sẽ mất 2 3 ngày</p>
                        <p className="mt-2">
                            Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email:{' '}
                            <a className="underline text-primary" href="mailto:trongandev@gmail.com">
                                trongandev@gmail.com
                            </a>
                        </p>
                        <p className="mt-2">
                            Hoặc facebook:{' '}
                            <a href="https://www.facebook.com/trongandev" className="underline text-primary">
                                trongandev
                            </a>
                        </p>
                    </div>
                )}
                {import.meta.env.VITE_MAINTAINANCE_MODE === 'false' && (
                    <div className="">
                        <h1 className="text-2xl xl:text-4xl font-bold text-center bg-linear-to-br from-primary/80 to-purple-700/80 dark:from-primary dark:to-purple-500/80 text-transparent bg-clip-text">
                            Quizzet - Nền tảng học tập thông minh cho sinh viên
                        </h1>
                        <p className="mt-3 text-md md:text-lg text-center max-w-6xl mx-auto text-gray-600 dark:text-slate-300">
                            Quizzet là người bạn đồng hành đáng tin cậy trên hành trình học tập của bạn. Với sự hỗ trợ từ công nghệ AI tiên tiến, chúng tôi mang đến cho bạn một trải nghiệm học tập độc
                            đáo và hiệu quả hơn bao giờ hết. Khám phá ngay các tính năng nổi bật của Quizzet để tối ưu hóa quá trình học hỏi và phát triển kiến thức của bạn.
                        </p>
                        <div
                            style={{
                                position: 'relative',
                                paddingBottom: 'calc(50.520833333333336% + 41px)',
                                height: 0,
                                width: '100%',
                            }}
                        >
                            <iframe
                                src="https://demo.arcade.software/VEOX7fL248JaEgeFmRtK?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                                title="Tạo bộ flashcard mới để học từ vựng"
                                loading="lazy"
                                allowFullScreen
                                allow="clipboard-write"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    colorScheme: 'light',
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto space-y-7">
                    {introductPage.map((section, index) => (
                        <div className="flex gap-5 md:gap-32  flex-col md:flex-row" key={index}>
                            <div className="flex-1">
                                <h2 className="text-2xl font-medium mb-5">{section.title}</h2>
                                <ul>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center gap-2 mb-3 text-gray-700 dark:text-slate-300">
                                            <Check size={16} className="text-primary dark:text-blue-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="hidden md:flex bg-gray-300 dark:bg-gray-700 relative w-[400px] h-[350px] items-center justify-center rounded-md">
                                <div className="p-5">
                                    <img src={section.image} alt="" className="object-cover w-full h-full rounded-md" />
                                </div>
                                <div className={`absolute h-full w-20 -left-12 -z-10  ${index % 2 === 0 ? 'triangle-down-shape' : 'triangle-up-shape'}`}></div>
                            </div>
                            <img className="block md:hidden" src={section.image} alt="" />
                        </div>
                    ))}
                </div>
                <div className="mt-10 bg-linear-to-r from-emerald-200/80 to-lime-200/80 dark:from-emerald-800/50 dark:to-lime-800/50 pt-5 rounded-xl shadow-md border border-gray-300 dark:border-white/10 overflow-hidden">
                    <div className="flex items-center justify-center flex-col gap-3  px-3">
                        <Badge className="flex gap-2 items-center bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                            <Chrome />
                            Extension mới
                        </Badge>
                        <h2 className="text-2xl text-center md:text-4xl font-bold text-gray-700 dark:text-gray-200">
                            Học từ vựng thông minh với <span className="text-emerald-600">Extension Dịch Thuật</span>
                        </h2>
                        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
                            Biến việc lướt web thành cơ hội học tập! Dịch từ vựng ngay lập tức và tự động lưu vào flashcard cá nhân.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 md:gap-8 px-5 mt-3">
                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 dark:text-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Dịch Tức Thì</h3>
                                <p className="text-gray-600 dark:text-gray-400">Chỉ cần bôi đen từ vựng, nghĩa tiếng Việt hiện ngay lập tức. Hỗ trợ nhiều ngôn ngữ phổ biến.</p>
                            </CardContent>
                        </Card>

                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 dark:text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Save className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Lưu Từ Thông Minh</h3>
                                <p className="text-gray-600 dark:text-gray-400">Gặp từ hay? Một cú click là lưu ngay! Không bao giờ quên những từ vựng quan trọng nữa.</p>
                            </CardContent>
                        </Card>

                        <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 dark:text-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Flashcard Tự Động</h3>
                                <p className="text-gray-600 dark:text-gray-400">Từ vựng đã lưu tự động chuyển thành flashcard, đồng bộ với tài khoản Quizzet của bạn.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-center">
                        <div className="dark:bg-slate-800/20 mt-5 p-8 text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">Sẵn sàng nâng cao trải nghiệm học từ vựng?</h3>
                            <p className="text-emerald-700 dark:text-emerald-100 mb-6 max-w-2xl mx-auto text-md">
                                Tải extension ngay hôm nay và biến mọi trang web thành lớp học từ vựng của riêng bạn!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="https://github.com/trongandev/translate-quizzet-extension">
                                    <Button
                                        size="lg"
                                        className="bg-white dark:bg-emerald-800/50 dark:text-emerald-200 text-emerald-600 hover:scale-105 transition-transform duration-300 hover:bg-white/90"
                                    >
                                        <Github className="w-5 h-5 mr-2" />
                                        Tải về từ Github
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6 text-emerald-600 dark:text-emerald-100 ">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Miễn phí 100%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Không quảng cáo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm">Đồng bộ tài khoản</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!user && (
                <div className="mt-20 h-72 bg-linear-to-br from-primary/80 to-purple-700/80  flex items-center justify-center flex-col gap-3 text-center md:text-left">
                    <h1 className=" text-2xl md:text-4xl text-white font-bold">Sẵn sàng bắt đầu hành trình học tập?</h1>
                    <p className="text-md md:text-lg text-white/80">Tham gia cộng đồng hơn 300 học viên đang học tập hiệu quả cùng Quizzet</p>
                    <div className="flex items-center gap-5">
                        <Link to="/login" className="block ">
                            <Button className=" h-12 text-xl bg-linear-to-r from-primary/80 to-purple-700/80 dark:text-gray-300">
                                <Zap className=" group-hover:text-yellow-200   rotate-0 group-hover:rotate-180 transition-all duration-300" /> Bắt đầu miễn phí
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
