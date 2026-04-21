import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useUiStore } from '../store/uiStore';

export function useWebSocket() {
  const socketRef = useRef(null);
  const { user, token } = useAuth();
  const addNotification = useUiStore((state) => state.addNotification);

  useEffect(() => {
    if (!user?.id || !token) return;

    const wsBase = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/api/ws/mood';
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
