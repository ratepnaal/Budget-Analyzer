import { createSlice , PayloadAction } from "@reduxjs/toolkit";
import { WalletState } from "../types";

// تحديد القيم الاولية للمحفظة 

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

        // دالة المعادل بين العملتين 

        updateExchangeRate:(state , action: PayloadAction<number>)=>{
         if (action.payload > 0) {
      state.currentExchangeRate = action.payload;
    }},

        // دالة ايداع مبلغ بالسوري ودالة الايداع بالدولار

        depositUSD:(state , action: PayloadAction<number>)=>{
            state.usdBalance += action.payload;
        },

         depositSYP:(state , action: PayloadAction<number>)=>{
            state.sypBalance += action.payload;
        },

        //دالة السحب من المبلغ بالدولار ودالة السحب بالسوري 

        withdrawUSD:(state , action:PayloadAction<number>)=>{
            state.usdBalance -= action.payload;
        },

        withdrawSYP:(state , action:PayloadAction<number>)=>{
            state.sypBalance -= action.payload;
        },

        // دالة التحويل من الدولار الى السوري 

        transferUsdToSyp:(state , action:PayloadAction<number>)=>{
            const usdAmount = action.payload;
            const sypEquivalent = usdAmount * state.currentExchangeRate;

            // اذا كان المبلغ الذي نرغب بتحويله اصغر من الكلي نقص هذا المبلغ من الصندوق الرئيسي وزده للصندوق السوري 

            if(state.usdBalance >= usdAmount){
                state.usdBalance-=usdAmount;
                state.sypBalance +=sypEquivalent
            }
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
  transferUsdToSyp 
} = WalletSlice.actions;

export default walletReducer;