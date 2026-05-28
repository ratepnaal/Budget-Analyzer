'use client';
import { useState } from 'react';
import { useAppDispatch , useAppSelector  } from '@/store/hooks';
import { transferUsdToSyp } from '@/store/walletSlice';

export default function TransferForm() {
const dispatch = useAppDispatch();

  const { usdBalance, currentExchangeRate } = useAppSelector((state) => state.wallet);
  
// State المحلية الخاصة بمدخلات هذا النموذج فقط

  const [usdAmountInput, setUsdAmountInput] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  //  حساب القيمة المتوقعة بالليرة بشكل حي أثناء الكتابة

  const amountToReceiveSYP = Number(usdAmountInput) * currentExchangeRate;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToTransfer = Number(usdAmountInput);

    if (amountToTransfer <= 0) {
      setError('يرجى إدخال مبلغ أكبر من الصفر');
      return;
    }

    if (amountToTransfer > usdBalance) {
      setError(`رصيدك الحالي (${usdBalance}$) لا يكفي لإتمام هذه العملية`);
      return;
    }

    // إذا نجحت الشروط، نرسل الأمر إلى Redux
    dispatch(transferUsdToSyp(amountToTransfer));
    
    setUsdAmountInput('');
    setError(null);
  };

return( 
    <div className="w-full max-w-md rounded-[28px] border border-outline-variant bg-surface p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-secondary">تصريف عملة (إلى صندوق الليرة)</h2>
      <p className="mb-4 text-xs text-gray-500">سعر الصرف المعتمد حالياً: 1$ = {currentExchangeRate.toLocaleString()} ل.س</p>

      <form onSubmit={handleTransfer} className="space-y-4">
        {/* حقل إدخال الدولار */}
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">المبلغ بالدولار ($)</label>
          <input
            type="number"
            value={usdAmountInput}
            onChange={(e) => {
              setUsdAmountInput(e.target.value);
              if (error) setError(null); 
            }}
            className="w-full rounded-2xl border border-outline-variant bg-surface p-3 outline-none transition-all focus:border-primary dark:bg-secondary/10"
            placeholder="مثال: 100"
            required
          />
        </div>

        {/* العرض الحي للمبلغ بالليرة */}
        {amountToReceiveSYP > 0 && (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-surface-container p-3 text-sm text-secondary">
            المبلغ الذي سيتم إضافته لصندوق الليرة: <span className="font-bold text-primary-dark">{amountToReceiveSYP.toLocaleString()} ل.س</span>
          </div>
        )}

        {/* عرض رسالة الخطأ إن وجدت */}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-semibold text-error">
            {error}
          </p>
        )}

        {/* زر التنفيذ */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-primary py-3 font-bold text-slate-900 shadow-md shadow-primary/10 transition-all hover:bg-primary-dark"
        >
          تأكيد التحويل والتصريف
        </button>
      </form>
    </div>
    
)
}  