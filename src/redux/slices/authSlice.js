import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    admin: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.admin = null;
            state.token = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
