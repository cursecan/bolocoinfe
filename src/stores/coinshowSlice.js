import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: null
}


export const coinshowSlice = createSlice({
    name: 'coinshow',
    initialState,
    reducers: {
        setCoinshow: (state, action) => {
            state.value = action.payload
        }
    }
})


export const { setCoinshow } = coinshowSlice.actions

export const selectCoinshow = (state) => state.coinshow.value

export default coinshowSlice.reducer