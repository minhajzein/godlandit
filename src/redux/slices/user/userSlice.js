import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        setUserdata: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setUserdata } = userSlice.actions

export default userSlice.reducer