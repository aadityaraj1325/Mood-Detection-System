import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BookHeart, Sparkles, Wind } from 'lucide-react';
import { getRecommendations } from '../services/moodService';

const iconMap = [Sparkles, Activity, Wind, BookHeart];

function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getRecommendations();
      setRecommendation(data);
    }
    load();
  }, []);

  if (!recommendation) {
    return <div className="skeleton h-64 rounded-3xl" />;
  }

  const cards = [
    ...(recommendation.activities || []),
    recommendation.breathing_exercise,
    recommendation.challenge
  ].filter(Boolean);

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h2 className="font-display text-xl text-slate-100">Smart Recommendations Engine</h2>
        <p className="mt-1 text-sm text-slate-400">
          Predicted mood: {recommendation.predicted_next_mood} • Stress score: {recommendation.stress_score}%
        </p>
      </div>

      {cards.map((item, idx) => {
        const Icon = iconMap[idx % iconMap.length];
        const isExpanded = expanded === idx;
        return (
          <motion.article
            key={`${item}-${idx}`}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            layout
            className="glass neo-border cursor-pointer rounded-3xl p-4 lg:col-span-4"
            onClick={() => setExpanded(isExpanded ? null : idx)}
          >
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Icon size={16} />
              <p className="text-xs uppercase tracking-[0.2em]">AI Suggestion</p>
            </div>
            <p className="text-sm text-slate-100">{item}</p>
            {isExpanded ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-slate-300">
                Expected impact: reduce stress variability and improve emotional stability over 24-48 hours.
              </motion.p>
            ) : null}
          </motion.article>
        );
      })}

      <div className="glass neo-border rounded-3xl p-5 lg:col-span-12">
        <h3 className="font-display text-lg text-slate-100">Journaling Prompt</h3>
        <p className="mt-2 text-slate-300">{recommendation.journaling_prompt}</p>
      </div>
    </section>
  );
}

export default RecommendationsPage;
