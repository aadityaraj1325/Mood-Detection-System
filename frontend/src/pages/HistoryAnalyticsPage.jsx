import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getAnalytics, getHistory } from '../services/moodService';

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
  const [analytics, setAnalytics] = useState({ monthly: [] });

  useEffect(() => {
    async function load() {
      const [historyData, analyticsData] = await Promise.all([getHistory(), getAnalytics()]);
      setHistory(historyData.items || []);
      setAnalytics(analyticsData);
    }
    load();
  }, []);

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h2 className="font-display text-xl text-slate-100">Historical Mood Analytics</h2>
        <p className="mt-1 text-sm text-slate-400">Track confidence trajectories and emotional history patterns.</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-7">
        <h3 className="mb-3 font-display text-lg text-slate-100">Monthly Confidence Curve</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analytics.monthly || []}>
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

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-5">
        <h3 className="mb-3 font-display text-lg text-slate-100">Recent Mood Log</h3>
        <div className="max-h-[320px] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-xl">
              <tr className="text-left text-slate-300">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Emotion</th>
                <th className="px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-3 py-2 text-xs text-slate-300">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{item.emotion}</td>
                  <td className="px-3 py-2">{Math.round(item.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default HistoryAnalyticsPage;
