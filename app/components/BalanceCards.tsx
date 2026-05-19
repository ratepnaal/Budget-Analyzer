'use client'
import { useAppSelector } from "@/store/hooks"

export default function BalanceCards (){
    const { usdBalance, sypBalance, savingsBalance, loansBalance } = useAppSelector((state) => state.wallet);
    const cards = [
    { label: 'صندوق الدولار', value: usdBalance, unit: '$', color: 'bg-secondary' },
    { label: 'صندوق الليرة', value: sypBalance, unit: 'ل.س', color: 'bg-primary' },
    { label: 'الادخار ', value: savingsBalance, unit: '$', color: 'bg-green-600' },
    { label: 'القروض', value: loansBalance, unit: '$', color: 'bg-error' },
  ];
    return(
        <>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
{cards.map((card, index) => (
        <div key={index} className={`${card.color} text-white p-6 rounded-card shadow-lg`}>
          <p className="text-sm opacity-80">{card.label}</p>
          <h3 className="text-2xl font-bold mt-2">
            {card.value.toLocaleString()} <span className="text-lg font-normal">{card.unit}</span>
          </h3>
        </div>
      ))}

</div>

        </>
    )
}