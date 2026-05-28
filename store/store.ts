import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import transactionsReducer from "./transactionsSlice";
import basketReducer from "./basketSlice";
import themeReducer from "./themeSlice";
import type { ThemeMode } from './themeSlice';
import notificationsReducer from "./notificationsSlice";

const loadThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';

  try {
    const storedTheme = localStorage.getItem('theme_mode');
    return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system' ? storedTheme : 'system';
  } catch {
    return 'system';
  }
};

// Try to load persisted state from localStorage (client only)

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    transactions: transactionsReducer,
    basket: basketReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
  preloadedState: {
    theme: {
      mode: loadThemeMode(),
    },
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
      localStorage.setItem('theme_mode', state.theme.mode);
    } catch (e) {
      console.warn('Failed to persist state to localStorage:', e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
