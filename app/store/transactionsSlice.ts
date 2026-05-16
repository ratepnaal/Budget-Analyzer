import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types';

//  الحالة الابتدائية للسجل: مصفوفة فارغة في البداية

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
  },
});

const transactionsReducer = transactionsSlice.reducer;

export const { addTransaction } = transactionsSlice.actions;
export default transactionsReducer;