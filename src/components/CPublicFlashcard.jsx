"use client";
import { GET_API } from "@/lib/fetchAPI";
import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { languages } from "@/lib/languageOption";
import Cookies from "js-cookie";
import PublicFC from "./flashcard/PublicFC";
import { BookOpen, Brain, ChevronLeft, ChevronRight, Globe, Plus, RotateCcw, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { CreateFlashcardModal } from "@/components/flashcard/CreateFlashcardModal";
import { Button, buttonVariants } from "@/components/ui/button";
import UserFC from "@/components/flashcard/UserFC";
import Image from "next/image";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "./ui/pagination";
import { cn } from "@/lib/utils";
export default function CPublicFlashCard({ publicFlashcards }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("all");
    const [searchFC, setSearchFC] = useState("");
    const [filterFlashcard, setFilterFlashcard] = useState([]);
    const defaultListFlashCard = { title: "", desc: "", language: "english", public: false };
    const [listFlashCard, setListFlashCard] = useState([]);
    const [newListFlashCard, setNewListFlashCard] = useState(defaultListFlashCard);
    const [tabFlashcard, setTabFlashcard] = useState("my-sets"); // my-sets | community
    const [data, setData] = useState(publicFlashcards);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const totalItems = data?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data?.slice(startIndex, endIndex);

    const displayFC = currentItems;

    const token = Cookies.get("token");
    useEffect(() => {
        setLoading(true);
        if (window.innerWidth < 768) {
            setItemsPerPage(4); // Adjust items per page for mobile view
        } else {
            setItemsPerPage(8); // Default items per page for larger screens
        }
        const fetchListFlashCard = async () => {
            const res = await GET_API("/list-flashcards", token);
            setListFlashCard(res?.listFlashCards);
            setFilterFlashcard(res?.listFlashCards);
            setLoading(false);
        };
        fetchListFlashCard();
    }, [token, publicFlashcards]);

    // Function to fetch paginated public flashcards
    // const fetchPaginatedFlashcards = async (page = 1, search = "", lang = "all") => {
    //     try {
    //         let endpoint = `/public-flashcards?page=${page}&limit=12`;
    //         if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    //         if (lang !== "all") endpoint += `&language=${lang}`;

    //         const res = await GET_API(endpoint);
    //         if (res?.flashcards) {
    //             setFilterLanguage(res.flashcards);
    //             setCurrentPage(res.pagination.currentPage);
    //             setTotalPages(res.pagination.totalPages);
    //             setTotalCount(res.pagination.totalCount);
    //             setHasNext(res.pagination.hasNext);
    //             setHasPrev(res.pagination.hasPrev);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching paginated flashcards:", error);
    //     } finally {
    //         setPaginationLoading(false);
    //     }
    // };

    if (!publicFlashcards && !listFlashCard) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // const handleNavLanguage = (value) => {
    //     setLanguage(value);
    //     if (value === "all") {
    //         setFilterLanguage(publicFlashcards);
    //         return;
    //     }
    //     const filter = publicFlashcards.filter((item) => item.language === value);
    //     setFilterLanguage(filter);
    // };
    const handleSearchFC = (value) => {
        setSearchFC(value);
        const search = publicFlashcards.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
        setCurrentPage(1); // Reset to first page after search
    };

    // Handle language filter for community tab
    const handleLanguageFilter = (langCode) => {
        setLanguage(langCode);
        if (langCode === "all") {
            setData(publicFlashcards);
        } else {
            const filtered = publicFlashcards.filter((item) => item.language === langCode);
            setData(filtered);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className=" py-5 pt-20 flex justify-center items-center">
            <div className="text-third dark:text-white px-3 md:px-0 min-h-screen w-full md:w-[1000px] xl:w-[1200px]">
                <div className="flex flex-col gap-10 ">
                    <div className="">
                        <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Flashcard</h1>
                        <p className="text-center max-w-2xl mx-auto mt-3 text-lg text-gray-600 dark:text-white/60">
                            Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                        <div className="w-full  h-24 px-5 bg-green-300/60 dark:bg-green-800/50 rounded-xl flex items-center justify-between border border-green-500/50  dark:border-white/10 shadow-sm shadow-green-500/50">
                            <div className="">
                                <p className="text-gray-600 dark:text-white/60">Đã học</p>
                                <h3 className="text-3xl font-bold text-slate-700 dark:text-white/80">0</h3>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full">
                                <BookOpen />
                            </div>
                        </div>
                        <div className="w-full h-24 px-5 bg-blue-300/60 dark:bg-blue-800/50 rounded-xl flex items-center justify-between border border-blue-500/50  dark:border-white/10 shadow-sm shadow-blue-500/50">
                            <div className="">
                                <p className="text-gray-600 dark:text-white/60">Đã nhớ</p>
                                <h3 className="text-3xl font-bold text-slate-700 dark:text-white/80">0</h3>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
                                <Brain />
                            </div>
                        </div>
                        <div className="col-span-2 w-full  md:col-span-1 h-24 px-5 bg-red-300/60 dark:bg-red-800/50 rounded-xl flex items-center justify-between border border-red-500/50  dark:border-white/10 shadow-sm shadow-red-500/50">
                            <div className="">
                                <p className="text-gray-600 dark:text-white/60">Cần ôn tập</p>
                                <h3 className="text-3xl font-bold text-slate-700 dark:text-white/80">0</h3>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full">
                                <RotateCcw />
                            </div>
                        </div>
                    </div>
                </div>
                <Tabs defaultValue="my-sets" className="mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-2 rounded-lg shadow-sm border dark:bg-slate-700">
                        <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-gray-100 dark:bg-slate-600">
                            <TabsTrigger
                                value="my-sets"
                                onClick={() => setTabFlashcard("my-sets")}
                                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                Bộ flashcard của tôi
                            </TabsTrigger>
                            <TabsTrigger
                                value="community"
                                onClick={() => setTabFlashcard("community")}
                                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                Khám phá cộng đồng
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center flex-col md:flex-row gap-3">
                            <div className="relative w-full ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Tìm kiếm flashcard..." className="pl-10 w-full md:w-64 " value={searchFC} onChange={handleSearchFC} />
                            </div>
                            <CreateFlashcardModal listFlashCard={listFlashCard} setListFlashCard={setListFlashCard} filterFlashcard={filterFlashcard} setFilterFlashcard={setFilterFlashcard}>
                                <Button className="text-white w-full md:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo mới
                                </Button>
                            </CreateFlashcardModal>
                        </div>
                    </div>
                    <TabsContent value="my-sets">
                        <div>
                            {token !== undefined ? (
                                <div className="mt-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
                                        {filterFlashcard && filterFlashcard.map((item) => <UserFC item={item} key={item._id} />)}
                                        {loading && <Spin indicator={<LoadingOutlined spin />} size="default" className="h-full flex items-center justify-center" />}
                                        {!loading && filterFlashcard?.length <= 0 && <div className="h-[350px] col-span-12 flex items-center justify-center text-gray-700">Không có dữ liệu...</div>}
                                    </div>
                                </div>
                            ) : (
                                <div className=" text-gray-700 mt-10 dark:text-gray-300">Bạn cần đăng nhập để có thể thêm flashcard </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="community">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-700/80 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gray-500" />
                                <span className="font-medium text-gray-700 dark:text-white/80">Lọc theo ngôn ngữ:</span>
                            </div>{" "}
                            <div className="flex flex-wrap gap-2">
                                <Button variant={language === "all" ? "default" : "outline"} size="sm" className="h-8" onClick={() => handleLanguageFilter("all")}>
                                    <Globe className="w-4 h-4 mr-1" /> Tất cả
                                </Button>
                                {languages.map((lang) => (
                                    <Button key={lang.value} variant={language === lang.value ? "default" : "outline"} size="sm" className="h-8" onClick={() => handleLanguageFilter(lang.value)}>
                                        <Image src={`/flag/${lang.value}.svg`} alt="" width={16} height={16} className="mr-1" />
                                        {lang.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-5">
                                {displayFC && displayFC.map((item) => <PublicFC item={item} key={item?._id} />)}

                                {publicFlashcards?.length <= 0 && <div className="h-[350px] col-span-full flex items-center justify-center text-gray-700 dark:text-gray-300">Không có dữ liệu...</div>}
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentPage === 1}
                                                className={cn("gap-1 pl-2.5", buttonVariants({ variant: "ghost" }), currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                                <ChevronLeft className="h-4 w-4" />
                                                <span>Previous</span>
                                            </button>
                                        </PaginationItem>

                                        {getPageNumbers().map((page, index) => (
                                            <PaginationItem key={index}>
                                                {page === "..." ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className={cn(
                                                            buttonVariants({
                                                                variant: currentPage === page ? "outline" : "ghost",
                                                                size: "sm",
                                                            }),
                                                            "cursor-pointer"
                                                        )}
                                                        aria-current={currentPage === page ? "page" : undefined}>
                                                        {page}
                                                    </button>
                                                )}
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <button
                                                onClick={handleNext}
                                                disabled={currentPage === totalPages}
                                                className={cn("gap-1 pr-2.5", buttonVariants({ variant: "ghost" }), currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                                <span>Next</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}{" "}
                            {/* Pagination Info */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} Flashcard | Trang {currentPage} / {totalPages}
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
