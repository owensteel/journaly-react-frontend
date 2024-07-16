// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        user: userReducer,
        // Add more reducers here as needed
    },
});

export default store;
