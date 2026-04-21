function MoodOrb({ label = 'Neutral', active = false }) {
  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-full text-xs text-text-primary ${
        active ? 'scale-105' : 'scale-95'
      }`}
      style={{
        background: 'var(--gradient-neutral)',
        boxShadow: active ? '0 0 24px rgba(0, 170, 255, 0.4)' : '0 0 10px rgba(0, 170, 255, 0.2)'
      }}
    >
      {label}
    </div>
  );
}

export default MoodOrb;
