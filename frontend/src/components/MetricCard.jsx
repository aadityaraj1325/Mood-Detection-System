import GlassCard from './GlassCard';

function MetricCard({ title, value, hint, trendLabel, icon: Icon }) {
  return (
    <GlassCard className="h-[180px] border-l-[3px] border-l-neural-500 p-5 shadow-glow">
      <div className="flex items-center justify-between">
        {Icon ? <Icon size={28} className="text-neural-400" /> : <span />}
      </div>
      <p className="metric-font mt-5 text-4xl text-gradient-neural">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{title}</p>
      {trendLabel ? <p className="mt-2 text-xs text-neural-300">{trendLabel}</p> : null}
      {hint ? <p className="mt-1 text-xs text-text-muted">{hint}</p> : null}
    </GlassCard>
  );
}

export default MetricCard;
