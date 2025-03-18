import { setAdminCredentials } from "../redux/slices/admin/adminAuthSlice";
import { baseUrl } from "../config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl + '/admin',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const adminToken = getState().adminToken.adminToken
        if (adminToken) {
            headers.set('adminauthorized', `Bearer ${adminToken}`)
        }
        return headers
    }
})



const adminReauthQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        if (refreshResult?.data) {
            api.dispatch(setAdminCredentials({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired'
            }
            return refreshResult
        }
    }
    return result
}





export const adminApiSlice = createApi({
    reducerPath: 'adminAuthService',
    baseQuery: adminReauthQuery,
    tagTypes: ['Admin-auth', 'Users', 'Dashboard'],
    endpoints: builder => ({})
})