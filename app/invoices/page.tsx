'use client';

import TransactionsHistory from '../components/TransactionsHistory';

export default function InvoicesPage() {
  return (
    <main className="space-y-6">
      <div className="rounded-[28px] border border-outline-variant bg-surface p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-bold text-secondary">سجل الفواتير</h2>
        <p className="mt-2 text-sm text-gray-500">البحث والتصفية وعرض العمليات السابقة بنفس الهوية البصرية.</p>
      </div>

      <TransactionsHistory />
    </main>
  );
}