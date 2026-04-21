from __future__ import annotations

import argparse
import asyncio
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.core.crypto import encrypt_text
from app.core.security import get_password_hash


async def seed_admin(email: str, full_name: str, password: str) -> None:
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]

    existing = await db.users.find_one({"email": email})
    if existing:
        await db.users.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "role": "admin",
                    "full_name": encrypt_text(full_name),
                    "hashed_password": get_password_hash(password),
                }
            },
        )
        print(f"Updated existing user as admin: {email}")
    else:
        await db.users.insert_one(
            {
                "email": email,
                "full_name": encrypt_text(full_name),
                "hashed_password": get_password_hash(password),
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
                "points": 0,
                "badges": [],
                "notification_enabled": True,
                "reminder_hour": 20,
            }
        )
        print(f"Created admin user: {email}")

    client.close()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed or update an admin user")
    parser.add_argument("--email", required=True)
    parser.add_argument("--full-name", required=True)
    parser.add_argument("--password", required=True)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(seed_admin(args.email, args.full_name, args.password))
