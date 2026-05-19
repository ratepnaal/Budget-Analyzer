'use client';
import { useState } from 'react';
import { useAppDispatch , useAppSelector } from '@/store/hooks';
import { updateExchangeRate } from '@/store/walletSlice';

export default function Settings() {
  const dispatch = useAppDispatch();
  
  // 1. جلب سعر الصرف الحالي من الـ Store لعرضه كقيمة افتراضية

  const { currentExchangeRate } = useAppSelector((state) => state.wallet);

  // 2. الـ State المحلية للتحكم بمدخلات حقل النص

  const [rateInput, setRateInput] = useState<string>(currentExchangeRate.toString());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = Number(rateInput);

    if (newRate <= 0) {
      alert('يرجى إدخال سعر صرف صحيح أكبر من الصفر');
      return;
    }

    // إرسال السعر الجديد إلى Redux Store
    dispatch(updateExchangeRate(newRate));
    
    // إظهار مؤشر نجاح مؤقت للمستخدم لتعزيز الـ UX
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant w-full">
      
      <h2 className="text-xl font-bold text-secondary mb-5">إعدادات النظام المالية</h2>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-secondary">
            سعر صرف الدولار مقابل الليرة السورية (1$ = ؟)
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}

              className="w-full p-3 border rounded-md outline-none border-gray-200 focus:border-primary transition-all text-secondary font-bold"
              placeholder="مثال: 15000"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400">
              ل.س
            </div>
          </div>
        </div>

        {/* إشعار نجاح الحفظ اللحظي */}
        {isSuccess && (
          <p className="text-emerald-700 text-xs font-semibold bg-emerald-50 p-2 rounded border border-emerald-200 transition-all animate-fade-in">
            ✓ تم تحديث سعر الصرف في البنك المركزي بنجاح!
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-3 rounded-md transition-all shadow-md"
        >
          حفظ وتطبيق السعر الجديد
          
        </button>
      </form>
    </div>
  );
}