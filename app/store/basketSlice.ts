import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// نوع العنصر في السلة

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
    // إضافة عنصر للسلة المعلقة
    addToBasket: (state, action: PayloadAction<BasketItem>) => {
      state.items.push(action.payload);
    },
    // حذف عنصر محدد من السلة (في حال غيّر المستخدم رأيه قبل الترحيل)
    removeFromBasket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // تفريغ السلة بالكامل بعد نجاح عملية الترحيل
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

const basketReducer = basketSlice.reducer;

export const { addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketReducer;