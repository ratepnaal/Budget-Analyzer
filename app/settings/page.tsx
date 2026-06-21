'use client';

import Settings from '../components/Settings';

export default function SettingsPage() {
  return (
    <main className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-[28px] border border-outline-variant bg-surface p-4 sm:p-6 shadow-sm lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-secondary">الإعدادات</h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">تغيير سعر الصرف ووضع الواجهة العام فقط.</p>
      </div>

      <div className="max-w-2xl">
        <Settings />
      </div>
    </main>
  );
}