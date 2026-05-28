'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addNotification } from '@/store/notificationsSlice';
import { takeLoan } from '@/store/walletSlice';

export default function LoansPage() {
  const dispatch = useAppDispatch();
  const { loansBalance } = useAppSelector((state) => state.wallet);
  const [loanAmount, setLoanAmount] = useState('');

  const handleTakeLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(loanAmount);

    if (!amount || amount <= 0) {
      dispatch(addNotification({ type: 'error', message: 'أدخل مبلغ قرض صالح أكبر من صفر', duration: 3000 }));
      return;
    }

    dispatch(takeLoan(amount));
    setLoanAmount('');
    dispatch(addNotification({ type: 'success', message: 'تم تحديث صندوق القروض', duration: 3000 }));
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-outline-variant bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">رصيد صندوق القروض</p>
            <h2 className="mt-2 text-4xl font-bold text-error">-{loansBalance.toLocaleString()} $</h2>
          </div>

          <form onSubmit={handleTakeLoan} className="flex flex-col gap-3 md:flex-row md:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary">مبلغ القرض</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full rounded-2xl border border-outline-variant bg-surface p-3 outline-none focus:border-primary dark:bg-secondary/10"
                placeholder="0"
              />
            </div>
            <button type="submit" className="rounded-2xl bg-secondary px-5 py-3 font-bold text-surface transition hover:opacity-90">
              سحب قرض
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}