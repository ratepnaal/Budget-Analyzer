'use client';

import Link from 'next/link';

interface FloatingActionButtonProps {
  hidden?: boolean;
}

export default function FloatingActionButton({ hidden = false }: FloatingActionButtonProps) {
  if (hidden) return null;

  return (
    <Link
      href="/invoice-manage"
      className="fixed bottom-20 left-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/25 transition hover:scale-105 hover:bg-primary-dark lg:bottom-5 lg:left-5"
      aria-label="إضافة فاتورة"
      title="إضافة فاتورة"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}