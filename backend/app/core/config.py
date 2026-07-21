"""Application configuration — loaded from environment / .env file."""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./portal.db")
VALIDATOR_ALGORITHM: str = os.getenv("VALIDATOR_ALGORITHM", "bliss")
