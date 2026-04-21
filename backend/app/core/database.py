from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

try:
    from mongomock_motor import AsyncMongoMockClient
except Exception:  # pragma: no cover
    AsyncMongoMockClient = None


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


database = MongoDB()


async def connect_to_mongo() -> None:
    if settings.use_mock_db:
        if AsyncMongoMockClient is None:
            raise RuntimeError("Mock DB requested but mongomock-motor is not installed")
        database.client = AsyncMongoMockClient()
    else:
        database.client = AsyncIOMotorClient(settings.mongodb_uri)
    database.db = database.client[settings.mongodb_db_name]


async def close_mongo_connection() -> None:
    if database.client:
        database.client.close()
        database.client = None
        database.db = None


def get_db() -> AsyncIOMotorDatabase:
    if database.db is None:
        raise RuntimeError("Database is not initialized")
    return database.db
