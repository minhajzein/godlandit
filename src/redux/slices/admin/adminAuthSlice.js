import { createSlice } from "@reduxjs/toolkit";



const adminAuthSlice = createSlice({
    name: 'adminToken',
    initialState: {
        adminToken: null
    },
    reducers: {
        setAdminCredentials: (state, actions) => {
            state.adminToken = actions.payload
        },
        adminLogout: (state, actions) => {
            state.adminToken = null
        }
    },

})



export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions

export default adminAuthSlice.reducer

export const selectCurrentAdminToken = (state) => state.adminToken.adminToken