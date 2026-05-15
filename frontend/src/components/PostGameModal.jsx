import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Heart, Star, Activity } from 'lucide-react';
import api from '../services/api';

function PostGameModal({ isOpen, onClose, gameId, onComplete }) {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({ q1: 0, q2: 0, q3: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Step 14.6 API integration
      await api.post('/games/feedback', {
        game_id: gameId,
        stress_reduction: responses.q1,
        enjoyment: responses.q2,
        notes: responses.q3,
      });
      setSubmitted(true);
      setTimeout(() => {
        onComplete();
        onClose();
        setStep(1);
        setSubmitted(false);
        setResponses({ q1: 0, q2: 0, q3: '' });
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass neo-border relative w-full max-w-md overflow-hidden rounded-3xl p-6"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <>
              <h2 className="font-display text-xl text-emerald-400 mb-6">Session Complete</h2>
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-slate-200 mb-4 flex items-center gap-2"><Activity size={18}/> Did this activity help reduce your stress?</h3>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => { setResponses({ ...responses, q1: val }); setStep(2); }}
                        className={`h-12 flex-1 rounded-xl border border-white/10 ${responses.q1 === val ? 'bg-emerald-500/30 border-emerald-500/50' : 'bg-white/5 hover:bg-white/10'} transition`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Not at all</span>
                    <span>Very much</span>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-slate-200 mb-4 flex items-center gap-2"><Heart size={18}/> How much did you enjoy the activity?</h3>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => { setResponses({ ...responses, q2: val }); setStep(3); }}
                        className={`h-12 flex-1 rounded-xl border border-white/10 ${responses.q2 === val ? 'bg-emerald-500/30 border-emerald-500/50' : 'bg-white/5 hover:bg-white/10'} transition`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Boring</span>
                    <span>Loved it</span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-slate-200 mb-4 flex items-center gap-2"><Star size={18}/> Any thoughts on your experience? (Optional)</h3>
                  <textarea
                    className="textarea w-full"
                    rows="3"
                    value={responses.q3}
                    onChange={(e) => setResponses({ ...responses, q3: e.target.value })}
                    placeholder="I felt calmer..."
                  />
                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setStep(2)} className="btn-icon text-slate-400 px-4 py-2 border border-white/10 rounded-xl">Back</button>
                    <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                      {submitting ? 'Submitting...' : 'Finish'}
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-6">
              <CheckCircle size={48} className="text-emerald-400 mb-4" />
              <h2 className="font-display text-2xl text-slate-100">Thank you!</h2>
              <p className="text-slate-400 mt-2 text-center">Your feedback helps us personalize your journey. Points awarded!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PostGameModal;
