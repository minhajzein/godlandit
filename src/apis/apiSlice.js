import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../redux/slices/user/authSlice'
import { baseUrl } from '../config/config'


const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: 'include',
    timeout: 15000,
    prepareHeaders: (headers, { getState }) => {
        headers.set('Accept', 'application/json');
        headers.set('Cache-Control', 'no-cache');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');
        const token = getState().auth.token
        if (token) {
            headers.set("authorized", `Bearer ${token}`)
        }
        return headers
    }
})


const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired"
            }
            return refreshResult
        }
    }
    return result

}



export const apiSlice = createApi({
    reducerPath: 'userAuthService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Admin-auth', 'Users', 'User', 'News', 'Event'],
    endpoints: builder => ({})
})
