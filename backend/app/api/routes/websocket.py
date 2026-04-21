from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.websocket_manager import manager

router = APIRouter(tags=["Realtime"])


@router.websocket("/ws/mood/{user_id}")
async def mood_socket(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
