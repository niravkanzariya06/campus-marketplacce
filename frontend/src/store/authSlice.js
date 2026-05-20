import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    profilePhoto: null,
    isAdmin: false,
    accessToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.profilePhoto = action.payload.profilePhoto || null;
            state.isAdmin = action.payload.userData?.role === 'admin';
            state.accessToken = action.payload.accessToken || null;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.profilePhoto = null;
            state.isAdmin = false;
            state.accessToken = null;
        },
        updateProfilePhoto: (state, action) => {
            state.profilePhoto = action.payload;
        }
    }
});

export const { login, logout, updateProfilePhoto } = authSlice.actions;

export default authSlice.reducer;
