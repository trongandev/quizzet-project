import React from "react";
import "@/app/globals.css";
import Link from "next/link";
import { DiscordFilled, FacebookFilled, GithubOutlined } from "@ant-design/icons";
export default function CFooter() {
    return (
        <footer className="bg-gray-200/80 dark:bg-gray-900 text-secondary dark:text-white  py-12 pb-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">Q</span>
                            </div>
                            <span className="text-xl font-bold">Quizzet</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Nền tảng học tập thông minh giúp bạn phát triển kiến thức một cách hiệu quả và bền vững.</p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Sản phẩm</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="/flashcard" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Flashcard
                                </a>
                            </li>
                            <li>
                                <a href="/quiz" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Quiz
                                </a>
                            </li>
                            <li>
                                <a href="/decuong" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Đề cương
                                </a>
                            </li>
                            <li>
                                <a href="/congdong" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Cộng đồng
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="/help-center" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Trung tâm trợ giúp
                                </a>
                            </li>

                            <li>
                                <a href="/baoloi" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Báo lỗi
                                </a>
                            </li>
                            <li>
                                <a href="/gopy" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Góp ý
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="https://www.facebook.com/trongandev" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center">
                                    <FacebookFilled /> Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="https://github.com/trongandev" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center">
                                    <GithubOutlined /> Github
                                </Link>
                            </li>
                            <li>
                                <Link href="https://discord.gg/Uy7Kvyy9FC" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center">
                                    <DiscordFilled /> Cộng đồng Discord
                                </Link>
                            </li>
                            <li>
                                <Link href="#" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                                    Về chúng tôi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-400/50 dark:border-gray-800 mt-5 pt-5 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2024 Quizzet. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
