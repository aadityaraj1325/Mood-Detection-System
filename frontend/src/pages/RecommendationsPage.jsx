import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BookHeart, Flame, Sparkles, Wind, Square, Play } from 'lucide-react';
import { getRecommendations } from '../services/recommendationService';
import { saveJournal as saveJournalApi, getJournalHistory } from '../services/journalService';
import { saveActivity } from '../services/activityService';

const iconMap = [Sparkles, Activity, Wind, BookHeart];

function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [journal, setJournal] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getRecommendations();
      setRecommendation(data);
      try {
        const history = await getJournalHistory();
        if (history && history.length > 0) {
          setJournal(history[0].content);
        }
      } catch (err) {
        console.error('Failed to load journal history', err);
      }
    }
    load();
  }, []);

  const cards = useMemo(() => {
    if (!recommendation) return [];
    return [
      ...((recommendation.activities || []).map((item) => ({ text: item, category: 'Activity' }))),
      recommendation.breathing_exercise ? { text: recommendation.breathing_exercise, category: 'Breathing' } : null,
      recommendation.challenge ? { text: recommendation.challenge, category: 'Challenge' } : null
    ].filter(Boolean);
  }, [recommendation]);

  if (!recommendation) {
    return <div className="skeleton h-64 rounded-3xl" />;
  }

  const saveJournal = async () => {
    try {
      await saveJournalApi(journal);
      setJournalSaved(true);
      window.setTimeout(() => setJournalSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save journal', err);
    }
  };

  const handleToggleActivity = async (item) => {
    if (activeAction && activeAction.text === item.text) {
      // Stopping
      try {
        await saveActivity({ name: item.text, category: item.category });
        setActiveAction(null);
      } catch (err) {
        console.error('Failed to save activity', err);
      }
    } else {
      // Starting
      setActiveAction(item);
    }
  };

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-slate-100">Smart Recommendations Engine</h2>
            <p className="mt-1 text-sm text-slate-400">
              Predicted mood: {recommendation.predicted_next_mood} • Stress score: {recommendation.stress_score}%
            </p>
          </div>
          <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs text-cyan-100">
            <Flame size={14} className="mr-1 inline" />
            Today&apos;s Insight
          </div>
        </div>
      </div>

      {cards.map((item, idx) => {
        const Icon = iconMap[idx % iconMap.length];
        const isExpanded = expanded === idx;
        const isActive = activeAction && activeAction.text === item.text;
        const isDisabled = activeAction && activeAction.text !== item.text;

        return (
          <motion.article
            key={`${item.text}-${idx}`}
            whileHover={!isDisabled ? { scale: 1.02, rotateY: 2 } : {}}
            layout
            className={`glass neo-border rounded-3xl p-4 lg:col-span-4 ${isDisabled ? 'opacity-50 grayscale-[0.5]' : ''}`}
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-cyan-200">
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <p className="text-xs uppercase tracking-[0.2em]">{item.category}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Step {idx + 1}
              </span>
            </div>
            <p className="text-sm text-slate-100">{item.text}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleActivity(item)}
                disabled={isDisabled}
                className={`rounded-xl border px-3 py-2 text-xs transition flex items-center gap-2 ${
                  isActive 
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' 
                    : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50'
                }`}
              >
                {isActive ? <><Square size={12} /> Stop Activity</> : <><Play size={12} /> Start Activity</>}
              </button>
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : idx)}
                className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-300/15"
              >
                {isExpanded ? 'Hide detail' : 'Why this?'}
              </button>
            </div>
            <AnimatePresence>
              {isExpanded ? (
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-xs text-slate-300">
                  Expected impact: reduce stress variability and improve emotional stability over 24-48 hours.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.article>
        );
      })}

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h3 className="font-display text-lg text-slate-100">Journaling Prompt</h3>
        <p className="mt-2 text-slate-300">{recommendation.journaling_prompt}</p>
        <textarea
          className="textarea mt-4"
          value={journal}
          onChange={(event) => setJournal(event.target.value)}
          placeholder="Write a few lines about your current state..."
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={saveJournal}>
            Save Journal
          </button>
          <AnimatePresence>
            {journalSaved ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-teal-300">
                Journal saved securely.
              </motion.p>
            ) : null}
          </AnimatePresence>
          {activeAction ? (
            <p className="text-sm text-cyan-300 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Active: {activeAction.text}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default RecommendationsPage;
