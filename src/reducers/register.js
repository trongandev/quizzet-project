const registerReducer = (state = false, action) => {
    switch (action.type) {
        case "CHECK_REGISTER":
            return action.status;
        default:
            return state;
    }
};

export default registerReducer;
