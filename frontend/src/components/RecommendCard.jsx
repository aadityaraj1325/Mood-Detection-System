import GlassCard from './GlassCard';

function RecommendCard({ category = 'Mindfulness', title, description, onStart }) {
  return (
    <GlassCard className="flex h-full flex-col p-5">
      <span className="inline-flex w-fit rounded-full border border-border-glass bg-glass-ultra px-3 py-1 text-xs text-neural-300">
        {category}
      </span>

      <h3 className="font-display mt-4 text-xl text-text-primary">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-text-secondary">{description}</p>

      <div className="mt-5 border-t border-border-subtle pt-3">
        <button type="button" className="btn-ghost ml-auto block" onClick={onStart}>
          Start Activity ->
        </button>
      </div>
    </GlassCard>
  );
}

export default RecommendCard;
