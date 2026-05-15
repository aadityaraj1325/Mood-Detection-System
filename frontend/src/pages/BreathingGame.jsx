import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PostGameModal from '../components/PostGameModal';

function BreathingGame() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale, Hold
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // transition to next phase
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case 'Inhale': return 'Hold (Full)';
                case 'Hold (Full)': return 'Exhale';
                case 'Exhale': return 'Hold (Empty)';
                case 'Hold (Empty)': return 'Inhale';
                default: return 'Inhale';
              }
            });
            return 4; // 4 seconds per phase for box breathing
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setPhase('Ready');
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBreathing = () => {
    if (!isActive) {
      setPhase('Inhale');
      setTimeLeft(4);
      setIsActive(true);
    } else {
      setIsActive(false);
      setShowModal(true);
    }
  };

  // Determine scale based on phase
  let scale = 1;
  let transitionDuration = 4;
  if (phase === 'Inhale') scale = 1.8;
  else if (phase === 'Hold (Full)') scale = 1.8;
  else if (phase === 'Exhale') scale = 1;
  else if (phase === 'Hold (Empty)') scale = 1;
  else if (phase === 'Ready') {
    scale = 1;
    transitionDuration = 0.5;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/games" className="btn-icon">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl text-slate-100">Mindfulness Breathing</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center relative">
        <div className="relative flex h-64 w-64 items-center justify-center">
          <motion.div
            className="absolute h-32 w-32 rounded-full bg-cyan-400/20 blur-xl"
            animate={{ scale: scale * 1.2 }}
            transition={{ duration: transitionDuration, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 shadow-lg shadow-cyan-500/30"
            animate={{ scale }}
            transition={{ duration: transitionDuration, ease: 'linear' }}
          />
          <div className="z-10 flex flex-col items-center justify-center text-white">
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-display text-2xl font-bold drop-shadow-md"
              >
                {phase}
              </motion.span>
            </AnimatePresence>
            {isActive && (
              <span className="mt-1 text-4xl font-mono opacity-80">{timeLeft}</span>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={toggleBreathing}
            className={`btn-primary flex items-center justify-center gap-2 px-8 py-3 text-lg mx-auto ${isActive ? 'bg-rose-500/80 hover:bg-rose-500' : ''}`}
          >
            {isActive ? <><Square size={18} fill="currentColor" /> Finish Session</> : <><Play size={18} fill="currentColor" /> Start Box Breathing</>}
          </button>
          <p className="mt-4 text-sm text-slate-400 max-w-sm mx-auto">
            Box breathing helps regulate your autonomic nervous system. Follow the expanding and contracting circle.
          </p>
        </div>
      </div>
      <PostGameModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        gameId="breathing" 
        onComplete={() => navigate('/games')} 
      />
    </div>
  );
}

export default BreathingGame;
