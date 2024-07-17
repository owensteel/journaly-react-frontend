import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isLoggedIn: boolean;
    name?: string;
    picture?: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    name: undefined,
    picture: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ name: string; picture: string }>) {
            state.isLoggedIn = true;
            state.name = action.payload.name;
            state.picture = action.payload.picture;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.name = undefined;
            state.picture = undefined;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
