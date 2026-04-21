import GlassCard from './GlassCard';

function MoodCard({ emotion = 'Neutral', confidence = 0, detectedAt = '' }) {
  const safeConfidence = Math.max(0, Math.min(1, confidence));
  const percent = Math.round(safeConfidence * 100);

  const gradientByEmotion = {
    Happy: 'var(--gradient-happy)',
    Neutral: 'var(--gradient-neutral)',
    Sad: 'var(--gradient-sad)'
  };

  return (
    <GlassCard className="p-5" style={{ background: 'var(--glass-light)' }}>
      <div className="flex items-center justify-between">
        <div
          aria-hidden="true"
          className="h-16 w-16 animate-pulse rounded-full"
          style={{ background: gradientByEmotion[emotion] || gradientByEmotion.Neutral }}
        />
        <span className="rounded-full border border-border-glass px-3 py-1 text-xs text-text-secondary">
          Live Mood
        </span>
      </div>

      <p className="font-display mt-4 text-3xl text-text-primary">{emotion}</p>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>Confidence</span>
          <span className="metric-font">{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-glass-ultra">
          <div
            className="h-2 rounded-full"
            style={{ width: `${percent}%`, background: 'var(--gradient-neural)' }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        {detectedAt ? `Detected ${detectedAt}` : 'Waiting for latest analysis'}
      </p>
    </GlassCard>
  );
}

export default MoodCard;
