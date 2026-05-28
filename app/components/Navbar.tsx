'use client';

import Link from 'next/link';

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface text-xl text-secondary shadow-sm transition hover:bg-primary/10 dark:bg-secondary dark:text-surface lg:hidden"
            aria-label="فتح القائمة"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-secondary sm:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/salary"
            className="inline-flex h-10 items-center rounded-xl bg-secondary px-4 text-sm font-bold text-surface transition hover:opacity-90"
          >
            إدارة الراتب
          </Link>
        </div>
      </div>
    </header>
  );
}