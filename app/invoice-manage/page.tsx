'use client';

import AddTransactionForm from '../components/AddTransactionForm';
import PendingBasket from '../components/PendingBasket';

export default function InvoiceManagePage() {
  return (
    <main className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section className="rounded-[28px] border border-outline-variant bg-surface p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-bold text-secondary">إضافة فاتورة</h2>
        <p className="mt-2 text-sm text-gray-500">أضف الفاتورة ثم تبقى معلقة حتى يتم ترحيلها من السلة.</p>
        <div className="mt-6">
          <AddTransactionForm />
        </div>
      </section>

      <section>
        <PendingBasket />
      </section>
    </main>
  );
}