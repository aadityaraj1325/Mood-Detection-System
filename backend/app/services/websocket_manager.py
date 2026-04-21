from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        if websocket in self.active_connections[user_id]:
            self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            self.active_connections.pop(user_id, None)

    async def send_personal_message(self, user_id: str, message: dict) -> None:
        for connection in self.active_connections.get(user_id, []):
            await connection.send_json(message)


manager = ConnectionManager()
