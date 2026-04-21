import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Brain,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  Search,
  Sparkles,
  Sun,
  Target,
  X
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleField from './ui/ParticleField';
import { useUiStore } from '../store/uiStore';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mood-detection', label: 'Mood Detection', icon: Brain },
  { to: '/history', label: 'History & Analytics', icon: History },
  { to: '/recommendations', label: 'Recommendations', icon: Sparkles }
];

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme, notifications, dismissNotification } =
    useUiStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-dark text-slate-100">
      <ParticleField />

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          animate={{ width: sidebarOpen ? 272 : 92 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="glass neo-border m-4 hidden flex-col rounded-3xl p-4 lg:flex"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="overflow-hidden">
              <h1 className="font-display text-xl font-semibold tracking-tight text-cyan-200">PulseMind AI</h1>
              <p className="text-xs text-slate-400">Neural Wellness Engine</p>
            </div>
            <button
              className="ripple-btn rounded-xl border border-white/10 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              onClick={toggleSidebar}
              type="button"
            >
              <Menu size={18} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                      isActive
                        ? 'border-cyan-300/45 bg-cyan-400/10 text-cyan-100 shadow-glow'
                        : 'border-transparent text-slate-400 hover:border-cyan-200/25 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={`transition ${isActive ? 'text-cyan-200' : 'group-hover:text-cyan-100'}`}
                      />
                      {sidebarOpen ? <span className="text-sm font-medium">{link.label}</span> : null}
                      {isActive ? (
                        <motion.span
                          layoutId="activeLine"
                          className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-cyan-300"
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="glass mt-4 rounded-2xl p-3">
            <p className="truncate text-sm font-semibold">{user?.full_name || 'Student'}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>

            <button
              className="ripple-btn mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/20"
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              type="button"
            >
              <LogOut size={16} />
              {sidebarOpen ? 'Logout' : ''}
            </button>
          </div>
        </motion.aside>

        <div className="flex min-h-screen flex-1 flex-col p-4 pt-5">
          <header className="glass neo-border mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl px-4 py-3">
            <div>
              <p className="font-display text-xl text-slate-100">
                {greeting},{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-teal-300 bg-clip-text text-transparent">
                  {user?.full_name?.split(' ')[0] || 'Student'}
                </span>
              </p>
              <p className="text-sm text-slate-400">Your AI companion is analyzing emotional wellness signals.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                <Search size={16} className="text-slate-400" />
                <input
                  className="w-52 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  placeholder="Search insights"
                />
              </div>

              <button
                className="ripple-btn rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
                onClick={toggleTheme}
                type="button"
              >
                {theme === 'dark' ? <Sun size={18} /> : <MoonStar size={18} />}
              </button>

              <div className="group relative">
                <button className="ripple-btn rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200">
                  <Bell size={18} />
                </button>
                <div className="pointer-events-none absolute right-0 top-12 z-40 w-80 translate-y-2 rounded-2xl border border-white/15 bg-slate-950/95 p-3 opacity-0 shadow-card backdrop-blur-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Real-time Alerts</p>
                    <Target size={14} className="text-cyan-300" />
                  </div>

                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <p className="rounded-xl border border-white/10 p-3 text-xs text-slate-400">No active alerts</p>
                    ) : (
                      notifications.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-xl border border-white/10 bg-white/5 p-3"
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                            <button
                              onClick={() => dismissNotification(item.id)}
                              className="text-slate-400 transition hover:text-slate-200"
                              type="button"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-slate-300">{item.message}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.28 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
