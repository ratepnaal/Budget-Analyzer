'use client';
import { useAppSelector } from "@/store/hooks";
import { CategoryType } from "@/types";

export default function ExpenseBarChart() {
  const transactions = useAppSelector((state) => state.transactions.list);

  // 1. تهيئة الكائن مسبقاً بجميع التصنيفات المعتمدة بقيم صفرية لقطع الطريق على أي تكرار
  const initialTotals: Record<CategoryType, { usdPure: number; sypPure: number; usdTotal: number }> = {
    'اساسي': { usdPure: 0, sypPure: 0, usdTotal: 0 },
    'ثانوي': { usdPure: 0, sypPure: 0, usdTotal: 0 },
    'ادخار': { usdPure: 0, sypPure: 0, usdTotal: 0 },
    'ديون': { usdPure: 0, sypPure: 0, usdTotal: 0 },
    'سد ديون': { usdPure: 0, sypPure: 0, usdTotal: 0 },
    'اعدام': { usdPure: 0, sypPure: 0, usdTotal: 0 },
  };

  // 2. تجميع البيانات داخل الهيكل الجاهز مع تنظيف النصوص (.trim) لضمان التطابق
  const categoryTotals = transactions.reduce((acc, tx) => {
    // جلب اسم التصنيف وتنظيفه من أي مسافات مخفية قد تأتي من السلة
    const cat = tx.category ? (tx.category.trim() as CategoryType) : null;
    
    // التأكد من أن التصنيف يقع ضمن التصنيفات المعتمدة لدينا في النظام
    if (cat && acc[cat]) {
      if (tx.currency === 'USD') {
        acc[cat].usdPure += tx.amountUSD;
      } else {
        acc[cat].sypPure += tx.amountSYP;
      }
      // حساب الإجمالي المعياري للتصنيف بالدولار
      acc[cat].usdTotal += tx.amountUSD;
    }
    
    return acc;
}, initialTotals); 

  // الألوان المعتمدة لكل تصنيف
  // 3. تصفية التصنيفات النشطة فقط التي تحتوي على صرف فعلي أكبر من صفر لعرضها
  // هنا نضمن استخدام Object.keys لتقصي العناصر بدون أي تكرار للمفاتيح
  const activeCategories = (Object.keys(categoryTotals) as CategoryType[]).filter(
    (cat) => categoryTotals[cat].usdTotal > 0
  );

  // 4. إيجاد أعلى قيمة إنفاق لضبط سقف المخطط العمودي بشكل صحيح
  const maxUSD = Math.max(
    ...Object.values(categoryTotals).map((c) => c.usdTotal),
    1
  )

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-secondary">تدفق الصناديق حسب التصنيف</h2>
      <p className="text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-5">معاينة مقارنة للسحب الفعلي من صندوق الدولار وصندوق الليرة</p>

      {activeCategories.length === 0 ? (
        <div className="py-10 sm:py-16 text-center text-xs sm:text-sm text-gray-400">
          لا توجد عمليات نشطة لعرض المخطط المقارن.
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* حاوية الرسم البياني العمودي المزدوج والمحصن ضد التكرار */}
          <div className="flex h-40 sm:h-60 w-full items-end justify-around gap-2 sm:gap-4 border-b border-outline-variant px-1 sm:px-2 pt-6 sm:pt-8">
            {activeCategories.map((category) => {
              const data = categoryTotals[category];
              
              // جلب سعر الصرف للعملية الأولى في هذا التصنيف، أو افتراض 14500 كمعيار حماية
              const currentRate = transactions.find(t => t.category?.trim() === category)?.exchangeRate || 14500;
              const sypWeightInUSD = data.sypPure / currentRate;

              // حساب الارتفاعات النسبية بدقة بناءً على المجموع الموحد الحقيقي للتصنيف
              const usdBarHeight = (data.usdPure / maxUSD) * 100;
              const sypBarHeight = (sypWeightInUSD / maxUSD) * 100;

              return (
                <div key={category} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                  
                  {/* نافذة تفصيلية منبثقة تفكك مصادر الصرف بدقة مجمعة */}
                  <div className="absolute bottom-full z-10 mb-2 min-w-[120px] sm:min-w-[140px] space-y-1 whitespace-nowrap rounded-xl bg-slate-900 p-2.5 sm:p-3 text-right text-[10px] sm:text-[11px] text-white shadow-xl opacity-0 transition-all duration-200 pointer-events-none group-hover:opacity-100 dark:bg-slate-800">
                    <p className="font-bold border-b border-white/20 pb-1 text-center mb-1 text-primary">{category}</p>
                    <p className="flex justify-between gap-3 sm:gap-4">
                      <span>من صندوق $:</span>
                      <span className="font-bold text-emerald-400">{data.usdPure.toFixed(2)} $</span>
                    </p>
                    <p className="flex justify-between gap-3 sm:gap-4">
                      <span>من صندوق ل.س:</span>
                      <span className="font-bold text-blue-400">{Math.round(data.sypPure).toLocaleString()} ل.س</span>
                    </p>
                  </div>

                  {/* الحاوية الداخلية للعمودين التوأمين */}
                  <div className="flex h-full w-full items-end justify-center gap-0.5 sm:gap-1">
                    {/* عمود الدولار الفرعي */}
                    <div
                      style={{ height: `${usdBarHeight}%` }}
                      className="w-1/2 max-w-3 sm:max-w-4 bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out shadow-sm min-h-[2px]"
                    />

                    {/* عمود الليرة السورية الفرعي */}
                    <div
                      style={{ height: `${sypBarHeight}%` }}
                      className="w-1/2 max-w-3 sm:max-w-4 bg-blue-500 rounded-t-sm transition-all duration-500 ease-out shadow-sm min-h-[2px]"
                    />
                  </div>

                </div>
              );
            })}
          </div>

          {/* أسماء التصنيفات في الأسفل */}
          <div className="flex justify-around gap-2 sm:gap-4 px-1 sm:px-2">
            {activeCategories.map((category) => (
              <div key={category} className="text-center flex-1 truncate">
                <span className="text-[9px] sm:text-[11px] font-bold text-secondary block truncate" title={category}>
                  {category}
                </span>
              </div>
            ))}
          </div>

          {/* دليل الألوان المصغر */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 border-t border-outline-variant pt-3 text-[10px] sm:text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-sm block" />
              <span className="text-secondary">صندوق الدولار ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-sm block" />
              <span className="text-secondary">صندوق الليرة (ل.س)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}