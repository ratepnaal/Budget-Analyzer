import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BasketItem {
  id: string;
  title: string;
  amount: number;
  currency: 'USD' | 'SYP';
  category: string;
}

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<BasketItem>) => {
      state.items.push(action.payload);
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

hydrateBasket: (state, action: PayloadAction<[]>) => {
  state.items = action.payload;
},

    clearBasket: (state) => {
      state.items = [];
    },
  },
});

const basketReducer = basketSlice.reducer;

export const { addToBasket, removeFromBasket, clearBasket , hydrateBasket } = basketSlice.actions;
export default basketReducer;
