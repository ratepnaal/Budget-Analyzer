import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import transactionsReducer from "./transactionsSlice";
import basketReducer from "./basketSlice";

export const store = configureStore({
    reducer:{
        wallet:walletReducer,
        transactions: transactionsReducer,
        basket: basketReducer, 
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;