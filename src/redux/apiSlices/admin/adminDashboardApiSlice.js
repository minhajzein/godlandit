import { adminApiSlice } from "../../../apis/adminApiSlice";

const dashboardApiSlice = adminApiSlice.injectEndpoints({
    endpoints: builder => ({
        getDashboard: builder.query({
            query: () => ({
                url: '/',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            providesTags: ['Dashboard'],
            keepUnusedDataFor: 5
        })
    })
})


export const { useGetDashboardQuery } = dashboardApiSlice