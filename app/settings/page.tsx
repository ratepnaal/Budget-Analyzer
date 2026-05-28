'use client';

import Settings from '../components/Settings';

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <div className="rounded-[28px] border border-outline-variant bg-surface p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-bold text-secondary">الإعدادات</h2>
        <p className="mt-2 text-sm text-gray-500">تغيير سعر الصرف ووضع الواجهة العام فقط.</p>
      </div>

      <div className="max-w-2xl">
        <Settings />
      </div>
    </main>
  );
}