interface IUser {
    _id: string;
    displayName: string;
    email: string;
    verify: boolean;
    role: string;
    status: boolean;
    profilePicture: string;
    created_at: Date;
    expire_otp: string;
    otp: number;
    provider: string;
    refresh_token: string;
}

interface INotify {
    _id: string;
    recipient: string;
    sender: IUser;
    type: string;
    link: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

interface IQuestion {
    id: number;
    question: string;
    answers: string[];
    correct: number;
}

interface IComment {
    user_id: IUser;
    quiz_id?: string;
    rating: number;
    review: string;
    _id: string;
    created_at: Date;
}

interface IHistory {
    _id: string;
    user_id: string;
    quiz_id: string;
    score: number;
    time: number;
    questions: IDataHistory;
    date: string;
}

interface IDataHistory {
    _id: string;
    data_history: Datahistory[];
}

interface Datahistory {
    question_id: number;
    question_name: string;
    answer_choose?: number;
    answers: string[];
    answer_correct: number;
    status: boolean;
}

interface ISO {
    _id: string;
    user_id: IUser;
    slug: string;
    title: string;
    image: string;
    date: string;
    lenght: number;
    view: number;
    subject: string;
    quest: string;
}

interface IQuiz {
    _id: string;
    slug: string;
    title: string;
    uid: IUser;
    subject: string;
    content: string;
    img: string;
    noa: number;
    date: Date;
    status: boolean;
    questions: IQuestion;
    comment: IComment[];
}

interface IListFlashcard {
    _id: string;
    userId: IUser;
    title: string;
    language: string;
    desc: string;
    public: boolean;
    flashcards: Flashcard[];
    created_at: string;
    progress: IProgress;
    is_public: boolean;
}

interface IProgress {
    percentage: number;
    rememberedCards: number;
    totalCards: number;
}

interface Flashcard {
    _id: string;
    title: string;
    define: string;
    type_of_word: string;
    transcription: string;
    example: Example[];
    note: string;
    status: string;
    progress: Progress;
    history: any[];
    created_at: string;
}

interface Progress {
    learnedTimes: number;
    percentage: number;
}

interface Example {
    en: string;
    vi: string;
    _id: string;
    trans?: string;
}

interface IMessage {
    userId: IUser;
    message: string;
    image?: string;
    isEdit: boolean;
    replyTo?: IMessage;
    unsend: boolean;
    reactions: {
        userId: IUser;
        emoji: string;
    }[];
}

interface IChat {
    participants: {
        userId: IUser;
    }[];
    messages: IMessage[];
    last_message: string;
    last_message_date: Date;
    is_read: boolean;
}

interface IChatCommunity {
    room: {
        type: string;
        default: string;
        unique: boolean;
        index: boolean;
    };
    messages: {
        type: string;
        ref: string;
    }[];
}

export type { IUser, INotify, IQuestion, IComment, IHistory, IDataHistory, ISO, IQuiz, IListFlashcard, IProgress, Flashcard, Progress, Example, IMessage, IChat, IChatCommunity };
