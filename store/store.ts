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

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('wallet_data', JSON.stringify(state.wallet));
    localStorage.setItem('transactions_data', JSON.stringify(state.transactions.list));
    localStorage.setItem('basket_data', JSON.stringify(state.basket.items));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
