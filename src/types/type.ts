import { Key } from "react"

interface IUser {
    _id: string
    displayName: string
    email: string
    verify: boolean
    role: string
    status: boolean
    profilePicture: string
    created_at: Date
    expire_otp: string
    otp: number
    provider: string
    refresh_token: string
    gamification: {
        _id: string
        xp: number
        level: number
        dailyStreak: { current: number }
        achievements: IUnlockedAchievement[]
    }
}

interface INotify {
    _id: string
    recipient: string
    sender: IUser
    type: string
    link: string
    content: string
    is_read: boolean
    created_at: string
}

interface IQuestion {
    _id: string
    data_quiz: IDataQuiz[]
}

interface IDataQuiz {
    id: string
    question: string
    answers: []
    correct: string
}
interface IComment {
    user_id: IUser
    quiz_id?: string
    rating: number
    review: string
    helpful: number
    _id: string
    created_at: Date
}

interface IHistory {
    _id: string
    user_id: IUser
    quiz_id: QuizId
    score: number
    total_questions: number
    time: number
    userAnswers: Key[]
    date: Date
}

interface QuizId {
    _id: string
    title: string
    subject: string
}

interface ISO {
    _id: string
    user_id: IUser
    slug: string
    title: string
    content: string
    link: string
    image: string
    date: Date
    lenght: number
    view: number
    type: string
    subject: string
    quest: IQuestionSO
}

interface IQuestionSO {
    _id: number
    data_so: IDataSO[]
}

interface IDataSO {
    _id: string
    question: string
    answer: string
}

interface IQuiz {
    _id: string
    slug: string
    title: string
    uid: IUser
    subject: string
    content: string
    img: string
    noa: number
    view: number
    difficulty: string
    date: Date
    status: boolean
    questions: IQuestion
    comment: IComment[]
}

interface IListFlashcard {
    _id: string
    userId: IUser
    title: string
    language: "chinese" | "english" | "french" | "germany" | "japan" | "korea" | "vietnamese"
    desc: string
    public: boolean
    isSuccess: boolean
    isHiddenTranscription: boolean
    flashcards: Flashcard[]
    accuracyPercentage: number
    countCardsDueToday: number
    created_at: Date
    last_practice_date: Date
    progress: IProgress
}

export interface IEditFlashcard {
    _id: string
    title: string
    language: string
    desc: string
    public: boolean
}

interface IProgress {
    percentage: number
    rememberedCards: number
    totalCards: number
}

interface Flashcard {
    _id: string
    userId: string
    title: string
    define: string
    language: string
    type_of_word: string
    transcription: string
    example: Example[]
    note: string
    nextReviewDate: Date
    interval: number
    repetitions: number
    progress: { learnedTimes: number; percentage: number }
    efactor: number
    status: string
    history: any[]
    created_at: Date
}

interface Example {
    en: string
    vi: string
    _id: string
    trans?: string
}

interface IMessage {
    userId: IUser
    message: string
    image?: string
    isEdit: boolean
    replyTo?: IMessage
    unsend: boolean
    reactions: {
        userId: IUser
        emoji: string
    }[]
}

interface IChat {
    _id: string
    participants: {
        userId: IUser
    }[]
    messages: IMessage[]
    last_message: string
    last_message_date: Date
    is_read: boolean
}

interface IChatCommunity {
    room: {
        type: string
        default: string
        unique: boolean
        index: boolean
    }
    messages: {
        type: string
        ref: string
    }[]
}

interface IChatCommunityMessage {
    _id: string
    userId: UserId
    message: string
    image: string
    isEdit: boolean
    replyTo: IReplyTo
    unsend: boolean
    reactions: any[]
    timestamp: Date
    __v: number
}

interface IReplyTo {
    _id: string
    userId: UserId
    message: string
    image: string
    unsend: boolean
}

interface UserId {
    _id: string
    displayName: string
    profilePicture: string
}

export interface Voice {
    id: string
    name: string
    gender: string
    language: string
    country: string
    description: string
    premium: boolean
    popular: boolean
    avatar: string
    sample: string
}

export interface IReport {
    _id: string
    user_report: Userreport
    link: string
    type_of_violation: string
    content: string
    status: string
    is_violated: boolean
    resolved_by: string
    resolved_date: Date
    resolved_content: string
    created_at: Date
    __v: number
}

export interface IWordCount {
    learned: number
    remembered: number
    total: number
    reviewing: number
}

interface Userreport {
    _id: string
    displayName: string
    profilePicture: string
}

export interface IActivity {
    _id: string
    userId: UserId
    action: string
    targetType: string
    targetId: string
    timestamp: Date
}

export interface IAchievement {
    _id: string
    achievementId: string
    name: string
    description: string
    xpReward: number
    icon: string
}

export interface IUnlockedAchievement {
    achievement: IAchievement
    unlockedAt: Date
}

export interface DailyTask {
    count: number
    taskId: string
}

export interface IDailyProgress {
    date: Date
    tasks: DailyTask[]
}

export interface IGamification {
    _id: string
    user_id: IUser
    xp: number
    level: number
    dailyStreak: {
        current: number
        lastActivityDate: Date
    }
    dailyProgress: IDailyProgress
    achievements: IUnlockedAchievement[]
}

export interface ILevel {
    _id: string
    level: number
    name: string
    xpRequired: number
    levelIcon: string
}

export interface IDailyTask {
    _id: string
    taskId: string
    name: string
    description: string
    icon: string
    xpPerAction: number
    dailyLimitCount: number
    unlockLevel: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface TASKS {
    REVIEW_CARD: REVIEWCARD
    ADD_WORD: REVIEWCARD
    CREATE_QUIZ: REVIEWCARD
    DO_QUIZ: REVIEWCARD
    RATE_QUIZ: REVIEWCARD
}

export interface REVIEWCARD {
    _id: string
    taskId: string
    name: string
    description: string
    xpPerAction: number
    dailyLimitCount: number
    unlockLevel: number
    icon: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface IPodiumUser {
    dailyStreak: DailyStreak
    _id: string
    user_id: IUser
    xp: number
    level: number
    rank: number
}

interface DailyStreak {
    current: number
    lastActivityDate?: string
}

export type { IUser, INotify, IQuestion, IComment, IHistory, ISO, IQuiz, IDataQuiz, IListFlashcard, IProgress, Flashcard, Example, IMessage, IChat, IChatCommunity, IChatCommunityMessage }
