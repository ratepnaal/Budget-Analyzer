// app/components/PendingBasket.tsx
'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromBasket, clearBasket } from '@/store/basketSlice';
import { withdrawSYP, withdrawUSD, addToSavings } from '@/store/walletSlice';
import { addTransaction } from '@/store/transactionsSlice';
import { CategoryType } from '@/types';

export default function PendingBasket() {
  const dispatch = useAppDispatch();

  // جلب العناصر الحالية من السلة وبيانات المحفظة
  const basketItems = useAppSelector((state) => state.basket.items);
  const { currentExchangeRate, sypBalance, usdBalance } = useAppSelector((state) => state.wallet);

  // حساب المجاميع حسب العملة
  const totalSYP = basketItems
    .filter((item) => item.currency === 'SYP')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalUSD = basketItems
    .filter((item) => item.currency === 'USD')
    .reduce((sum, item) => sum + item.amount, 0);

  // تحقق من إمكانية الدفع دون الوصول إلى رصيد سالب
  const canAfford = (): { ok: boolean; message?: string } => {
    if (totalSYP > sypBalance) {
      return { ok: false, message: `رصيد الليرة المتبقي: ${sypBalance.toLocaleString()} ل.س` };
    }

    if (totalUSD > usdBalance) {
      return { ok: false, message: `رصيد الدولار المتبقي: ${usdBalance.toLocaleString()} $` };
    }

    return { ok: true };
  };

  const handleCheckout = () => {
    if (basketItems.length === 0) return;

    const affordability = canAfford();
    if (!affordability.ok) {
      alert(affordability.message);
      return;
    }

    // ترحيل كل عنصر: احسب الخصم الصحيح، وتعامل مع فئة الادخار بشكل منفصل
    basketItems.forEach((item) => {
      const categoryNormalized = String(item.category || '').trim();

      // إذا كانت الفاتورة تصنف كـ "ادخار"، نضيف المبلغ لصندوق الادخار بدلاً من خصمه من الحساب
      if (categoryNormalized === 'ادخار') {
        // نحسب الادخار بوحدة الليرة إن كانت العملة ليرة، أو نحوله إلى ليرة إن كان بالدولار
        if (item.currency === 'SYP') {
          dispatch(addToSavings(item.amount));
        } else {
          // USD -> convert to SYP then add to savings
          dispatch(addToSavings(item.amount * currentExchangeRate));
        }

        // لا نخصم من الرصيد هنا لأن الادخار يُسجل في صندوق الادخار، حسب متطلباتك

        // سجل المعاملة كتحويل إلى الادخار
        dispatch(
          addTransaction({
            id: item.id,
            title: item.title,
            amountUSD: item.currency === 'USD' ? item.amount : item.amount / currentExchangeRate,
            amountSYP: item.currency === 'SYP' ? item.amount : item.amount * currentExchangeRate,
            exchangeRate: currentExchangeRate,
            category: item.category as CategoryType,
            date: new Date().toLocaleDateString('ar-EG'),
            isPending: false,
            currency: item.currency,
          })
        );
        return;
      }

      // العادة: خصم المبلغ من المحفظة المناسبة
      let finalAmountUSD = 0;
      let finalAmountSYP = 0;

      if (item.currency === 'SYP') {
        dispatch(withdrawSYP(item.amount));
        finalAmountSYP = item.amount;
        finalAmountUSD = item.amount / currentExchangeRate;
      } else {
        dispatch(withdrawUSD(item.amount));
        finalAmountUSD = item.amount;
        finalAmountSYP = item.amount * currentExchangeRate;
      }

      dispatch(
        addTransaction({
          id: item.id,
          title: item.title,
          amountUSD: finalAmountUSD,
          amountSYP: finalAmountSYP,
          exchangeRate: currentExchangeRate,
          category: item.category as CategoryType,
          date: new Date().toLocaleDateString('ar-EG'),
          isPending: false,
          currency: item.currency,
        })
      );
    });

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
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
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