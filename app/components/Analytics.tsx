'use client';
import { useAppSelector } from "../store/hooks";
import { CategoryType } from "../types";

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
    <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant w-full h-full">
      <h2 className="text-xl font-bold text-secondary mb-5">التحليل المالي الذكي</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          أضف بعض العمليات في السجل لتظهر لك الرسوم البيانية ونسب التوزيع هنا.
        </div>
      ) : (
        <div className="space-y-6">
          {/* كارد عرض إجمالي الإنفاق المعياري */}
          <div className="bg-surface p-4 rounded-lg border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-medium">إجمالي حجم الإنفاق المسجل</p>
              <p className="text-2xl font-black text-secondary mt-1">
                {totalExpensesUSD.toFixed(2)} $
              </p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
              {transactions.length} عملية حية
            </span>
          </div>

          {/* قائمة التوزيع البصري للتصنيفات */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">نسب توزيع المصاريف:</p>
            
            {Object.keys(categoryStyles).map((catKey) => {
              const category = catKey as CategoryType;
              const amount = categoryTotals[category] || 0;
              
              // حساب النسبة المئوية بدقة (إذا كان الإجمالي صفر نضع النسبة صفر منوعاً لأخطاء القسمة)
              const percentage = totalExpensesUSD > 0 ? (amount / totalExpensesUSD) * 100 : 0;
              
              // إذا لم تكن هناك مصاريف في هذا التصنيف، لن نعرض شريطاً فارغاً لتوفير مساحة scannable
              if (amount === 0) return null;

              const styles = categoryStyles[category];

              return (
                <div key={category} className="space-y-1.5 animate-fade-in">
                  {/* السطر العلوي للتصنيف: الاسم والنسبة والمبلغ */}
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${styles.bar}`} />
                      <span className="text-secondary">{category}</span>
                    </div>
                    <div className="text-gray-500">
                      <span className="font-bold text-secondary">{percentage.toFixed(1)}%</span>
                      <span className="mx-1">({amount.toFixed(1)}$)</span>
                    </div>
                  </div>

                  {/* شريط التقدم البصري (Progress Bar Component) */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
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