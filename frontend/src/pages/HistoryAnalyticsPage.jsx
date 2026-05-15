import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Book, History, CheckCircle, MessageCircle, BarChart3 } from 'lucide-react';
import { getAnalytics, getHistory } from '../services/moodService';
import { getJournalHistory } from '../services/journalService';
import { getActivityHistory } from '../services/activityService';

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
  const [journals, setJournals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState({ weekly: [], monthly: [], yearly: [], stress_score: 0, predicted_next_mood: 'Neutral' });
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('monthly');
  const [view, setView] = useState('charts'); // 'charts' or 'log'

  const currentSeries = useMemo(() => analytics[selectedRange] || [], [analytics, selectedRange]);
  const stressScore = Math.round(analytics.stress_score || 0);
  const resilienceScore = Math.max(0, 100 - stressScore);

  const unifiedLog = useMemo(() => {
    const logs = [
      ...history.map(item => ({ ...item, type: 'mood', date: new Date(item.created_at) })),
      ...journals.map(item => ({ ...item, type: 'journal', date: new Date(item.created_at) })),
      ...activities.map(item => ({ ...item, type: 'activity', date: new Date(item.created_at) }))
    ];
    return logs.sort((a, b) => b.date - a.date);
  }, [history, journals, activities]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [historyData, analyticsData, journalData, activityData] = await Promise.all([
          getHistory(), 
          getAnalytics(),
          getJournalHistory(),
          getActivityHistory()
        ]);
        
        setHistory(historyData.items || []);
        setJournals(journalData || []);
        setActivities(activityData || []);
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

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-slate-100">Mindfulness Analytics & History</h2>
            <p className="mt-1 text-sm text-slate-400">Review your progress and activity logs.</p>
          </div>
          <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            <button 
              onClick={() => setView('charts')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1 text-xs transition ${view === 'charts' ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300 hover:bg-white/10'}`}
            >
              <BarChart3 size={14} /> Charts
            </button>
            <button 
              onClick={() => setView('log')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1 text-xs transition ${view === 'log' ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300 hover:bg-white/10'}`}
            >
              <History size={14} /> Unified Log
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'charts' ? (
          <motion.div 
            key="charts"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="lg:col-span-12 grid gap-4 lg:grid-cols-12"
          >
            <div className="glass neo-border rounded-3xl p-5 lg:col-span-12 flex justify-end">
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
                    <p className="mt-1 text-xs text-slate-400">Lower is calmer.</p>
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
          </motion.div>
        ) : (
          <motion.div 
            key="log"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="lg:col-span-12 space-y-4"
          >
            {unifiedLog.length === 0 ? (
              <div className="glass neo-border rounded-3xl p-10 text-center text-slate-500">
                <History size={48} className="mx-auto mb-4 opacity-20" />
                <p>No activity or journal entries yet.</p>
              </div>
            ) : (
              unifiedLog.map((item, idx) => (
                <div key={`${item.type}-${item.id || idx}`} className="glass neo-border rounded-3xl p-4 flex gap-4 items-start">
                  <div className={`p-3 rounded-2xl ${
                    item.type === 'journal' ? 'bg-amber-500/10 text-amber-300' : 
                    item.type === 'activity' ? 'bg-cyan-500/10 text-cyan-300' : 
                    'bg-indigo-500/10 text-indigo-300'
                  }`}>
                    {item.type === 'journal' ? <Book size={20} /> : 
                     item.type === 'activity' ? <CheckCircle size={20} /> : 
                     <MessageCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">{item.type}</span>
                      <span className="text-[10px] text-slate-500">{item.date.toLocaleString()}</span>
                    </div>
                    {item.type === 'journal' ? (
                      <p className="text-sm text-slate-200 italic">"{item.content}"</p>
                    ) : item.type === 'activity' ? (
                      <p className="text-sm text-slate-200">Completed activity: <span className="text-cyan-200 font-medium">{item.name}</span></p>
                    ) : (
                      <p className="text-sm text-slate-200">Mood Check-in: <span className="text-indigo-200 font-medium">{item.emotion}</span> ({Math.round(item.confidence * 100)}% confidence)</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default HistoryAnalyticsPage;
