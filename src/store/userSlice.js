import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    userData: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserLogin: (state, action) => {
            state.token = action.payload.token;
            state.userData = action.payload.userData;
        },
        setUserLogout: (state, action) => {
            state.token = null;
            state.userData = null;
        }
    },
});

export const {setUserLogin,setUserLogout}= userSlice.actions;

export default userSlice.reducer;