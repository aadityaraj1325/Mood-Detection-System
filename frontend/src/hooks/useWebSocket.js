import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useUiStore } from '../store/uiStore';

function resolveWsBase() {
  const explicit = import.meta.env.VITE_WS_BASE_URL;
  if (explicit) return String(explicit).replace(/\/+$/, '');

  const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (apiBase) {
    const normalizedApi = String(apiBase).replace(/\/+$/, '');
    const wsApi = normalizedApi.replace(/^http/i, 'ws');
    return /\/api$/i.test(wsApi) ? `${wsApi}/ws/mood` : `${wsApi}/api/ws/mood`;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    const wsOrigin = window.location.origin.replace(/^http/i, 'ws');
    return `${wsOrigin}/api/ws/mood`;
  }

  return 'ws://localhost:8000/api/ws/mood';
}

export function useWebSocket() {
  const socketRef = useRef(null);
  const { user, token } = useAuth();
  const addNotification = useUiStore((state) => state.addNotification);

  useEffect(() => {
    if (!user?.id || !token) return;

    const wsBase = resolveWsBase();
    const socket = new WebSocket(`${wsBase}/${user.id}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type) {
          addNotification({
            id: `live-${Date.now()}`,
            level: 'info',
            title: payload.type,
            message: payload.emotion || 'Live event received.'
          });
        }
      } catch {
        // Ignore malformed websocket payload.
      }
    };

    return () => {
      socket.close();
    };
  }, [user?.id, token, addNotification]);

  return socketRef;
}
