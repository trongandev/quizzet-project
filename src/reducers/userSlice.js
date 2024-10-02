// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    email: "",
    displayName: "",
    profilePicture: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setNewUser: (state, action) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.profilePicture = action.payload.profilePicture;
            state._id = action.payload._id;
        },
        clearUser: (state) => {
            state.email = "";
            state.displayName = "";
            state.profilePicture = "";
            state._id = "";
        },
    },
});

export const { setNewUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
