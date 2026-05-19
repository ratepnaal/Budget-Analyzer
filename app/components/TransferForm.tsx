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
    <div className="bg-white p-6 rounded-card shadow-sm border border-outline-variant max-w-md w-full">
      <h2 className="text-xl font-bold text-secondary mb-2">تصريف عملة (إلى صندوق الليرة)</h2>
      <p className="text-xs text-gray-500 mb-4">سعر الصرف المعتمد حالياً: 1$ = {currentExchangeRate.toLocaleString()} ل.س</p>

      <form onSubmit={handleTransfer} className="space-y-4">
        {/* حقل إدخال الدولار */}
        <div>
          <label className="block text-sm font-medium mb-1 text-secondary">المبلغ بالدولار ($)</label>
          <input
            type="number"
            value={usdAmountInput}
            onChange={(e) => {
              setUsdAmountInput(e.target.value);
              if (error) setError(null); 
            }}
            className="w-full p-3 border rounded-md outline-none focus:border-primary transition-all"
            placeholder="مثال: 100"
            required
          />
        </div>

        {/* العرض الحي للمبلغ بالليرة */}
        {amountToReceiveSYP > 0 && (
          <div className="bg-surface p-3 rounded-md border border-dashed border-primary/30 text-sm text-secondary">
            المبلغ الذي سيتم إضافته لصندوق الليرة: <span className="font-bold text-primary-dark">{amountToReceiveSYP.toLocaleString()} ل.س</span>
          </div>
        )}

        {/* عرض رسالة الخطأ إن وجدت */}
        {error && (
          <p className="text-error text-xs font-semibold bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        {/* زر التنفيذ */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-md transition-all shadow-md shadow-primary/10"
        >
          تأكيد التحويل والتصريف
        </button>
      </form>
    </div>
    
)
}  