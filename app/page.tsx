// app/page.tsx
 'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { depositUSD, depositSYP, takeLoan } from '@/store/walletSlice';
import BalanceCards from './components/BalanceCards';
import AddTransactionForm from './components/AddTransactionForm';
import TransferForm from './components/TransferForm';
import TransactionsHistory from './components/TransactionsHistory';
import PendingBasket from './components/PendingBasket';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import ExpenseBarChart from './components/ExpenseBarChart';

export default function Home() {
  const dispatch = useAppDispatch();
  const [salary, setSalary] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState<'USD' | 'SYP'>('USD');
  const [loanAmount, setLoanAmount] = useState('');
  return (
    <main className="min-h-screen bg-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الهيدر الرئيسي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-card border border-outline-variant shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-secondary">محلل الميزانية</h1>
            <p className="text-gray-500 text-sm mt-1">الإدارة المالية الهندسية القائمة على الدولار كمرجع</p>
          </div>

          {/* مدخلات استلام راتب + سحب قرض */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <input
              type="number"
              step="any"
              placeholder="مبلغ الراتب"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
            <select
              value={salaryCurrency}
              onChange={(e) => setSalaryCurrency(e.target.value as 'USD' | 'SYP')}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="USD">USD</option>
              <option value="SYP">SYP</option>
            </select>
            <button
              onClick={() => {
                const amt = Number(salary);
                if (!amt || amt <= 0) return alert('أدخل مبلغ صالح أكبر من صفر');
                if (salaryCurrency === 'USD') dispatch(depositUSD(amt));
                else dispatch(depositSYP(amt));
                setSalary('');
                alert('تم إضافة الراتب بنجاح');
              }}
              className="bg-secondary hover:bg-opacity-90 text-white font-bold px-4 py-2 rounded-lg"
            >
              إيداع راتب
            </button>

            <input
              type="number"
              step="any"
              placeholder="مبلغ القرض (USD)"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
            <button
              onClick={() => {
                const amt = Number(loanAmount);
                if (!amt || amt <= 0) return alert('أدخل مبلغ قرض صالح أكبر من صفر');
                dispatch(takeLoan(amt));
                setLoanAmount('');
                alert('تم سحب القرض وإضافة المبلغ إلى الرصيد');
              }}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-lg"
            >
              سحب قرض
            </button>
          </div>
        </div>

        {/* عرض الصناديق الأربعة */}
        <BalanceCards />

        {/* منطقة العمليات (النماذج) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* نموذج التحويل والتصريف */}
          <TransferForm />

          {/* نموذج إضافة الفاتورة (الذي يخصم مباشرة من الصندوق المحدد) */}
          <AddTransactionForm />
        </div>

        <div className="w-full">
          <TransactionsHistory />
        </div>

        <div className="lg:col-span-1">
          <PendingBasket />
        </div>

        <div className="max-w-md">
          <Settings />
        </div>

        <div className="lg:col-span-1">
          <Analytics />
          <ExpenseBarChart />
        </div>

      </div>
    </main>
  );
}
