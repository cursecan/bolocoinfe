import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: null
}


export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.value = action.payload
        }
    }
})


export const { setMessage } = messageSlice.actions

export const selectMessage = (state) => state.message.value

export default messageSlice.reducer