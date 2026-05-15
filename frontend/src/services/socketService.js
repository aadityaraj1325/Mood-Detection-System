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

export function createMoodSocket(userId, onMessage) {
  if (!userId) return null;

  const wsBase = resolveWsBase();
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
