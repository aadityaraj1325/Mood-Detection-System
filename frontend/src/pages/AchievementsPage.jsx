import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Trophy, Zap, BookHeart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/moodService';
import { getJournalHistory } from '../services/journalService';
import { getActivityHistory } from '../services/activityService';
import { getGameHistory } from '../services/gameService';

function AchievementsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [journals, setJournals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [h, j, a, g] = await Promise.all([
          getHistory(),
          getJournalHistory(),
          getActivityHistory(),
          getGameHistory()
        ]);
        setHistory(h.items || []);
        setJournals(j || []);
        setActivities(a || []);
        setGameHistory(g || []);
      } catch (err) {
        console.error('Failed to load achievement data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const points = user?.points || 0;
  
  // Dynamic Streak Calculation
  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    const dates = history.map(h => new Date(h.created_at).toDateString());
    const uniqueDates = [...new Set(dates)];
    // Simple approximation: number of unique active days
    return uniqueDates.length;
  }, [history]);

  const badgeSet = useMemo(() => {
    const breathingSessions = activities.filter(a => a.category === 'Breathing').length + 
                               gameHistory.filter(g => g.game_id === 'breathing').length;

    return [
      { 
        name: 'Focus', 
        description: 'Completed 5 mood check-ins', 
        icon: Sparkles, 
        unlocked: history.length >= 5,
        progress: (history.length / 5) * 100
      },
      { 
        name: 'Calm', 
        description: 'Used breathing exercises 3 times', 
        icon: Zap, 
        unlocked: breathingSessions >= 3,
        progress: (breathingSessions / 3) * 100
      },
      { 
        name: 'Resilience', 
        description: 'Kept a 3 day activity streak', 
        icon: Trophy, 
        unlocked: streak >= 3,
        progress: (streak / 3) * 100
      },
      { 
        name: 'Self Check', 
        description: 'Saved your first mood entry', 
        icon: Flame, 
        unlocked: history.length >= 1,
        progress: (history.length >= 1 ? 100 : 0)
      },
      { 
        name: 'Reflection', 
        description: 'Wrote 3 journal entries', 
        icon: BookHeart, 
        unlocked: journals.length >= 3,
        progress: (journals.length / 3) * 100
      },
      { 
        name: 'Momentum', 
        description: 'Reached 250 XP', 
        icon: ShieldCheck, 
        unlocked: points >= 250,
        progress: (points / 250) * 100
      }
    ];
  }, [history, journals, activities, streak, points]);

  const xpProgress = useMemo(() => Math.min(100, (points % 500) / 5), [points]);
  const unlockedCount = badgeSet.filter((badge) => badge.unlocked).length;

  if (loading) {
    return <div className="grid gap-4 lg:grid-cols-12"><div className="skeleton h-64 rounded-3xl lg:col-span-12" /></div>;
  }

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h1 className="font-display text-2xl text-slate-100">Achievements</h1>
        <p className="mt-2 text-slate-400">Badge progress, XP, and streaks are synchronized to your wellness activity.</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total XP</p>
        <h2 className="mt-2 font-display text-3xl text-slate-100">{points}</h2>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-teal-300" />
        </div>
        <p className="mt-2 text-sm text-slate-400">{xpProgress.toFixed(0)}% toward the next milestone</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Activity Streak</p>
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
        <h2 className="mt-2 font-display text-3xl text-slate-100">{unlockedCount} / {badgeSet.length}</h2>
        <p className="mt-2 text-sm text-slate-400">Active badges in your personal collection</p>
      </div>

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h3 className="font-display text-lg text-slate-100">Badge Grid</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {badgeSet.map((badge, index) => {
            const Icon = badge.icon;
            const progress = Math.min(100, badge.progress);
            return (
              <motion.article
                key={badge.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-3xl border p-4 flex flex-col justify-between ${badge.unlocked ? 'border-cyan-300/25 bg-cyan-300/10' : 'border-white/10 bg-white/5 opacity-80'}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{badge.unlocked ? 'Unlocked' : 'In Progress'}</p>
                      <h4 className="mt-1 font-display text-lg text-slate-100">{badge.name}</h4>
                    </div>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${badge.unlocked ? 'bg-cyan-300/15 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-white/5 text-slate-500'}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{badge.description}</p>
                </div>
                
                {!badge.unlocked && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500/50" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default AchievementsPage;
