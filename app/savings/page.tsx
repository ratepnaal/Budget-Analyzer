'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addNotification } from '@/store/notificationsSlice';
import { addToSavings } from '@/store/walletSlice';

export default function SavingsPage() {
  const dispatch = useAppDispatch();
  const { savingsBalance } = useAppSelector((state) => state.wallet);
  const [amount, setAmount] = useState('');

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      dispatch(addNotification({ type: 'error', message: 'أدخل مبلغ ادخار صالح أكبر من صفر', duration: 3000 }));
      return;
    }

    dispatch(addToSavings(parsedAmount));
    setAmount('');
    dispatch(addNotification({ type: 'success', message: 'تم تحديث صندوق الادخار', duration: 3000 }));
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-outline-variant bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">رصيد صندوق الادخار</p>
            <h2 className="mt-2 text-4xl font-bold text-primary-dark">{savingsBalance.toLocaleString()} $</h2>
          </div>

          <form onSubmit={handleAddSavings} className="flex flex-col gap-3 md:flex-row md:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary">مبلغ الادخار</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-outline-variant bg-surface p-3 outline-none focus:border-primary dark:bg-secondary/10"
                placeholder="0"
              />
            </div>
            <button type="submit" className="rounded-2xl bg-primary px-5 py-3 font-bold text-slate-900 transition hover:bg-primary-dark">
              إضافة إلى الادخار
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}