import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user/userSlice'
import authReducer from './slices/user/authSlice'
import adminAuthSlice from './slices/admin/adminAuthSlice'
import { adminApiSlice } from '../apis/adminApiSlice'
import { apiSlice } from '../apis/apiSlice'

///⚡⚡⚡⚡⚡⚡ imports ⚡⚡⚡⚡⚡⚡

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer,
        user: userReducer,
        auth: authReducer,
        adminToken: adminAuthSlice,
    },
    middleware: (getDefaultMiddleware) => {
        const allMiddleware = [
            apiSlice.middleware,
            adminApiSlice.middleware
        ];
        return getDefaultMiddleware({ serializableCheck: false }).concat(
            ...allMiddleware
        );
    },
    devTools: true
})

export default store