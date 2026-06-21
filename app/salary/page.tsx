'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { depositUSD, depositSYP, withdrawUSD, withdrawSYP } from '@/store/walletSlice';
import { addNotification } from '@/store/notificationsSlice';
import TransferForm from '../components/TransferForm';

export default function SalaryPage() {
  const dispatch = useAppDispatch();
  const { usdBalance, sypBalance } = useAppSelector((state) => state.wallet);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'SYP'>('USD');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      dispatch(addNotification({ type: 'error', message: 'أدخل مبلغاً صالحاً أكبر من صفر', duration: 3000 }));
      return;
    }

    if (action === 'deposit') {
      if (currency === 'USD') {
        dispatch(depositUSD(parsedAmount));
      } else {
        dispatch(depositSYP(parsedAmount));
      }
      dispatch(addNotification({ type: 'success', message: 'تمت الإضافة بنجاح', duration: 3000 }));
    } else {
      if (currency === 'USD') {
        dispatch(withdrawUSD(parsedAmount));
      } else {
        dispatch(withdrawSYP(parsedAmount));
      }
      dispatch(addNotification({ type: 'success', message: 'تم السحب بنجاح', duration: 3000 }));
    }

    setAmount('');
  };

  return (
    <main className="space-y-4 sm:space-y-8">
      <section className="rounded-2xl sm:rounded-[28px] border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm lg:p-8">
        <div className="mb-4 sm:mb-5 flex items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-secondary">إدارة الراتب</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">إضافة، سحب، وتحويل بين الدولار والليرة.</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-primary">صندوق مستقل</span>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2">
          <div className="rounded-2xl sm:rounded-3xl bg-secondary p-4 sm:p-6 text-surface shadow-lg shadow-secondary/10">
            <p className="text-[11px] sm:text-sm opacity-80">صندوق الدولار</p>
            <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold">{usdBalance.toLocaleString()} $</h3>
          </div>
          <div className="rounded-2xl sm:rounded-3xl bg-primary p-4 sm:p-6 text-slate-900 shadow-lg shadow-primary/10">
            <p className="text-[11px] sm:text-sm opacity-80">صندوق الليرة</p>
            <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold">{sypBalance.toLocaleString()} ل.س</h3>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl sm:rounded-[28px] border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm lg:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-secondary">الإضافة والسحب</h2>
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-secondary">المبلغ</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-secondary/10"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-secondary">العملة</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'SYP')}
                  className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="SYP">SYP</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-secondary">الإجراء</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as 'deposit' | 'withdraw')}
                  className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
                >
                  <option value="deposit">إضافة</option>
                  <option value="withdraw">سحب</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl sm:rounded-2xl bg-secondary px-4 py-2.5 sm:py-3 font-bold text-surface transition hover:opacity-90">
              تنفيذ العملية
            </button>
          </form>
        </div>

        <TransferForm />
      </section>
    </main>
  );
}