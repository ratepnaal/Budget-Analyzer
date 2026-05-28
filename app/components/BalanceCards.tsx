'use client';

import { useAppSelector } from '@/store/hooks';

export default function BalanceCards() {
  const { usdBalance, sypBalance, savingsBalance, loansBalance } = useAppSelector((state) => state.wallet);

  const cards = [
    { label: 'صندوق الدولار', value: usdBalance, unit: '$', color: 'bg-slate-800 text-white' },
    { label: 'صندوق الليرة', value: sypBalance, unit: 'ل.س', color: 'bg-primary text-white' },
    { label: 'الادخار', value: savingsBalance, unit: '$', color: 'bg-emerald-600 text-white' },
    { label: 'القروض', value: loansBalance, unit: '$', color: 'bg-error text-white' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.color} rounded-[28px] p-6 shadow-lg shadow-black/5`}>
          <div className="text-sm opacity-85">{card.label}</div>
          <div className="mt-2 text-3xl font-black tracking-tight">
            {card.value.toLocaleString()} <span className="text-base font-semibold">{card.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}