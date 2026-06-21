'use client';

import AddTransactionForm from '../components/AddTransactionForm';
import PendingBasket from '../components/PendingBasket';

export default function InvoiceManagePage() {
  return (
    <main className="space-y-4 sm:space-y-0 sm:grid sm:gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section>
        <AddTransactionForm />
      </section>

      <section>
        <PendingBasket />
      </section>
    </main>
  );
}