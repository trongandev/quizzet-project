export const initialChatState = {
    messages: [],
    sendMess: false,
    newMessage: "",
    image: null,
    imageReview: null,
    skip: 0,
    hasMore: false,
    loading: false,
    loadingIcon: false,
    replyingTo: null,
    emoji: [],
    emojiData: [],
    searchEmoji: "",
};

export const chatReducer = (state, action) => {
    switch (action.type) {
        case "SET_MESSAGES":
            return { ...state, messages: action.payload };
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        case "UPDATE_MESSAGE":
            return {
                ...state,
                messages: state.messages.map((msg) => (msg._id === action.payload.id ? { ...msg, ...action.payload.updates } : msg)),
            };
        case "SET_NEW_MESSAGE":
            return { ...state, newMessage: action.payload };
        case "SET_IMAGE":
            return {
                ...state,
                image: action.payload.file,
                imageReview: action.payload.preview,
            };
        case "RESET_MESSAGE_STATE":
            return {
                ...state,
                newMessage: "",
                image: null,
                imageReview: null,
                replyingTo: null,
            };
        default:
            return state;
    }
};
