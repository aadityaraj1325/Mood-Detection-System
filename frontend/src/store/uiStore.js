import { create } from 'zustand';

const defaultNotifications = [
  {
    id: 'n1',
    level: 'warning',
    title: 'Stress Spike Detected',
    message: 'Your stress trend increased 12% this week. Consider a short break.'
  },
  {
    id: 'n2',
    level: 'info',
    title: 'Mood Dip Alert',
    message: 'Recent mood confidence dropped in evening hours. Try a wind-down routine.'
  }
];

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'dark',
  notifications: defaultNotifications,
  graphRange: 'weekly',
  setGraphRange: (graphRange) => set({ graphRange }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return { theme: next };
    }),
  dismissNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) }))
}));
