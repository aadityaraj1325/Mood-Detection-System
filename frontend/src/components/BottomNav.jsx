import { motion } from 'framer-motion';
import { BarChart3, Brain, LayoutDashboard, Sparkles, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mood', label: 'Mood', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/recommendations', label: 'Recommend', icon: Sparkles },
  { to: '/achievements', label: 'Profile', icon: User }
];

function BottomNav() {
  return (
    <nav className="glass-card fixed bottom-3 left-3 right-3 z-sidebar grid grid-cols-5 gap-1 p-2 lg:hidden">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex min-h-11 flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] transition ${
                isActive ? 'bg-glass-medium text-neural-300' : 'text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.span
                  animate={{ y: isActive ? -1.5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <Icon size={16} />
                </motion.span>
                <span className="mt-1 leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;
