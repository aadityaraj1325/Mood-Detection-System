import { motion } from 'framer-motion';
import { Flame, Sparkles, Trophy, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const badgeSet = [
  { name: 'Focus', description: 'Completed 5 mood check-ins', icon: Sparkles, unlocked: true },
  { name: 'Calm', description: 'Used breathing exercises 3 times', icon: Zap, unlocked: true },
  { name: 'Resilience', description: 'Kept a 7 day streak', icon: Trophy, unlocked: false },
  { name: 'Self Check', description: 'Saved your first mood entry', icon: Flame, unlocked: true },
  { name: 'Reflection', description: 'Wrote 3 journal entries', icon: Sparkles, unlocked: false },
  { name: 'Momentum', description: 'Reached 250 XP', icon: Zap, unlocked: false }
];

function AchievementsPage() {
  const { user } = useAuth();

  const points = user?.points || 0;
  const streak = Math.max(1, Math.round(points / 25));
  const xpProgress = useMemo(() => Math.min(100, (points % 500) / 5), [points]);
  const unlockedCount = badgeSet.filter((badge) => badge.unlocked).length;

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h1 className="font-display text-2xl text-slate-100">Achievements</h1>
        <p className="mt-2 text-slate-400">Badge progress, XP, and streaks are synchronized to your wellness activity.</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">XP</p>
        <h2 className="mt-2 font-display text-3xl text-slate-100">{points}</h2>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-teal-300" />
        </div>
        <p className="mt-2 text-sm text-slate-400">{xpProgress.toFixed(0)}% toward the next milestone</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Streak</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-200">
            <Flame size={24} />
          </div>
          <div>
            <h2 className="font-display text-3xl text-slate-100">{streak} days</h2>
            <p className="text-sm text-slate-400">Consistency builds resilience.</p>
          </div>
        </div>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Unlocked</p>
        <h2 className="mt-2 font-display text-3xl text-slate-100">{unlockedCount}</h2>
        <p className="mt-2 text-sm text-slate-400">Active badges in your personal collection</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h3 className="font-display text-lg text-slate-100">Badge Grid</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {badgeSet.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.article
                key={badge.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-3xl border p-4 ${badge.unlocked ? 'border-cyan-300/25 bg-cyan-300/10' : 'border-white/10 bg-white/5 opacity-80'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{badge.unlocked ? 'Unlocked' : 'Locked'}</p>
                    <h4 className="mt-1 font-display text-lg text-slate-100">{badge.name}</h4>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${badge.unlocked ? 'bg-cyan-300/15 text-cyan-200' : 'bg-white/5 text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{badge.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default AchievementsPage;
