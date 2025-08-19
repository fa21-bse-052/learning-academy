import os
import uuid

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def make_temp_filename(prefix: str = "file", ext: str = ".tmp") -> str:
    return f"{prefix}_{uuid.uuid4().hex}{ext}"
