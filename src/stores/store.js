import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js'
import calculateReducer from './calculateSlice.js'
import messageReducer from './massageSlice.js'
import coinshowReducer from './coinshowSlice.js'

export const store = configureStore({
    reducer: {
        user: userReducer,
        calculate: calculateReducer,
        message: messageReducer,
        coinshow: coinshowReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //     serializableCheck: {
    //         ignoredActions: ['user/setUser'],
    //         ignoredPaths: ['user.value.miningStartDate'], // Specify paths to ignore
    //     },
    // }),
})