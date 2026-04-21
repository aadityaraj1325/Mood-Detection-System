import { useEffect } from 'react';

function ToastNotification({ toast, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, onClose, toast]);

  if (!toast) return null;

  const accentByType = {
    success: 'var(--success)',
    info: 'var(--neural-400)',
    warning: 'var(--warning)',
    error: 'var(--error)'
  };

  const accent = accentByType[toast.type] || accentByType.info;

  return (
    <div
      className="glass-card pointer-events-auto relative overflow-hidden rounded-md p-3 text-sm text-text-primary"
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{toast.title || 'Notification'}</p>
          {toast.message ? <p className="mt-1 text-text-secondary">{toast.message}</p> : null}
        </div>
        <button type="button" className="text-text-muted" onClick={onClose}>
          x
        </button>
      </div>

      <div className="mt-3 h-1 w-full rounded-full bg-glass-ultra">
        <div
          className="h-1 rounded-full"
          style={{
            width: '100%',
            background: accent,
            animation: `toast-progress ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
}

export default ToastNotification;
