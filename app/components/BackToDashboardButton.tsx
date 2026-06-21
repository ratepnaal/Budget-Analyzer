'use client';

import Link from 'next/link';

interface BackToDashboardButtonProps {
  hidden?: boolean;
}

export default function BackToDashboardButton({ hidden = false }: BackToDashboardButtonProps) {
  if (hidden) return null;

  return (
    <div className="pb-3 sm:px-0 sm:pb-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-secondary/15 bg-surface px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-secondary shadow-sm transition hover:border-primary hover:bg-primary/10 dark:bg-secondary dark:text-surface"
      >
        <span>←</span>
        <span>العودة إلى لوحة القيادة</span>
      </Link>
    </div>
  );
}