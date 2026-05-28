// store/walletSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletState } from "@/types";

const initialState: WalletState = {
    usdBalance: 0,
    sypBalance: 0,
    savingsBalance: 0,
    loansBalance: 0,
    currentExchangeRate: 14500,
};

const WalletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        updateExchangeRate: (state, action: PayloadAction<number>) => {
            if (action.payload > 0) {
                state.currentExchangeRate = action.payload;
            }
        },

        depositUSD: (state, action: PayloadAction<number>) => {
            state.usdBalance += action.payload;
        },

        depositSYP: (state, action: PayloadAction<number>) => {
            state.sypBalance += action.payload;
        },

        withdrawUSD: (state, action: PayloadAction<number>) => {
            state.usdBalance -= action.payload;
        },

        withdrawSYP: (state, action: PayloadAction<number>) => {
            state.sypBalance -= action.payload;
        },

        transferUsdToSyp: (state, action: PayloadAction<number>) => {
            const usdAmount = action.payload;
            const sypEquivalent = usdAmount * state.currentExchangeRate;

            if (state.usdBalance >= usdAmount) {
                state.usdBalance -= usdAmount;
                state.sypBalance += sypEquivalent;
            }
        },

        // Set balances, savings, loans and rate (used for hydration / restoring state)
        hytdrateWalle: (
            state,
            action: PayloadAction<{
                usdBalance: number;
                sypBalance: number;
                savingsBalance?: number;
                loansBalance?: number;
                currentExchangeRate: number;
            }>
        ) => {
            state.usdBalance = action.payload.usdBalance;
            state.sypBalance = action.payload.sypBalance;
            state.savingsBalance = action.payload.savingsBalance ?? state.savingsBalance;
            state.loansBalance = action.payload.loansBalance ?? state.loansBalance;
            state.currentExchangeRate = action.payload.currentExchangeRate;
        },

        refundUSD: (state, action: PayloadAction<number>) => {
            state.usdBalance += action.payload;
        },

        refundSYP: (state, action: PayloadAction<number>) => {
            state.sypBalance += action.payload;
        },

        // New: take a loan -> increase cash (USD) and increase loans (debt)
        takeLoan: (state, action: PayloadAction<number>) => {
            const amount = action.payload;
            if (amount > 0) {
                state.usdBalance += amount;
                state.loansBalance += amount;
            }
        },

        // Repay a loan -> decrease loans (debt). Amount is in USD.
        repayLoan: (state, action: PayloadAction<number>) => {
            const amount = action.payload;
            if (amount > 0) {
                state.loansBalance -= amount;
                if (state.loansBalance < 0) state.loansBalance = 0;
            }
        },

        // New: add to savings (SYP or USD normalized to SYP by rate if needed outside)
        addToSavings: (state, action: PayloadAction<number>) => {
            const amount = action.payload;
            if (amount > 0) {
                state.savingsBalance += amount;
            }
        },
    },
});

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
    refundUSD,
    takeLoan,
    repayLoan,
    addToSavings,
} = WalletSlice.actions;

export default walletReducer;
