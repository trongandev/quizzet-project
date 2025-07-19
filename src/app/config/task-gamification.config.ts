import { BookOpen, MessageSquare, Plus, Star, Trophy } from "lucide-react"

export const TASKS_DEFINITION = {
    REVIEW_CARD: {
        name: "Ôn tập thẻ",
        xpPerAction: 100,
        dailyLimitCount: 100, // Giới hạn theo SỐ LẦN
        unlockLevel: 1,
        icon: BookOpen,
    },
    ADD_WORD: {
        name: "Thêm từ mới",
        xpPerAction: 100,
        dailyLimitCount: 50,
        unlockLevel: 1,
        icon: Plus,
    },
    CREATE_QUIZ: {
        name: "Tạo bài quiz",
        xpPerAction: 1000,
        dailyLimitCount: 5,
        unlockLevel: 5,
        icon: Trophy,
    },
    DO_QUIZ: {
        name: "Làm bài quiz",
        xpPerAction: 500,
        dailyLimitCount: 10,
        unlockLevel: 8,
        icon: Star,
    },
    RATE_QUIZ: {
        name: "Đánh giá quiz (5 sao)",
        xpPerAction: 200,
        dailyLimitCount: 10,
        unlockLevel: 8,
        icon: MessageSquare,
    },
}
