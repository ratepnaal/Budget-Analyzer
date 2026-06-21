'use client';
import { useState } from 'react';
import { useAppDispatch , useAppSelector } from '@/store/hooks';
import { updateExchangeRate } from '@/store/walletSlice';
import { addNotification } from '@/store/notificationsSlice';
import { setThemeMode, ThemeMode } from '@/store/themeSlice';

export default function Settings() {
  const dispatch = useAppDispatch();
  
  // 1. جلب سعر الصرف الحالي من الـ Store لعرضه كقيمة افتراضية

  const { currentExchangeRate } = useAppSelector((state) => state.wallet);
  const themeMode = useAppSelector((state) => state.theme.mode);

  // 2. الـ State المحلية للتحكم بمدخلات حقل النص

  const [rateInput, setRateInput] = useState<string>(currentExchangeRate.toString());
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = Number(rateInput);

    if (newRate <= 0) {
      dispatch(addNotification({ type: 'error', message: 'يرجى إدخال سعر صرف صحيح أكبر من الصفر', duration: 3000 }));
      return;
    }

    // إرسال السعر الجديد إلى Redux Store
    dispatch(updateExchangeRate(newRate));
    dispatch(setThemeMode(selectedTheme));
    
    dispatch(addNotification({ type: 'success', message: 'تم حفظ الإعدادات بنجاح', duration: 3000 }));
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-[28px] border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm lg:p-8">
      
      <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-secondary">إعدادات النظام المالية</h2>
      
      <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
        <div>
          <label className="mb-1 block text-xs sm:text-sm font-medium text-secondary">
            سعر صرف الدولار مقابل الليرة السورية (1$ = ؟)
          </label>
          <div className="relative rounded-xl sm:rounded-2xl shadow-sm">
            <input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}

              className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 pr-12 font-bold text-secondary outline-none transition-all focus:border-primary dark:bg-secondary/10"
              placeholder="مثال: 15000"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-[10px] sm:text-xs text-gray-400">
              ل.س
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs sm:text-sm font-medium text-secondary">
            الوضع العام
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as ThemeMode)}
            className="w-full rounded-xl sm:rounded-2xl border border-outline-variant bg-surface p-2.5 sm:p-3 font-bold text-secondary outline-none transition-all focus:border-primary dark:bg-slate-800 dark:text-white"
          >
            <option value="system">حسب النظام</option>
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl sm:rounded-2xl bg-secondary py-2.5 sm:py-3 font-bold text-surface shadow-md transition-all hover:opacity-90"
        >
          حفظ وتطبيق السعر الجديد
          
        </button>
      </form>
    </div>
  );
}