'use client';
import { useAppDispatch , useAppSelector } from '../store/hooks';
import { removeFromBasket , clearBasket } from '../store/basketSlice';
import { withdrawSYP , withdrawUSD } from '../store/walletSlice';
import { addTransaction } from '../store/transactionsSlice';
import { CategoryType } from '../types';

export default function PendingBasket() {
  const dispatch = useAppDispatch();
  
  // 1. جلب العناصر الحالية من السلة وسعر الصرف من محفظة الـ Redux
  const basketItems = useAppSelector((state) => state.basket.items);
  const { currentExchangeRate } = useAppSelector((state) => state.wallet);

  // 2. حساب المجاميع الحية لعرضها في أسفل السلة قبل الترحيل
  const totalSYP = basketItems
    .filter(item => item.currency === 'SYP')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalUSD = basketItems
    .filter(item => item.currency === 'USD')
    .reduce((sum, item) => sum + item.amount, 0);

  // 3. دالة الترحيل الكبرى (The Commit Function)
  const handleCheckout = () => {
    if (basketItems.length === 0) return;

    // المرور على كل فاتورة معلقة ومعالجتها بدقة بشكل منفصل
    basketItems.forEach((item) => {
      let finalAmountUSD = 0;
      let finalAmountSYP = 0;

      if (item.currency === 'SYP') {
   // الخصم حصراً من صندوق الليرة المنفصل 

        dispatch(withdrawSYP(item.amount));
        finalAmountSYP = item.amount;
        finalAmountUSD = item.amount / currentExchangeRate; // المعادل للتقارير
      } else {
        // الخصم حصراً من صندوق الدولار

        dispatch(withdrawUSD(item.amount));
        finalAmountUSD = item.amount;
        finalAmountSYP = item.amount * currentExchangeRate; // المعادل للتقارير
      }

      // تحويل الفاتورة المعلقة إلى فاتورة رسمية في السجل التاريخي
        dispatch(addTransaction({
        id: item.id,
        title: item.title,
        amountUSD: finalAmountUSD,
        amountSYP: finalAmountSYP,
        exchangeRate: currentExchangeRate,
        category: item.category as CategoryType ,
        date: new Date().toLocaleDateString('ar-EG'),
        isPending: false
      }));
    });

    // بعد ترحيل كافة الفواتير بنجاح، نقوم بتفريغ السلة تماماً

    dispatch(clearBasket());
    alert('تم ترحيل كافة الفواتير المعلقة وتحديث الصناديق والسجل بنجاح!');
  };

  return (
    <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-secondary">الفواتير المعلقة الحالية</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          {basketItems.length} معلقة
        </span>
      </div>

      {basketItems.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
          السلة فارغة حالياً. أضف فواتير من النموذج لتظهر هنا قبل ترحيلها.
        </div>
      ) : (
        <div className="space-y-4">
          {/* قائمة العناصر المعلقة */}
          <div className="space-y-2 max-h-62.5 overflow-y-auto">
            {basketItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-surface rounded-lg border border-gray-50 text-sm">
                <div>
                  <p className="font-semibold text-secondary">{item.title}</p>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-secondary">
                    {item.amount.toLocaleString()} {item.currency === 'SYP' ? 'ل.س' : '$'}
                  </p>
                  {/* زر حذف عنصر من السلة في حال التراجع */}
                  <button 
                    onClick={() => dispatch(removeFromBasket(item.id))}
                    className="text-error hover:text-red-700 font-bold px-2 py-1 rounded transition-colors text-xs"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ملخص المجاميع المعلقة قبل تأكيد الخصم */}
          <div className="bg-surface-container p-4 rounded-lg space-y-1.5 text-xs text-secondary border border-outline-variant">
            <p className="font-bold mb-1 text-sm text-secondary">المجموع المطلوب ترحيله الخصم:</p>
            {totalSYP > 0 && (
              <div className="flex justify-between">
                <span>من صندوق الليرة:</span>
                <span className="font-bold text-primary-dark">{totalSYP.toLocaleString()} ل.س</span>
              </div>
            )}
            {totalUSD > 0 && (
              <div className="flex justify-between">
                <span>من صندوق الدولار:</span>
                <span className="font-bold text-secondary">{totalUSD.toLocaleString()} $</span>
              </div>
            )}
          </div>

          {/* زر الترحيل النهائي الفعال */}
          <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-md transition-all shadow-md shadow-primary/10"
          >
            ترحيل وتأكيد خصم الفواتير المعلقة
          </button>
        </div>
      )}
    </div>
  );
}