'use client';

import Link from 'next/link';

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between gap-3 px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface text-lg sm:text-xl text-secondary shadow-sm transition hover:bg-primary/10 dark:bg-secondary dark:text-surface lg:hidden"
            aria-label="فتح القائمة"
          >
            ☰
          </button>
          <h1 className="text-base font-bold text-secondary sm:text-xl truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/salary"
            className="inline-flex h-9 sm:h-10 items-center rounded-xl bg-secondary px-3 sm:px-4 text-xs sm:text-sm font-bold text-surface transition hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:hidden">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">إدارة الراتب</span>
            <span className="sm:hidden">الراتب</span>
          </Link>
        </div>
      </div>
    </header>
  );
}