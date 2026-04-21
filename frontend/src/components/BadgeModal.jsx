function BadgeModal({ open, badgeName, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/45 p-4">
      <div className="glass-card w-full max-w-md p-6 text-center">
        <p className="text-sm text-text-secondary">Badge Unlocked</p>
        <h3 className="font-display mt-2 text-xl text-text-primary">{badgeName || 'New Badge'}</h3>
        <button type="button" className="mt-4 rounded-md border border-border-glow px-4 py-2 text-neural-300" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default BadgeModal;
