import { adminApiSlice } from "../../../apis/adminApiSlice";
import { adminLogout, setAdminCredentials } from "../../slices/admin/adminAuthSlice";

export const adminAuthApiSlice = adminApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials }
            }),
            invalidatesTags: ['Admin-auth']
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'GET'
            }),
            invalidatesTags: ['Admin-auth'],
            async onQueryStarted(arg, { dispatch, queryFulFilled }) {
                await queryFulFilled
                dispatch(adminLogout())
                setTimeout(() => {
                    dispatch(adminApiSlice.util.resetApiState())
                }, 1000);
            }
        }),
        adminRefresh: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'GET'
            }),
            providesTags: ['Admin-auth'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled
                const { adminToken } = data
                dispatch(setAdminCredentials({ adminToken }))
            }
        })
    }),
})


export const {
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminRefreshMutation,
    usePrefetch
} = adminAuthApiSlice