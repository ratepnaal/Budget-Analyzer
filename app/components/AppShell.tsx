'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ThemeSync from './ThemeSync';
import ToastCenter from './ToastCenter';
import FloatingActionButton from './FloatingActionButton';
import BackToDashboardButton from './BackToDashboardButton';

interface AppShellProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  '/': 'لوحة التحكم',
  '/salary': 'إدارة الراتب',
  '/invoices': 'سجل الفواتير',
  '/invoice-manage': 'إضافة فاتورة',
  '/loans': 'صندوق القروض',
  '/savings': 'صندوق الادخار',
  '/settings': 'الإعدادات',
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => pageTitles[pathname] ?? 'محلل الميزانية', [pathname]);

  return (
    <div className="min-h-screen bg-surface text-secondary">
      <ThemeSync />
      <Navbar title={title} onMenuClick={() => setSidebarOpen((current) => !current)} />

      <div className="relative grid w-full min-h-[calc(100vh-4rem)] grid-cols-1 gap-3 lg:grid-cols-[18rem_1fr]">
        <div className="order-1 lg:col-start-1 lg:col-end-2">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <main className="min-w-0 order-2 flex-1 px-4 pb-10 pt-2 sm:px-6 lg:px-8 lg:col-start-2 lg:col-end-3">
          <BackToDashboardButton hidden={pathname === '/'} />
          {children}
        </main>
      </div>

      <FloatingActionButton hidden={pathname === '/invoice-manage'} />
      <ToastCenter />
    </div>
  );
}