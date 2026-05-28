'use client';

import Link from 'next/link';

interface BackToDashboardButtonProps {
  hidden?: boolean;
}

export default function BackToDashboardButton({ hidden = false }: BackToDashboardButtonProps) {
  if (hidden) return null;

  return (
    <div className="px-4 pt-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-2xl border border-secondary/15 bg-surface px-4 py-2 text-sm font-bold text-secondary shadow-sm transition hover:border-primary hover:bg-primary/10 dark:bg-secondary dark:text-surface"
      >
        <span>←</span>
        <span>العودة إلى لوحة القيادة</span>
      </Link>
    </div>
  );
}