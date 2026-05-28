// app/page.tsx
'use client';

import BalanceCards from './components/BalanceCards';
import Analytics from './components/Analytics';
import ExpenseBarChart from './components/ExpenseBarChart';

export default function Home() {
  return (
    <main className="space-y-8">
      <div className="rounded-[28px] border border-outline-variant bg-surface-container/70 p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-bold text-secondary">لوحة التحكم</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">ملخص سريع للحالة المالية والمخططات الأساسية للمشروع في شاشة واحدة واضحة وسريعة القراءة.</p>
      </div>

      <BalanceCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Analytics />
        <ExpenseBarChart />
      </div>
    </main>
  );
}
