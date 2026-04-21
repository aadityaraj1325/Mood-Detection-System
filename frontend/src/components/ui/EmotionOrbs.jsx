import { motion, useReducedMotion } from 'framer-motion';

const fallbackEmotions = [
  { emotion: 'Happy', confidence: 0.72, color: 'bg-emotion-happy' },
  { emotion: 'Neutral', confidence: 0.18, color: 'bg-emotion-neutral' },
  { emotion: 'Sad', confidence: 0.1, color: 'bg-emotion-sad' }
];

function EmotionOrbs({ items = fallbackEmotions }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.emotion}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          className="rounded-2xl border border-white/15 bg-white/5 p-3 text-center"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.04, 1], rotate: [0, 4, 0] }}
            transition={{ duration: 4 + index, repeat: shouldReduceMotion ? 0 : Infinity }}
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${item.color} bg-opacity-20 shadow-glow`}
          >
            <span className="font-display text-lg text-text-primary">{Math.round(item.confidence * 100)}%</span>
          </motion.div>
          <p className="mt-2 text-sm font-semibold text-text-primary">{item.emotion}</p>
          <p className="text-xs text-text-secondary">Detected intensity</p>
        </motion.div>
      ))}
    </div>
  );
}

export default EmotionOrbs;
