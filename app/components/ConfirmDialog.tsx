'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-outline-variant bg-surface p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-secondary">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-gray-500">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-secondary px-4 py-3 text-sm font-bold text-surface transition hover:opacity-90"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-outline-variant bg-surface px-4 py-3 text-sm font-bold text-secondary transition hover:bg-surface/90 dark:bg-secondary/10"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}