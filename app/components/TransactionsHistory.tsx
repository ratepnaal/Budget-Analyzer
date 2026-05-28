'use client';
import { useState } from 'react';
import { useAppSelector , useAppDispatch } from '@/store/hooks';
import { deleteTransaction } from '@/store/transactionsSlice';
import { refundSYP, refundUSD } from '@/store/walletSlice';
import { CategoryType } from '@/types';
import { Transaction } from '@/types';
import { addNotification } from '@/store/notificationsSlice';
import ConfirmDialog from './ConfirmDialog';

export default function TransactionsHistory() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.list);
  const [confirmState, setConfirmState] = useState<{ open: boolean; tx: Transaction | null }>({ open: false, tx: null });

  // 1. حالات الفلترة المحلية (Local States for Filtering)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');


  
  const handleDeleteClick = (tx:Transaction) => {
    setConfirmState({ open: true, tx });
  };

  const handleConfirmDelete = () => {
    const tx = confirmState.tx;
    if (tx) {
      if (tx.currency === 'SYP') {
        dispatch(refundSYP(tx.amountSYP));
      } else if (tx.currency === 'USD') {
        dispatch(refundUSD(tx.amountUSD));
      }
      dispatch(deleteTransaction(tx.id));
      dispatch(addNotification({ type: 'success', message: 'تم حذف العملية واسترداد المبلغ', duration: 3000 }));
    }
    setConfirmState({ open: false, tx: null });
  };

  // 2. هندسة الفلترة المتسلسلة (Pipeline Filtering)
  // نقوم بتصفية المصفوفة الأصلية خطوة بخطوة بناءً على خيارات المستخدم
  const filteredTransactions = transactions.filter((tx) => {
    // أ. الفلترة بالبحث النصي (تحويل النصوص لأحرف صغيرة وتجنب الفراغات)
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase().trim());

    // ب. الفلترة بالتصنيف
const matchesCategory = selectedCategory === 'all' || (tx.category && tx.category.trim() === selectedCategory.trim());
    // ج. الفلترة بالعملة وصندوق السحب
    const matchesCurrency = selectedCurrency === 'all' || tx.currency === selectedCurrency;

    // يجب أن تحقق الفاتورة جميع الشروط معاً لتظهر
    return matchesSearch && matchesCategory && matchesCurrency;
  });

  const getCategoryColor = (category: CategoryType) => {
    switch (category?.trim()) {
      case 'اساسي': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'ثانوي': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'ادخار': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'ديون': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-900/50';
      case 'سد ديون': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
      case 'اعدام': return 'bg-gray-100 text-gray-800 line-through dark:bg-slate-800 dark:text-slate-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="w-full rounded-3xl border border-outline-variant bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-bold text-secondary mb-3.75">سجل العمليات التاريخي</h2>

      {/* شريط أدوات الفلترة والبحث المتقدم (شاشة scannable واضحة) */}
      <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-outline-variant bg-surface-container p-4 md:grid-cols-3">
        
        {/* حقل البحث النصي */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-1">ابحث باسم العملية:</label>
          <input
            type="text"
            placeholder="مثال: شراء كتب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface p-3 text-xs outline-none focus:border-primary dark:bg-secondary/10"
          />
        </div>

        {/* منسدلة اختيار التصنيف */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-1">تصفية حسب التصنيف:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface p-3 text-xs outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
          >
            <option value="all">كل التصنيفات</option>
            <option value="اساسي">اساسي</option>
            <option value="ثانوي">ثانوي</option>
            <option value="ادخار">ادخار</option>
            <option value="ديون">ديون</option>
            <option value="سد ديون">سد ديون</option>
            <option value="إعدام">إعدام</option>
          </select>
        </div>

        {/* منسدلة اختيار عملة الصندوق */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-1">تصفية حسب صندوق السحب:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface p-3 text-xs outline-none focus:border-primary dark:bg-slate-800 dark:text-white"
          >
            <option value="all">كل الصناديق (الكل)</option>
            <option value="USD">صندوق الدولار ($)</option>
            <option value="SYP">صندوق الليرة (ل.س)</option>
          </select>
        </div>

      </div>

      {/* عرض الفواتير المفلترة */}
      {filteredTransactions.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          {transactions.length === 0 
            ? "لا توجد أي عمليات مسجلة حتى الآن." 
            : "لم يتم العثور على عمليات تطابق خيارات البحث الحالية!"}
        </div>
      ) : (
        <div className="max-h-100 space-y-3 overflow-y-auto pr-1">
          {filteredTransactions.map((tx:Transaction) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface p-4 transition-all hover:border-primary/30 dark:bg-secondary/10"
            >
              {/* القسم الأيمن: البيانات والتصنيف */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-secondary text-base">{tx.title}</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCategoryColor(tx.category)}`}>
                    {tx.category}
                  </span>
                  {/* شارة مصغرة توضح العملة الأصلية المستخدمة في السحب لزيادة الموثوقية البصرية */}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${tx.currency === 'USD' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {tx.currency === 'USD' ? '$' : 'ل.س'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>

              {/* القسم الأيسر: المبالغ المالية + زر الحذف */}
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-outline-variant bg-surface-container px-3 py-1.5 text-left">
                  <p className="text-sm font-bold text-secondary">
                    {tx.amountUSD.toFixed(2)} $
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    معادل: {Math.round(tx.amountSYP).toLocaleString()} ل.س
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteClick(tx)}
                  className="rounded-full p-2 text-error transition-all hover:bg-error/10"
                  title="حذف العملية واسترداد المبلغ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        title="حذف العملية"
        message={confirmState.tx ? `هل أنت متأكد من حذف عملية "${confirmState.tx.title}" واسترداد المبلغ؟` : ''}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ open: false, tx: null })}
      />
    </div>
  );
}