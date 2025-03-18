import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { adminApiSlice } from "../../../apis/adminApiSlice";

const usersAdapter = createEntityAdapter({})
const initialState = usersAdapter.getInitialState()

const usersApiSlice = adminApiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: async (responseData, meta, args) => {
                const loadedEvents = await responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedEvents)
            },
            keepUnusedDataFor: 5,
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Users', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Users', id }))
                    ]
                } else return [{
                    type: 'Users', id: 'LIST'
                }]
            }
        }),
        banUnbanUser: builder.mutation({
            query: userId => ({
                url: '/changeStatus',
                method: 'PATCH',
                body: { userId }
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Users', id: id }
            ]
        }),
        updateUser: builder.mutation({
            query: (credentials) => ({
                url: `/update-user/${credentials.id}`,
                method: 'PUT',
                body: { ...credentials }
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Users', id: id }
            ]
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users', 'Dashboard']
        })
    })
})

export const {
    useGetAllUsersQuery,
    useBanUnbanUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice


export const selectUsersResult = usersApiSlice.endpoints.getAllUsers.select()

//memoized selector

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUsersById,
    selectIds: selectUsersIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)