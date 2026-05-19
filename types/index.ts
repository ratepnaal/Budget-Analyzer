// أنواع التصنيفات الستة 

export type CategoryType = 'اعدام'| 'سد ديون' | 'ديون' | 'ادخار' | 'ثانوي' | 'اساسي';

// تمثيل عملية الصرف (Transaction)

export interface Transaction {

    id:string;
    title:string;
    amountUSD:number;
    amountSYP:number;
    exchangeRate: number;
    category: CategoryType;
    date: string;
    isPending: boolean;
    currency:string;
}

// تمثيل حالة الصناديق الأربعة

export interface WalletState {

    usdBalance:number;
    sypBalance:number;
    savingsBalance: number;
    loansBalance: number;
    currentExchangeRate: number; // سعر صرف 1 دولار كم ليرة
}
