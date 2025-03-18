import { apiSlice } from "../../../apis/apiSlice";

const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUser: builder.query({
            query: (id) => ({
                url: `/get-user/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5
        }),

        editProfile: builder.mutation({
            query: (credentials) => ({
                url: `/update-profile/${credentials.id}`,
                method: 'PUT',
                body: { ...credentials }
            }),
            invalidatesTags: ['User']
        })
    })
})


export const {
    useEditProfileMutation,
    useGetUserQuery
} = profileApiSlice