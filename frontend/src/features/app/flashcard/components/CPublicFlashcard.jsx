'use client'
import { GET_API } from '@/lib/fetchAPI'
import React, { useCallback, useEffect, useState } from 'react'
import { languages } from '@/lib/languageOption'
import Cookies from 'js-cookie'
import PublicFC from './PublicFC'
import { Eye, Globe, Info, Plus, Search, Users, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '../ui/input'
import { CreateFlashcardModal } from '@/components/flashcard/CreateFlashcardModal'
import { Button } from '@/components/ui/button'
import UserFC from '@/components/flashcard/UserFC'
import Loading from '../ui/loading'
import CDataWordsFC from './CDataWordsFC'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import PaginationUI from '@/components/PaginationUI'
import { useRouter, useSearchParams } from 'next/navigation'
export default function CPublicFlashCard({ publicFlashcards, summary }) {
    const navigate = useNavigate()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [language, setLanguage] = useState('all')
    const [searchFC, setSearchFC] = useState('')
    const [filterFlashcard, setFilterFlashcard] = useState([])
    const [listFlashCard, setListFlashCard] = useState([])
    const [successFC, setSuccessFC] = useState([])
    const [tabFlashcard, setTabFlashcard] = useState(searchParams.get('tab') || 'my-sets') // my-sets | community | success-fc
    const [data, setData] = useState(publicFlashcards)
    // Pagination states
    const [currentPage, setCurrentPage] = useState(searchParams.get('page') || 1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const totalItems = data?.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = data?.slice(startIndex, endIndex)
    const displayFC = currentItems
    const [isOpen, setIsOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('tutorialFC', 'true') // Lưu trạng thái đã xem
    }

    const filterData = useCallback(
        (langCode, searchValue, flashcards = publicFlashcards) => {
            let filtered = flashcards

            // Apply language filter
            if (langCode !== 'all') {
                filtered = filtered.filter((item) => item.language === langCode)
            }

            // Apply search filter
            if (searchValue.trim()) {
                filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
            }

            return filtered
        },
        [publicFlashcards]
    )
    const updateURL = useCallback(
        (tab, page, lang, search) => {
            if (tab !== 'community') {
                // ✅ Nếu không phải community tab, chỉ set tab
                const params = new URLSearchParams()
                params.set('tab', tab)
                router.replace(`/flashcard?${params.toString()}`, { scroll: false })
                return
            }
            const params = new URLSearchParams()
            params.set('tab', tab)
            params.set('page', page.toString())

            if (lang !== 'all') {
                params.set('language', lang)
            }
            if (search.trim()) {
                params.set('search', search)
            }

            router.replace(`/flashcard?${params.toString()}`, { scroll: false })
        },
        [router]
    )

    const handleTabChange = (newTab) => {
        setTabFlashcard(newTab)
        setCurrentPage(1) // Reset về trang 1 khi đổi tab
        updateURL(newTab, 1, language, searchFC)
    }

    // ✅ Handle page change với URL update
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        updateURL(tabFlashcard, newPage, language, searchFC)
    }

    // ✅ Sync với URL params khi component mount
    useEffect(() => {
        const urlTab = searchParams.get('tab')
        const urlPage = searchParams.get('page')
        const urlLanguage = searchParams.get('language')
        const urlSearch = searchParams.get('search')

        // ✅ Chỉ update state, không gọi filter functions
        if (urlTab && urlTab !== tabFlashcard) {
            setTabFlashcard(urlTab)
        }
        if (urlPage && parseInt(urlPage) !== currentPage) {
            setCurrentPage(parseInt(urlPage))
        }
        if (urlLanguage && urlLanguage !== language) {
            setLanguage(urlLanguage)
        }
        if (urlSearch && urlSearch !== searchFC) {
            setSearchFC(urlSearch)
        }
    }, [searchParams])

    useEffect(() => {
        if (tabFlashcard === 'community') {
            const filtered = filterData(language, searchFC)
            setData(filtered)
        }
    }, [language, searchFC, tabFlashcard, publicFlashcards, filterData])

    // ✅ Handle language filter với URL update
    const handleLanguageFilter = (langCode) => {
        setLanguage(langCode)
        setCurrentPage(1) // Reset về trang 1

        if (langCode === 'all') {
            setData(publicFlashcards)
        } else {
            const filtered = publicFlashcards.filter((item) => item.language === langCode)
            setData(filtered)
        }

        updateURL(tabFlashcard, 1, langCode, searchFC)
    }

    // ✅ Handle search với URL update
    const handleSearchFC = (value) => {
        setSearchFC(value)
        setCurrentPage(1) // Reset về trang 1

        if (tabFlashcard === 'community') {
            const search = publicFlashcards.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
            setData(search)
        } else {
            const search = listFlashCard.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
            setFilterFlashcard(search)
        }

        updateURL(tabFlashcard, 1, language, value)
    }

    useEffect(() => {
        const tutorialFC = localStorage.getItem('tutorialFC')
        if (!tutorialFC) {
            setIsOpen(true)
        }
    }, [])

    const token = Cookies.get('token')
    useEffect(() => {
        setLoading(true)
        if (window.innerWidth < 768) {
            setItemsPerPage(4) // Adjust items per page for mobile view
        } else {
            setItemsPerPage(8) // Default items per page for larger screens
        }
        const fetchListFlashCard = async () => {
            const res = await GET_API('/list-flashcards', token)
            setFilterFlashcard(res?.listFlashCards)
            setListFlashCard(res?.listFlashCards)
            const filterIsSuccess = res?.listFlashCards?.filter((item) => item.isSuccess === true)
            setSuccessFC(filterIsSuccess)
            setLoading(false)
        }
        fetchListFlashCard()
    }, [token, publicFlashcards])

    return (
        <div className=" py-5 pt-20 flex justify-center items-center">
            <div className="text-third dark:text-white px-3 md:px-0 min-h-screen w-full md:w-[1000px] xl:w-[1200px]">
                <div className="flex flex-col gap-10">
                    <div className="relative">
                        <h1 className="text-center text-4xl font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Flashcard</h1>

                        <p className="text-center max-w-2xl mx-auto mt-3 text-lg text-gray-600 dark:text-white/60">
                            Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng. Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!
                        </p>
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger>
                                <Button size="sm" className="dark:text-white absolute right-0 top-0 mt-2 mr-2" variant="secondary">
                                    <Info />
                                    <p className="hidden md:block"> Hướng dẫn</p>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-6xl">
                                <div
                                    style={{
                                        position: 'relative',
                                        paddingBottom: 'calc(50.520833333333336% + 41px)',
                                        height: 0,
                                        width: '100%',
                                    }}
                                >
                                    <iframe
                                        src="https://demo.arcade.software/A449C0bQB21B0b7c2r6C?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                                        title="Tạo bộ flashcard mới để học từ vựng"
                                        frameBorder="0"
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
                                <AlertDialogFooter>
                                    <AlertDialogAction className="text-white" onClick={handleClose}>
                                        <X /> Đóng
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    {/* Statistics Cards with Dynamic Layout */}
                    {token && listFlashCard && listFlashCard.length > 0 && <CDataWordsFC summary={summary} />}
                </div>
                <Tabs defaultValue="my-sets" className="mt-8" value={tabFlashcard} onValueChange={handleTabChange}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-gray-100 dark:bg-slate-600">
                            <TabsTrigger value="my-sets" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block"> Bộ flashcard của tôi</span>
                                <span className="block md:hidden"> Của tôi</span>
                            </TabsTrigger>
                            <TabsTrigger value="community" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block">Khám phá cộng đồng</span>
                                <span className="block md:hidden"> Cộng đồng</span>
                            </TabsTrigger>
                            <TabsTrigger value="success-fc" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block"> Bộ thẻ đã học xong</span>
                                <span className="block md:hidden"> Đã học xong</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center flex-col md:flex-row gap-3">
                            <div className="relative w-full ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Tìm kiếm flashcard..." className="pl-10 w-full md:w-64 " value={searchFC} onChange={(e) => handleSearchFC(e.target.value)} />
                            </div>
                            <CreateFlashcardModal
                                open={open}
                                setOpen={setOpen}
                                listFlashCard={listFlashCard}
                                setListFlashCard={setListFlashCard}
                                filterFlashcard={filterFlashcard}
                                setFilterFlashcard={setFilterFlashcard}
                                setTabFlashcard={setTabFlashcard}
                            >
                                <Button className="text-white w-full md:w-auto" disabled={token === undefined}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo bộ flashcard mới
                                </Button>
                            </CreateFlashcardModal>
                        </div>
                    </div>
                    <TabsContent value="my-sets">
                        <div>
                            {token !== undefined ? (
                                <div className="mt-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ">
                                        {filterFlashcard && filterFlashcard.map((item) => <UserFC item={item} key={item._id} token={token} />)}
                                        {loading && (
                                            <div className="flex items-center justify-center col-span-4 h-[500px]">
                                                <Loading className="h-12 w-12" />{' '}
                                            </div>
                                        )}
                                        {token && !loading && listFlashCard?.length === 0 && (
                                            <div className="h-[350px] col-span-12 flex items-center justify-center flex-col gap-3">
                                                <p className="dark:text-gray-400">Bạn chưa tạo bộ flashcard nào :(</p>
                                                <Button className="text-white" onClick={() => setOpen(true)}>
                                                    <Plus />
                                                    Tạo bộ flashcard mới thôi!
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className=" text-gray-700 mt-10 dark:text-gray-300 h-[350px] flex flex-col gap-3 items-center justify-center">
                                    <p>Bạn cần đăng nhập để có thể thêm flashcard hoặc</p>
                                    <Button className="dark:text-white" onClick={() => setTabFlashcard('community')} variant="secondary">
                                        <Users className="h-4 w-4" /> Xem tab cộng đồng của chúng tôi
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="community">
                        <div className="flex items-center flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-700/80 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Globe className="w-5 h-5 " />
                                <span className="font-medium text-gray-700 dark:text-white/80">Lọc theo ngôn ngữ:</span>
                            </div>{' '}
                            <div className="flex flex-wrap gap-2">
                                <Button variant={language === 'all' ? 'default' : 'outline'} size="sm" className="h-8 text-white" onClick={() => handleLanguageFilter('all')}>
                                    <Globe className="w-4 h-4 mr-1" /> Tất cả
                                </Button>
                                {languages.map((lang) => (
                                    <Button
                                        key={lang.value}
                                        variant={language === lang.value ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-8 dark:text-white"
                                        onClick={() => handleLanguageFilter(lang.value)}
                                    >
                                        {lang.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-5">
                                {displayFC && displayFC.map((item) => <PublicFC item={item} key={item?._id} />)}

                                {publicFlashcards?.length <= 0 && <div className="h-[350px] col-span-full flex items-center justify-center text-gray-700 dark:text-gray-300">Không có dữ liệu...</div>}
                            </div>

                            <PaginationUI
                                data={publicFlashcards}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={handlePageChange}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                totalPages={totalPages}
                                totalItems={totalItems}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="success-fc">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ">
                            {successFC && successFC.map((item) => <UserFC item={item} key={item._id} token={token} />)}
                            {loading && (
                                <div className="flex items-center justify-center col-span-4 h-[500px]">
                                    <Loading className="h-12 w-12" />{' '}
                                </div>
                            )}
                            {token && !loading && successFC?.length === 0 && (
                                <div className="h-[350px] col-span-12 flex items-center justify-center flex-col gap-3">
                                    <p className="dark:text-gray-400">Bạn chưa hoàn thành bộ flashcard nào :(</p>
                                    <Button className="text-white" onClick={() => setTabFlashcard('my-sets')}>
                                        <Eye />
                                        Hãy học xong 1 bộ thẻ nhé, cố gắng lên nào!
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
