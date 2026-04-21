import { motion } from 'framer-motion';
import { Brain, History, Moon, Sparkles, Trophy, Waves, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import BrainMeshWidget from '../components/ui/BrainMeshWidget';
import { getAnalytics } from '../services/moodService';
import { useAuth } from '../context/AuthContext';
import { createMoodSocket } from '../services/socketService';
import { useUiStore } from '../store/uiStore';

const cardMeta = [
  {
    key: 'stress',
    label: 'Stress Score',
    gradient: 'from-rose-400/20 via-rose-300/10 to-transparent',
    icon: Waves,
    suffix: '%'
  },
  {
    key: 'mood',
    label: 'Mood Prediction',
    gradient: 'from-violet-400/20 via-violet-300/10 to-transparent',
    icon: Brain,
    suffix: ''
  },
  {
    key: 'points',
    label: 'Points',
    gradient: 'from-cyan-400/20 via-cyan-300/10 to-transparent',
    icon: Zap,
    suffix: ''
  },
  {
    key: 'sleep',
    label: 'Sleep Score',
    gradient: 'from-teal-400/20 via-teal-300/10 to-transparent',
    icon: Moon,
    suffix: '%'
  }
];

const rangeKeys = {
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly'
};

function GlassTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-cyan-200/20 bg-slate-950/80 px-3 py-2 text-xs backdrop-blur-xl">
      {payload.map((item) => (
        <p key={item.name} className="text-slate-200">
          {item.name}: <span className="text-cyan-200">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { graphRange, setGraphRange, liveFeed, addLiveEvent } = useUiStore();
  const [analytics, setAnalytics] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
    stress_score: 0,
    predicted_next_mood: 'Neutral'
  });
  const [liveMood, setLiveMood] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentSeries = useMemo(() => analytics[rangeKeys[graphRange]] || [], [analytics, graphRange]);

  const sleepScore = useMemo(() => Math.max(52, Math.round(100 - (analytics.stress_score || 0) * 0.45)), [analytics.stress_score]);
  const streakDays = useMemo(() => Math.max(1, Math.round((user?.points || 0) / 25)), [user?.points]);
  const progression = useMemo(() => Math.min(100, ((user?.points || 0) % 500) / 5), [user?.points]);
  const latestFeed = useMemo(() => liveFeed.slice(0, 5), [liveFeed]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAnalytics();
        setAnalytics({
          weekly: data.weekly || [],
          monthly: data.monthly || [],
          yearly: data.yearly || data.monthly || [],
          stress_score: data.stress_score || 0,
          predicted_next_mood: data.predicted_next_mood || 'Neutral'
        });
      } catch {
        setAnalytics({
          weekly: [],
          monthly: [],
          yearly: [],
          stress_score: 0,
          predicted_next_mood: 'Neutral'
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const socket = createMoodSocket(user?.id, (payload) => {
      if (payload?.type === 'mood_update' || payload?.type === 'mood_saved') {
        setLiveMood(payload);
        addLiveEvent({
          id: `${payload.type}-${Date.now()}`,
          type: payload.type,
          title: payload.type === 'mood_saved' ? 'Mood saved' : 'Live mood update',
          message: payload.emotion ? `${payload.emotion} ${payload.confidence ? `(${Math.round(payload.confidence * 100)}%)` : ''}` : 'Realtime event received',
          created_at: new Date().toISOString()
        });
      }
    });

    return () => {
      if (socket) socket.close();
    };
  }, [user?.id]);

  if (loading) {
    return (
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="skeleton h-36 rounded-3xl lg:col-span-8" />
        <div className="skeleton h-36 rounded-3xl lg:col-span-4" />
        <div className="skeleton h-28 rounded-3xl lg:col-span-3" />
        <div className="skeleton h-28 rounded-3xl lg:col-span-3" />
        <div className="skeleton h-28 rounded-3xl lg:col-span-3" />
        <div className="skeleton h-28 rounded-3xl lg:col-span-3" />
        <div className="skeleton h-80 rounded-3xl lg:col-span-8" />
        <div className="skeleton h-80 rounded-3xl lg:col-span-4" />
      </section>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } }
      }}
      className="grid gap-4 lg:grid-cols-12"
    >
      <motion.div
        variants={cardVariants}
        className="glass neo-border relative min-h-[340px] overflow-hidden rounded-3xl p-6 lg:col-span-8"
      >
        <BrainMeshWidget />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neural-500/10 via-transparent to-pulse-500/10" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.26em] text-cyan-300/80">AI Wellness Hub</p>
            <h2 className="font-display text-2xl text-slate-100">Cognitive State Snapshot</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Real-time emotional inference, stress forecasting, and behavioral recommendations powered by multimodal AI.
            </p>

            {liveMood ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-xs text-cyan-100 animate-pulseGlow">
                <Sparkles size={14} />
                Live mood: {liveMood.emotion} ({Math.round((liveMood.confidence || 0) * 100)}%)
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Prediction', value: analytics.predicted_next_mood },
              { label: 'Stress', value: `${Math.round(analytics.stress_score || 0)}%` },
              { label: 'Sleep', value: `${sleepScore}%` }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/12 bg-white/5 p-3 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className="mt-2 font-display text-xl text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Gamification</p>
        <h3 className="mt-2 font-display text-lg text-slate-100">Mindfulness Streak</h3>
        <p className="mt-1 text-sm text-slate-300">{streakDays} day streak active</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progression}%` }}
            transition={{ duration: 0.9 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-teal-300"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
          {['Focus', 'Calm', 'Resilience'].map((badge) => (
            <motion.div
              key={badge}
              whileHover={{ y: -2, scale: 1.02 }}
              className="rounded-xl border border-white/15 bg-white/5 p-2"
            >
              <Trophy size={14} className="mx-auto mb-1 text-amber-300" />
              {badge}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {cardMeta.map((card, index) => {
        const Icon = card.icon;
        const value =
          card.key === 'stress'
            ? analytics.stress_score
            : card.key === 'mood'
            ? analytics.predicted_next_mood
            : card.key === 'points'
            ? user?.points || 0
            : sleepScore;

        return (
          <motion.div
            key={card.key}
            variants={cardVariants}
            transition={{ delay: 0.05 * index }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`glass neo-border group relative overflow-hidden rounded-3xl p-4 lg:col-span-3`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 transition group-hover:opacity-75`} />
            <div className="relative z-10 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <Icon size={18} className="text-cyan-200 transition group-hover:text-cyan-100" />
            </div>

            <div className="relative z-10 mt-3 text-2xl font-semibold text-slate-100">
              {typeof value === 'number' ? (
                <AnimatedCounter value={value} suffix={card.suffix} />
              ) : (
                <span>{value}</span>
              )}
            </div>
          </motion.div>
        );
      })}

      <motion.div variants={cardVariants} className="glass neo-border rounded-3xl p-5 lg:col-span-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg text-slate-100">AI Emotion Trend Graph</h3>
            <p className="text-sm text-slate-400">Forecasting emotional patterns with adaptive time windows</p>
          </div>
          <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            {['weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setGraphRange(range)}
                className={`ripple-btn rounded-lg px-3 py-1 text-xs transition ${
                  graphRange === range ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={currentSeries}>
            <defs>
              <linearGradient id="neoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DE2E6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#2DE2E6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="label" stroke="#94A3B8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />
            <Tooltip content={<GlassTooltip />} />
            <Area
              type="monotone"
              dataKey="happy"
              stroke="#2DE2E6"
              fill="url(#neoFill)"
              strokeWidth={2.4}
              activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={cardVariants} className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <h3 className="font-display text-lg text-slate-100">Quick Actions</h3>
        <p className="mt-1 text-sm text-slate-400">Open the next step in the wellness flow.</p>

        <div className="mt-4 grid gap-3">
          {[
            { label: 'Check Mood', icon: Brain, action: () => window.location.assign('/mood') },
            { label: 'Open Analytics', icon: History, action: () => window.location.assign('/analytics') },
            { label: 'View Tips', icon: Sparkles, action: () => window.location.assign('/recommendations') }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 text-left transition hover:bg-white/10"
            >
              <item.icon size={16} className="text-cyan-200" />
              <span className="text-sm text-slate-100">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <h3 className="font-display text-lg text-slate-100">Live Feed</h3>
        <p className="mt-1 text-sm text-slate-400">Recent websocket events and status changes.</p>

        <div className="mt-4 space-y-2">
          {latestFeed.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3 text-sm text-slate-400">
              Waiting for live mood updates.
            </div>
          ) : (
            latestFeed.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/15 bg-white/5 p-3">
                <p className="text-sm text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-400">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default DashboardPage;
