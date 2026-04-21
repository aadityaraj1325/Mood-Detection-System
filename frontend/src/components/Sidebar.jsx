import { motion } from 'framer-motion';
import { Brain, History, LayoutDashboard, LogOut, Menu, Sparkles, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mood', label: 'Mood Detect', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: History },
  { to: '/recommendations', label: 'Recommend', icon: Sparkles },
  { to: '/achievements', label: 'Achievements', icon: Trophy }
];

function Sidebar({ user, onLogout }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="glass-card m-4 hidden h-[calc(100vh-2rem)] shrink-0 flex-col p-3 lg:flex"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="overflow-hidden">
          <h2 className="font-display text-lg text-glow-neural">PulseMind AI</h2>
          {sidebarOpen ? <p className="text-xs text-text-muted">Neural Wellness Engine</p> : null}
        </div>

        <button type="button" className="btn-icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={16} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                  isActive
                    ? 'border-border-glow bg-glass-medium text-neural-300'
                    : 'border-transparent text-text-secondary hover:border-border-glass hover:bg-glass-ultra'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-neural-300' : 'text-text-secondary'} />
                  {sidebarOpen ? <span>{item.label}</span> : null}
                  {isActive ? (
                    <span className="absolute -left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-neural-500" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-border-subtle bg-glass-ultra p-3">
        {sidebarOpen ? (
          <>
            <p className="truncate text-sm font-semibold text-text-primary">{user?.full_name || 'Student'}</p>
            <p className="truncate text-xs text-text-muted">{user?.email || 'Not signed in'}</p>
          </>
        ) : null}

        <button
          type="button"
          className="btn-danger mt-3 flex w-full items-center justify-center gap-2 px-3 py-2 text-sm"
          onClick={onLogout}
        >
          <LogOut size={14} />
          {sidebarOpen ? 'Logout' : ''}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
