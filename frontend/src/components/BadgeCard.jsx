import GlassCard from './GlassCard';

function BadgeCard({ name, points = 0, rarity = 'Rare', unlocked = false }) {
  return (
    <GlassCard
      className={`p-5 text-center transition ${unlocked ? '' : 'grayscale-[0.75] opacity-60'}`}
      style={unlocked ? { boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' } : undefined}
    >
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center"
        style={{
          clipPath:
            'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
          background: 'var(--gold-badge)'
        }}
      >
        <span className="font-display text-lg text-bg-void">{unlocked ? '★' : '•'}</span>
      </div>

      <h3 className="font-display mt-4 text-lg text-text-primary">{name}</h3>
      <p className="mt-1 text-sm text-text-secondary">{points} XP earned</p>
      <p className="mt-2 text-xs text-text-muted">Rarity: {rarity}</p>
    </GlassCard>
  );
}

export default BadgeCard;
