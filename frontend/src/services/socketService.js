export function createMoodSocket(userId, onMessage) {
  if (!userId) return null;

  const wsBase = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/api/ws/mood';
  const socket = new WebSocket(`${wsBase}/${userId}`);

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    } catch {
      // Ignore invalid server payload.
    }
  };

  return socket;
}
