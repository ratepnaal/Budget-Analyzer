'use client';

import { useState } from 'react';
import { useAppDispatch , useAppSelector } from '../store/hooks';
import { withdrawSYP , withdrawUSD } from '../store/walletSlice';
import { CategoryType } from '../types';

export default function AddTransactionForm() {
const dispatch = useAppDispatch();
const { currentExchangeRate } = useAppSelector((state) => state.wallet);


  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<'USD' | 'SYP'>('SYP');
  const [category, setCategory] = useState<CategoryType>('اساسي');

  const handleSubmit = (e:React.FormEvent)=>{
e.preventDefault();

if(currency === 'SYP'){
dispatch(withdrawSYP(amount));
}else {
    dispatch(withdrawUSD(amount));
  }
    setTitle('');
    setAmount(0);
    alert('تمت إضافة العملية بنجاح!');
}
    return(
<form onSubmit={handleSubmit} className="bg-white p-6 rounded-card shadow-sm border border-outline-variant max-w-md">
      <h2 className="text-xl font-bold text-secondary mb-4">إضافة فاتورة جديدة</h2>
      
      <div className="space-y-4">
        {/* اسم المنتج */}
        <div>
          <label className="block text-sm mb-1">اسم المنتج / الوصف</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:border-primary outline-none"
            placeholder="مثلاً: فاتورة كهرباء" required
          />
        </div>

        {/* العملة والمبلغ */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">المبلغ</label>
            <input 
              type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded-md outline-none" required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">العملة</label>
            <select 
              value={currency} onChange={(e) => setCurrency(e.target.value as 'USD' | 'SYP')}
              className="p-2 border rounded-md outline-none bg-surface"
            >
              <option value="SYP">ل.س</option>
              <option value="USD">$</option>
            </select>
          </div>
        </div>

        {/* التصنيف */}
        <div>
          <label className="block text-sm mb-1">نوع المصرف</label>
          <select 
            value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full p-2 border rounded-md outline-none bg-surface"
          >
            <option value="أساسي">أساسي</option>
            <option value="ثانوي">ثانوي</option>
            <option value="ديون">ديون</option>
            <option value="سد ديون">سد ديون</option>
            <option value="إعدام">إعدام</option>
            <option value="ادخار">ادخار</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-secondary text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all">
          إضافة المصروف
        </button>
      </div>
    </form>

    )
}