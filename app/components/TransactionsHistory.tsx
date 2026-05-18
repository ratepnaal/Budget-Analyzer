'use client';
import { useAppSelector , useAppDispatch } from "../store/hooks";
import { CategoryType } from "../types";
import { refundSYP , refundUSD  } from "../store/walletSlice";
import { deleteTransaction } from "../store/transactionsSlice";
import { Transaction } from "../types";

export default function TransactionsHistory() {
      const transactions = useAppSelector((state) => state.transactions.list);
      const dispatch = useAppDispatch();

      const handleDeleteClick = (tx:Transaction) => {
console.log("الفاتورة المراد حذفها تحتوي على البيانات التالية:", tx);

          const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في حذف عملية "${tx.title}" والتراجع عن خصمها المالي؟`);
          
          if (confirmDelete) {
            // 1. هندسة الـ Rollback: التحقق من العملة الأصلية للفاتورة لرد المبلغ للصندوق الصحيح
            if (tx.currency === 'SYP') {

                    alert(`تم رد مبلغ ${tx.amountSYP} ل.س إلى صندوق الليرة`);
              
              // إذا كانت بالليرة، نرد القيمة الأصلية كاملة لصندوق الليرة
              dispatch(refundSYP(tx.amountSYP));
            } else {
              // إذا كانت بالدولار، نرد القيمة الأصلية كاملة لصندوق الدولار
              
                    alert(`تم رد مبلغ ${tx.amountUSD} $ إلى صندوق الدولار`);
              
              dispatch(refundUSD(tx.amountUSD));
            }
      
            // 2. حذف الفاتورة نهائياً من السجل التاريخي
            dispatch(deleteTransaction(tx.id));
          }
        };

      const getCategoryColor = (category: CategoryType) => {
          switch (category) {
            case 'اساسي':
              return 'bg-emerald-100 text-emerald-800';
            case 'ثانوي':
              return 'bg-blue-100 text-blue-800';
            case 'ادخار':
              return 'bg-purple-100 text-purple-800';
            case 'ديون':
              return 'bg-red-100 text-red-800 border border-red-200'; // لتمييز الديون
            case 'سد ديون':
              return 'bg-orange-100 text-orange-800';
            case 'اعدام':
              return 'bg-gray-100 text-gray-800 line-through';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
     return (
        <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant w-full">
          
          <h2 className="text-xl font-bold text-secondary mb-5">سجل العمليات التاريخي</h2>
    
          {/*  ماذا لو كان السجل فارغاً؟ */}
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              لا توجد أي عمليات مسجلة حتى الآن. ابدأ بإضافة فاتورة أو تصريف عملة.
            </div>
          ) : (
            // عرض القائمة في حال وجود بيانات
            <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-100 hover:border-primary/30 transition-all"
                >
                  {/* القسم الأيمن: اسم العملية، التاريخ، والنوع */}
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-secondary text-base">{tx.title}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCategoryColor(tx.category)}`}>
                        {tx.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
    
                  {/* القسم الأيسر: المبالغ المالية بدقة بالغة */}
                  <div className="text-left bg-white/60 px-3 py-1.5 rounded-md border border-gray-50">
                    {/* القيمة الأساسية المرجعية بالدولار دائماً كمبدأ للمشروع */}
                    <p className="text-sm font-bold text-secondary">
                      {tx.amountUSD.toFixed(2)} $
                    </p>
                    {/* المعادل بالليرة السورية لحظة وقوع العملية */}
                    <p className="text-xs text-gray-500 mt-0.5">
                      معادل: {Math.round(tx.amountSYP).toLocaleString()} ل.س
                    </p>
                  </div>

                {/* زر التراجع والحذف الأحمر */}
                <button
                  onClick={() => handleDeleteClick(tx)}
                  className="text-error hover:bg-red-50 p-2 rounded-full transition-all"
                  title="حذف العملية واسترداد المبلغ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>





    
                </div>
              ))}
            </div>
          )}
        </div>
      );
}
