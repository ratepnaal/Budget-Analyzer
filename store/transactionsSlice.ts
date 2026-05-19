import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@/types';

interface TransactionsState {
  list: Transaction[];
}

const initialState: TransactionsState = {
  list: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload);
    },

    hydrateTransactions: (state, action: PayloadAction<[]>) => {
      state.list = action.payload;
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(tx => tx.id !== action.payload);
    },

  },
});

const transactionsReducer = transactionsSlice.reducer;

export const { addTransaction , hydrateTransactions , deleteTransaction } = transactionsSlice.actions;
export default transactionsReducer;
