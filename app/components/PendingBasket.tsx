// app/components/PendingBasket.tsx
'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromBasket, clearBasket } from '@/store/basketSlice';
import { withdrawSYP, withdrawUSD, depositSYP, depositUSD, addToSavings, repayLoan } from '@/store/walletSlice';
import { addTransaction } from '@/store/transactionsSlice';
import { addNotification } from '@/store/notificationsSlice';
import { CategoryType } from '@/types';
import ConfirmDialog from './ConfirmDialog';

export default function PendingBasket() {
  const dispatch = useAppDispatch();
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; onConfirm: (() => void) | null }>({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // جلب العناصر الحالية من السلة وبيانات المحفظة
  const basketItems = useAppSelector((state) => state.basket.items);
  const { currentExchangeRate, sypBalance, usdBalance, loansBalance } = useAppSelector((state) => state.wallet);

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
      dispatch(addNotification({ type: 'error', message: affordability.message ?? 'تعذر إتمام العملية', duration: 3000 }));
      return;
    }

    // تحقق ما إذا كان مجموع السداد لفواتير "سد ديون" يتجاوز رصيد القروض المتاح
    const totalDebtUSD = basketItems
      .filter((item) => String(item.category || '').trim() === 'سد ديون')
      .reduce((sum, item) => sum + (item.currency === 'USD' ? item.amount : item.amount / currentExchangeRate), 0);

    if (totalDebtUSD > loansBalance) {
      setConfirmState({
        open: true,
        title: 'تنبيه سداد القروض',
        message: `مجموع السداد المطلوب للقروض هو ${totalDebtUSD.toFixed(2)}$، وهو أكبر من رصيد القروض المتاح ${loansBalance.toFixed(2)}$. سيتم إرجاع الفائض إلى الصندوق المدفوع.`,
        onConfirm: () => {
          setConfirmState((current) => ({ ...current, open: false }));
          processCheckout();
        },
      });
      return;
    }

    processCheckout();
  };

  const processCheckout = () => {
    if (basketItems.length === 0) return;

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

      // إذا كانت الفاتورة لتسديد دين: نخفض من صندوق العملة المستخدمة ونخفض من صندوق القروض (بوحدة USD)
      if (categoryNormalized === 'سد ديون') {
        let finalAmountUSD = 0;

        if (item.currency === 'SYP') {
          dispatch(withdrawSYP(item.amount));
          finalAmountUSD = item.amount / currentExchangeRate;
        } else {
          dispatch(withdrawUSD(item.amount));
          finalAmountUSD = item.amount;
        }

        // حد السداد الفعلي بواسطة رصيد القروض المتاح
        const repayRequestedUSD = finalAmountUSD;
        const repayAvailableUSD = loansBalance;
        const repayUsedUSD = Math.min(repayRequestedUSD, repayAvailableUSD);
        const surplusUSD = Math.max(0, repayRequestedUSD - repayAvailableUSD);

        if (repayUsedUSD > 0) dispatch(repayLoan(repayUsedUSD));

        // إرجاع الفائض إلى الصندوق الأصلي بحسب العملة
        if (surplusUSD > 0) {
          if (item.currency === 'USD') {
            dispatch(depositUSD(surplusUSD));
          } else {
            const surplusSYP = surplusUSD * currentExchangeRate;
            dispatch(depositSYP(surplusSYP));
          }
        }

        // سجل المعاملة بالمبلغ المستخدم فعلياً في السداد
        const recordedUSD = repayUsedUSD;
        const recordedSYP = recordedUSD * currentExchangeRate;

        dispatch(
          addTransaction({
            id: item.id,
            title: item.title,
            amountUSD: recordedUSD,
            amountSYP: recordedSYP,
            exchangeRate: currentExchangeRate,
            category: item.category as CategoryType,
            date: new Date().toLocaleDateString('ar-EG'),
            isPending: false,
            currency: item.currency,
          })
        );

        return;
      }
    });

    dispatch(clearBasket());
    dispatch(addNotification({ type: 'success', message: 'تم ترحيل كافة الفواتير المعلقة وتحديث الصناديق والسجل بنجاح!', duration: 3000 }));
  };

  return (
    <div className="w-full rounded-3xl border border-outline-variant bg-surface p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-secondary">الفواتير المعلقة الحالية</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {basketItems.length} معلقة
        </span>
      </div>

      {basketItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant py-8 text-center text-sm text-gray-400">
          السلة فارغة حالياً. أضف فواتير من النموذج لتظهر هنا قبل ترحيلها.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-[250px] space-y-2 overflow-y-auto">
            {basketItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-outline-variant/70 bg-surface p-3 text-sm dark:bg-secondary/10">
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
                    className="rounded-lg px-2 py-1 text-xs font-bold text-error transition-colors hover:bg-error/10"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 rounded-2xl border border-outline-variant bg-surface-container p-4 text-xs text-secondary">
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
            className="w-full rounded-2xl bg-primary py-3 font-bold text-slate-900 shadow-md shadow-primary/10 transition-all hover:bg-primary-dark"
          >
            ترحيل وتأكيد خصم الفواتير المعلقة
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="متابعة الترحيل"
        cancelLabel="إلغاء"
        onConfirm={() => confirmState.onConfirm?.()}
        onCancel={() => setConfirmState((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}