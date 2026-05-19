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
  const categoryColors: Record<CategoryType, string> = {
    'اساسي': 'bg-emerald-500',
    'ثانوي': 'bg-blue-500',
    'ادخار': 'bg-purple-500',
    'ديون': 'bg-red-500',
    'سد ديون': 'bg-orange-500',
    'اعدام': 'bg-gray-500',
  };

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
    <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant w-full">
      <h2 className="text-xl font-bold text-secondary 1.25">تدفق الصناديق حسب التصنيف</h2>
      <p className="text-xs text-gray-400 mb-5">معاينة مقارنة للسحب الفعلي من صندوق الدولار وصندوق الليرة</p>

      {activeCategories.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          لا توجد عمليات نشطة لعرض المخطط المقارن.
        </div>
      ) : (
        <div className="space-y-6">
          {/* حاوية الرسم البياني العمودي المزدوج والمحصن ضد التكرار */}
          <div className="h-60 w-full flex items-end justify-around gap-4 pt-8 border-b border-gray-200 px-2">
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
                  <div className="absolute bottom-full mb-2 bg-secondary text-white text-[11px] p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 text-right whitespace-nowrap min-w-[140px] space-y-1">
                    <p className="font-bold border-b border-white/20 pb-1 text-center mb-1 text-primary">{category}</p>
                    <p className="flex justify-between gap-4">
                      <span>من صندوق $:</span>
                      <span className="font-bold text-emerald-400">{data.usdPure.toFixed(2)} $</span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>من صندوق ل.س:</span>
                      <span className="font-bold text-blue-400">{Math.round(data.sypPure).toLocaleString()} ل.س</span>
                    </p>
                  </div>

                  {/* الحاوية الداخلية للعمودين التوأمين */}
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* عمود الدولار الفرعي */}
                    <div
                      style={{ height: `${usdBarHeight}%` }}
                      className="w-1/2 max-w-4 bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out shadow-sm min-h-[2px]"
                    />

                    {/* عمود الليرة السورية الفرعي */}
                    <div
                      style={{ height: `${sypBarHeight}%` }}
                      className="w-1/2 max-w-4 bg-blue-500 rounded-t-sm transition-all duration-500 ease-out shadow-sm min-h-[2px]"
                    />
                  </div>

                </div>
              );
            })}
          </div>

          {/* أسماء التصنيفات في الأسفل */}
          <div className="flex justify-around gap-4 px-2">
            {activeCategories.map((category) => (
              <div key={category} className="text-center flex-1 truncate">
                <span className="text-[11px] font-bold text-secondary block truncate" title={category}>
                  {category}
                </span>
              </div>
            ))}
          </div>

          {/* دليل الألوان المصغر */}
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray- network-50 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm block" />
              <span className="text-secondary">صندوق الدولار ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-sm block" />
              <span className="text-secondary">صندوق الليرة (ل.س)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}