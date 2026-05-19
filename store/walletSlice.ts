import { createSlice , PayloadAction } from "@reduxjs/toolkit";
import { WalletState } from "@/types";

const initialState : WalletState = {
    usdBalance:0,
    sypBalance:0,
    savingsBalance:0,
    loansBalance:0,
    currentExchangeRate:14500
}

const WalletSlice = createSlice({
    name:'wallet',
    initialState,
    reducers:{
        updateExchangeRate:(state , action: PayloadAction<number>)=>{
         if (action.payload > 0) {
      state.currentExchangeRate = action.payload;
    }},

        depositUSD:(state , action: PayloadAction<number>)=>{
            state.usdBalance += action.payload;
        },

         depositSYP:(state , action: PayloadAction<number>)=>{
            state.sypBalance += action.payload;
        },

        withdrawUSD:(state , action:PayloadAction<number>)=>{
            state.usdBalance -= action.payload;
        },

        withdrawSYP:(state , action:PayloadAction<number>)=>{
            state.sypBalance -= action.payload;
        },

        transferUsdToSyp:(state , action:PayloadAction<number>)=>{
            const usdAmount = action.payload;
            const sypEquivalent = usdAmount * state.currentExchangeRate;

            if(state.usdBalance >= usdAmount){
                state.usdBalance-=usdAmount;
                state.sypBalance +=sypEquivalent
            }
        },

hytdrateWalle: (state, action: PayloadAction<{ usdBalance: number; sypBalance: number; currentExchangeRate: number }>) => {
  state.usdBalance = action.payload.usdBalance;
  state.sypBalance = action.payload.sypBalance;
  state.currentExchangeRate = action.payload.currentExchangeRate;
},

 refundUSD: (state, action: PayloadAction<number>) => {
    state.usdBalance += action.payload;
  },

  refundSYP: (state, action: PayloadAction<number>) => {
      state.sypBalance += action.payload;
    },

    }
})

const walletReducer = WalletSlice.reducer;

export const { 
  updateExchangeRate, 
  depositUSD, 
  withdrawUSD, 
  depositSYP, 
  withdrawSYP, 
  transferUsdToSyp,
  hytdrateWalle,
  refundSYP,
  refundUSD
} = WalletSlice.actions;

export default walletReducer;
