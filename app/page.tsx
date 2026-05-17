'use client';
import { useAppDispatch } from './store/hooks';
import { depositUSD } from './store/walletSlice';
import BalanceCards from './components/BalanceCards';
import AddTransactionForm from './components/AddTransactionForm';
import TransferForm from './components/TransferForm';
import TransactionsHistory from './components/TransactionsHistory';
import PendingBasket from './components/PendingBasket';


export default function Home() {
  const dispatch = useAppDispatch();
  return (
  <main className="min-h-screen bg-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الهيدر الرئيسي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-card border border-outline-variant shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-secondary">محلل الميزانية</h1>
            <p className="text-gray-500 text-sm mt-1">الإدارة المالية الهندسية القائمة على الدولار كمرجع</p>
          </div>
          
          {/* زر محاكاة استلام راتب (300 دولار كالمثال) */}
          <button 
            onClick={() => dispatch(depositUSD(300))}
            className="mt-4 md:mt-0 bg-secondary hover:bg-opacity-90 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-md"
          >
            اضغط هنا لمحاكاة استلام راتب (300$)
          </button>
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
          
      </div>
    </main>
  );
}
