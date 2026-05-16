'use client';
import { useAppSelector } from "../store/hooks";
import { CategoryType } from "../types";

export default function TransactionsHistory() {
      const transactions = useAppSelector((state) => state.transactions.list);

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
    
                </div>
              ))}
            </div>
          )}
        </div>
      );
}
