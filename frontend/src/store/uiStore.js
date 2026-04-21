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

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  theme: 'neural-dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'neural-dark' ? 'neural-light' : 'neural-dark'
    })),

  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: toast.id || Date.now() }]
    })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),

  analyticsRange: 30,
  setAnalyticsRange: (days) => set({ analyticsRange: days }),

  liveFeed: [],
  addLiveEvent: (event) =>
    set((state) => ({
      liveFeed: [event, ...state.liveFeed].slice(0, 20)
    })),

  // Backward compatibility keys used by existing pages/components.
  notifications: defaultNotifications,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification]
    })),
  dismissNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
  graphRange: 'weekly',
  setGraphRange: (graphRange) => set({ graphRange })
}));

export const useUiStore = useUIStore;
