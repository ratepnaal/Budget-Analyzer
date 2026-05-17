'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { hytdrateWalle } from '../store/walletSlice';
import { hydrateTransactions } from '../store/transactionsSlice';
import { hydrateBasket } from '../store/basketSlice';

export default function HydrationHandler() {
  const dispatch = useAppDispatch();

  useEffect(() => {

    try {
      const savedWallet = localStorage.getItem('wallet_data');
      const savedTransactions = localStorage.getItem('transactions_data');
      const savedBasket = localStorage.getItem('basket_data');

      if (savedWallet) {
        dispatch(hytdrateWalle(JSON.parse(savedWallet)));
      }
      if (savedTransactions) {
        dispatch(hydrateTransactions(JSON.parse(savedTransactions)));
      }
      if (savedBasket) {
        dispatch(hydrateBasket(JSON.parse(savedBasket)));
      }
    } catch (error) {
      console.error('فشل في استرجاع البيانات المالية من ذاكرة المتصفح:', error);
    }
  }, [dispatch]);

  return null; 
}