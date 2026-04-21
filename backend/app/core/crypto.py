from cryptography.fernet import Fernet, InvalidToken

from app.core.config import settings


def _build_fernet() -> Fernet:
    key = settings.encryption_key.encode("utf-8")
    return Fernet(key)


def encrypt_text(value: str) -> str:
    return _build_fernet().encrypt(value.encode("utf-8")).decode("utf-8")


def decrypt_text(value: str) -> str:
    try:
        return _build_fernet().decrypt(value.encode("utf-8")).decode("utf-8")
    except InvalidToken:
        return "Unknown User"
