import { Gamepad2, Brain, Sparkles, Pencil, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const games = [
  {
    id: 'breathing',
    title: 'Mindfulness Breathing',
    description: 'A rhythm-based visual breathing guide to help you focus and relax.',
    icon: Wind,
    color: 'from-cyan-500/20 to-teal-500/20',
  },
  {
    id: 'puzzle',
    title: 'Cognitive Puzzle',
    description: 'A calming memory match game to sharpen your focus.',
    icon: Brain,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'sandbox',
    title: 'Creative Sandbox',
    description: 'A freeform digital doodling canvas to express yourself.',
    icon: Pencil,
    color: 'from-amber-500/20 to-orange-500/20',
  }
];

function GamesPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-slate-100 flex items-center gap-2">
          <Gamepad2 className="text-cyan-400" />
          Therapeutic Mini-Games
        </h1>
        <p className="mt-2 text-slate-400">Engage in calming activities to restore your focus and balance.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/games/${game.id}`)}
            className={`glass neo-border rounded-3xl p-6 bg-gradient-to-br ${game.color} border-white/5 cursor-pointer`}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
              <game.icon size={24} />
            </div>
            <h3 className="font-display text-lg text-white">{game.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{game.description}</p>
            <div className="mt-6 flex justify-end">
              <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                Play Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
