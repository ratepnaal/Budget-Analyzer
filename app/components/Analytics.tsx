'use client';
import { useAppSelector } from "@/store/hooks";
import { CategoryType } from "@/types";

export default function Analytics() {
  // 1. جلب العمليات الحالية من المخزن المركزي
  const transactions = useAppSelector((state) => state.transactions.list);

  // 2. حساب إجمالي المصاريف (سنعتمد الدولار كعملة معيارية للتحليل لتوحيد النسب)
  const totalExpensesUSD = transactions.reduce((sum, tx) => sum + tx.amountUSD, 0);

  // 3. تجميع المبالغ حسب التصنيف
  const categoryTotals = transactions.reduce((acc, tx) => {
    const cat = tx.category;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += tx.amountUSD;
    return acc;
  }, {} as Record<CategoryType, number>);

  // 4. مصفوفة إعدادات الألوان لتطابق تماماً الهوية البصرية للسجل التاريخي
  const categoryStyles: Record<CategoryType, { bar: string; text: string; bg: string }> = {
    'اساسي': { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    'ثانوي': { bar: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
    'ادخار': { bar: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50' },
    'ديون': { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
    'سد ديون': { bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    'اعدام': { bar: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50' },
  };

  return (
    <div className="h-full w-full rounded-2xl sm:rounded-3xl border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm">
      <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-secondary">التحليل المالي الذكي</h2>

      {transactions.length === 0 ? (
        <div className="py-8 sm:py-12 text-center text-xs sm:text-sm text-gray-400">
          أضف بعض العمليات في السجل لتظهر لك الرسوم البيانية ونسب التوزيع هنا.
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* كارد عرض إجمالي الإنفاق المعياري */}
          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-outline-variant bg-surface-container p-3 sm:p-4">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">إجمالي حجم الإنفاق المسجل</p>
              <p className="text-lg sm:text-2xl font-black text-secondary mt-0.5 sm:mt-1">
                {totalExpensesUSD.toFixed(2)} $
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-primary">
              {transactions.length} عملية حية
            </span>
          </div>

          {/* قائمة التوزيع البصري للتصنيفات */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">نسب توزيع المصاريف:</p>
            
            {Object.keys(categoryStyles).map((catKey) => {
              const category = catKey as CategoryType;
              const amount = categoryTotals[category] || 0;
              
              // حساب النسبة المئوية بدقة (إذا كان الإجمالي صفر نضع النسبة صفر منوعاً لأخطاء القسمة)
              const percentage = totalExpensesUSD > 0 ? (amount / totalExpensesUSD) * 100 : 0;
              
              // إذا لم تكن هناك مصاريف في هذا التصنيف، لن نعرض شريطاً فارغاً لتوفير مساحة scannable
              if (amount === 0) return null;

              const styles = categoryStyles[category];

              return (
                <div key={category} className="space-y-1 sm:space-y-1.5">
                  {/* السطر العلوي للتصنيف: الاسم والنسبة والمبلغ */}
                  <div className="flex justify-between items-center text-[11px] sm:text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${styles.bar}`} />
                      <span className="text-secondary">{category}</span>
                    </div>
                    <div className="text-gray-500">
                      <span className="font-bold text-secondary">{percentage.toFixed(1)}%</span>
                      <span className="mx-0.5 sm:mx-1">({amount.toFixed(1)}$)</span>
                    </div>
                  </div>

                  {/* شريط التقدم البصري (Progress Bar Component) */}
                  <div className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-secondary/20">
                    <div 
                      className={`h-full ${styles.bar} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}