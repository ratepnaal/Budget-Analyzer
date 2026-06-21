'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeNotification } from '@/store/notificationsSlice';

const toastStyles = {
  success: 'border-emerald-500/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  error: 'border-red-500/30 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
  info: 'border-cyan-500/30 bg-cyan-50 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100',
  warning: 'border-amber-500/30 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
} as const;

export default function ToastCenter() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      window.setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, notification.duration ?? 3000)
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [dispatch, notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-5 left-1/2 z-50 flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2 sm:gap-3">
      {notifications.slice(-3).map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toastStyles[notification.type]}`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-sm font-bold">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '!'}
              {notification.type === 'warning' && '⚠'}
              {notification.type === 'info' && 'i'}
            </span>
            <p className="text-sm font-medium leading-6">{notification.message}</p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(removeNotification(notification.id))}
            className="rounded-full px-2 py-1 text-base leading-none opacity-70 transition hover:opacity-100"
            aria-label="إغلاق الإشعار"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}