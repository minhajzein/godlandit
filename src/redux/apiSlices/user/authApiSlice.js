
import { apiSlice } from "../../../apis/apiSlice";
import { logout, setCredentials } from "../../slices/user/authSlice";



export const authApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            }),
            invalidatesTags: ['User']
        }),

        signup: builder.mutation({
            query: credentials => ({
                url: '/auth/sign-up',
                method: 'POST',
                body: { ...credentials }
            }),
            invalidatesTags: ['User']
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled
                const { accessToken } = data
                dispatch(setCredentials({ accessToken }))
            }
        }),

        sendOtp: builder.mutation({
            query: (credentials) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        verifyOtp: builder.mutation({
            query: (credentials) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        sendLougout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                await queryFulfilled
                dispatch(logout())
                setTimeout(() => {
                    dispatch(apiSlice.util.resetApiState())
                }, 1000);
            }
        }),

    })
})

export const {
    useLoginMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useRefreshMutation,
    useSignupMutation,
    useResetPasswordMutation,
    useSendLougoutMutation,
    usePrefetch
} = authApiSlice

