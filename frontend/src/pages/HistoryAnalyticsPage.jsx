import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getAnalytics, getHistory } from '../services/moodService';

const ranges = [
  { key: 'weekly', label: 'Week' },
  { key: 'monthly', label: 'Month' },
  { key: 'yearly', label: 'All Time' }
];

function HistoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-cyan-200/25 bg-slate-950/80 px-3 py-2 text-xs backdrop-blur-xl">
      <p className="text-slate-200">Confidence: {Math.round(payload[0].value * 100)}%</p>
    </div>
  );
}

function HistoryAnalyticsPage() {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState({ weekly: [], monthly: [], yearly: [], stress_score: 0, predicted_next_mood: 'Neutral' });
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('monthly');

  const currentSeries = useMemo(() => analytics[selectedRange] || [], [analytics, selectedRange]);
  const stressScore = Math.round(analytics.stress_score || 0);
  const resilienceScore = Math.max(0, 100 - stressScore);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [historyData, analyticsData] = await Promise.all([getHistory(), getAnalytics()]);
        setHistory(historyData.items || []);
        setAnalytics({
          weekly: analyticsData.weekly || [],
          monthly: analyticsData.monthly || [],
          yearly: analyticsData.yearly || analyticsData.monthly || [],
          stress_score: analyticsData.stress_score || 0,
          predicted_next_mood: analyticsData.predicted_next_mood || 'Neutral'
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="grid gap-4 lg:grid-cols-12"><div className="skeleton h-64 rounded-3xl lg:col-span-12" /><div className="skeleton h-80 rounded-3xl lg:col-span-7" /><div className="skeleton h-80 rounded-3xl lg:col-span-5" /></div>;
  }

  if (!history.length && !currentSeries.length) {
    return (
      <div className="glass neo-border rounded-3xl p-6 text-center">
        <h2 className="font-display text-xl text-slate-100">Historical Mood Analytics</h2>
        <p className="mt-2 text-sm text-slate-400">No mood data yet. Capture and save a few check-ins to unlock charts and gauges.</p>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-slate-100">Historical Mood Analytics</h2>
            <p className="mt-1 text-sm text-slate-400">Track confidence trajectories and emotional history patterns.</p>
          </div>
          <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            {ranges.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={() => setSelectedRange(range.key)}
                className={`rounded-lg px-3 py-1 text-xs transition ${selectedRange === range.key ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300 hover:bg-white/10'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-7">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-display text-lg text-slate-100">Confidence Curve</h3>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{selectedRange}</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={currentSeries}>
            <defs>
              <linearGradient id="historyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8C7BFF" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#8C7BFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip content={<HistoryTooltip />} />
            <Area type="monotone" dataKey="avg_confidence" stroke="#8C7BFF" fill="url(#historyFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:col-span-5">
        <div className="glass neo-border rounded-3xl p-5">
          <h3 className="font-display text-lg text-slate-100">Stress Gauge</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-32 w-32 rounded-full" style={{ background: `conic-gradient(#f87171 0 ${stressScore}%, rgba(255,255,255,0.08) ${stressScore}% 100%)` }}>
              <div className="absolute inset-3 rounded-full bg-slate-950/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl text-slate-100">{stressScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-300">Stress score</p>
              <p className="mt-1 text-xs text-slate-400">Lower is calmer. Use the range toggle to compare trends.</p>
            </div>
          </div>
        </div>

        <div className="glass neo-border rounded-3xl p-5">
          <h3 className="font-display text-lg text-slate-100">Resilience Score</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-32 w-32 rounded-full" style={{ background: `conic-gradient(#2dd4bf 0 ${resilienceScore}%, rgba(255,255,255,0.08) ${resilienceScore}% 100%)` }}>
              <div className="absolute inset-3 rounded-full bg-slate-950/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl text-slate-100">{resilienceScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-300">Predicted mood</p>
              <p className="mt-1 text-sm text-cyan-200">{analytics.predicted_next_mood}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h3 className="mb-3 font-display text-lg text-slate-100">Recent Mood Log</h3>
        <div className="max-h-[360px] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-xl">
              <tr className="text-left text-slate-300">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Emotion</th>
                <th className="px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {history.map((item) => {
                const emotion = String(item.emotion || 'neutral').toLowerCase();
                const borderClass = emotion === 'happy' ? 'border-l-emerald-400' : emotion === 'sad' ? 'border-l-violet-400' : emotion === 'stress' ? 'border-l-rose-400' : 'border-l-cyan-400';
                return (
                  <tr key={item.id} className={`border-t border-white/10 hover:bg-white/5 ${borderClass} border-l-4`}>
                    <td className="px-3 py-2 text-xs text-slate-300">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{item.emotion}</td>
                    <td className="px-3 py-2">{Math.round(item.confidence * 100)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}

export default HistoryAnalyticsPage;
