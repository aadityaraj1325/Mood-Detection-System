import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  Bell,
  MoonStar,
  Search,
  Sun,
  Target,
  X
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import ToastNotification from './ToastNotification';
import ParticleField from './ui/ParticleField';
import { useUiStore } from '../store/uiStore';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, notifications, dismissNotification, toasts, removeToast } = useUiStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme !== 'light');
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-dark text-slate-100">
      <ParticleField />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          user={user}
          onLogout={() => {
            logout();
            navigate('/auth');
          }}
        />

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

          <BottomNav />
        </div>
      </div>

      <div className="pointer-events-none fixed right-4 top-4 z-toast flex w-[340px] flex-col gap-3">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Layout;
