'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { CategoryType } from '@/types';
import { addToBasket , BasketItem } from '@/store/basketSlice';

export default function AddTransactionForm() {
const dispatch = useAppDispatch();


  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<'USD' | 'SYP'>('SYP');
  const [category, setCategory] = useState<CategoryType>('اساسي');

  const handleSubmit = (e:React.FormEvent)=>{

e.preventDefault(); 

const newItem: BasketItem = {
    id: Date.now().toString(), 
    title,
    amount,
    currency,
    category,
  };

  dispatch(addToBasket(newItem));
  
  // إعادة ضبط الحقول
  setTitle('');
  setAmount(0);
};
    return(
<form onSubmit={handleSubmit} className="w-full rounded-2xl sm:rounded-[28px] border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm">
      <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-secondary">إضافة فاتورة جديدة</h2>
      
      <div className="space-y-3 sm:space-y-4">
        {/* اسم المنتج */}
        <div>
          <label className="mb-1 block text-xs sm:text-sm text-secondary">اسم المنتج / الوصف</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-secondary/10"
            placeholder="مثلاً: فاتورة كهرباء" required
          />
        </div>

        {/* العملة والمبلغ - تكديس عمودي على الموبايل */}
        <div className="grid grid-cols-1 gap-3 sm:flex sm:gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs sm:text-sm text-secondary">المبلغ</label>
            <input 
              type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-secondary/10" required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs sm:text-sm text-secondary">العملة</label>
            <select 
              value={currency} onChange={(e) => setCurrency(e.target.value as 'USD' | 'SYP')}
              className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
            >
              <option value="SYP">ل.س</option>
              <option value="USD">$</option>
            </select>
          </div>
        </div>

        {/* التصنيف */}
        <div>
          <label className="mb-1 block text-xs sm:text-sm text-secondary">نوع المصرف</label>
          <select 
            value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
          >
            <option value="اساسي">اساسي</option>
            <option value="ثانوي">ثانوي</option>
            <option value="ديون">ديون</option>
            <option value="سد ديون">سد ديون</option>
            <option value="اعدام">اعدام</option>
            <option value="ادخار">ادخار</option>
          </select>
        </div>

        <button type="submit" className="w-full rounded-xl sm:rounded-2xl bg-secondary py-2.5 sm:py-3 font-bold text-surface transition hover:opacity-90">
          إضافة المصروف
        </button>
      </div>
    </form>

    )
}