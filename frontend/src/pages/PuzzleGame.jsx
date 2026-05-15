import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Sun, Moon, Star, Cloud, Droplet, Wind, Zap, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PostGameModal from '../components/PostGameModal';

const ICONS = [Sun, Moon, Star, Cloud, Droplet, Wind, Zap, Heart];

function PuzzleGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const initializeGame = () => {
    const deck = [...ICONS, ...ICONS]
      .map((icon, index) => ({ id: index, icon, matchId: icon.name }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].matchId === cards[second].matchId) {
        setMatchedIds((prev) => [...prev, cards[first].matchId]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  const isGameComplete = matchedIds.length === ICONS.length && ICONS.length > 0;

  useEffect(() => {
    if (isGameComplete) {
      setTimeout(() => setShowModal(true), 1000);
    }
  }, [isGameComplete]);

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/games" className="btn-icon">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl text-slate-100">Cognitive Puzzle</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>Moves: {moves}</span>
          <button onClick={initializeGame} className="btn-icon" aria-label="Restart game">
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center">
        {isGameComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass neo-border rounded-3xl p-8 text-center"
          >
            <h2 className="font-display text-3xl text-emerald-400 mb-2">Great Focus!</h2>
            <p className="text-slate-300">You completed the puzzle in {moves} moves.</p>
            <button onClick={initializeGame} className="btn-primary mt-6">Play Again</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {cards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                  className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl transition-all duration-300
                    ${isFlipped ? 'bg-cyan-500/20 shadow-inner shadow-cyan-500/20' : 'bg-glass-ultra shadow-md'}
                    ${matchedIds.includes(card.matchId) ? 'border-2 border-emerald-500/50 opacity-80' : 'border border-border-glass'}`}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 0 : 180, opacity: isFlipped ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={28} className={matchedIds.includes(card.matchId) ? 'text-emerald-400' : 'text-cyan-300'} />
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        )}
        <p className="mt-8 text-sm text-slate-400 max-w-sm text-center mx-auto">
          Match the pairs to clear your mind. Memory games help improve cognitive function and short-term recall.
        </p>
      </div>
      <PostGameModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        gameId="puzzle" 
        onComplete={() => navigate('/games')} 
      />
    </div>
  );
}

export default PuzzleGame;
