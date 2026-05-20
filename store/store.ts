import { configureStore } from "@reduxjs/toolkit";
import walletReducer, { hytdrateWalle } from "./walletSlice";
import transactionsReducer, { hydrateTransactions } from "./transactionsSlice";
import basketReducer, { hydrateBasket } from "./basketSlice";

// Try to load persisted state from localStorage (client only)

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    transactions: transactionsReducer,
    basket: basketReducer,
  },
});



// Persist selected parts of state to localStorage on client
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem('wallet_data', JSON.stringify(state.wallet));
      localStorage.setItem('transactions_data', JSON.stringify(state.transactions.list));
      localStorage.setItem('basket_data', JSON.stringify(state.basket.items));
    } catch (e) {
      console.warn('Failed to persist state to localStorage:', e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
