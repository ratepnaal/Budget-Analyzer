'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const routes = [
  { href: '/invoices', label: 'سجل الفواتير' },
  { href: '/loans', label: 'صندوق القروض' },
  { href: '/savings', label: 'صندوق الادخار' },
  { href: '/settings', label: 'الإعدادات' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label="إغلاق القائمة"
      />

      <aside
        className={`fixed top-16 right-0 bottom-0 z-40 w-72 border-l border-outline-variant bg-surface shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:shadow-none lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-5">
          <span className="text-lg font-bold text-secondary">القائمة</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-xl text-secondary transition hover:bg-primary/10 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            ×
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isActive ? 'border-primary bg-primary/10 text-secondary' : 'border-transparent text-secondary hover:border-outline-variant hover:bg-surface/80'}`}
              >
                <span>{route.label}</span>
                <span className="text-xs text-gray-400">→</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}