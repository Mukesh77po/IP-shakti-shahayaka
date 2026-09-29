import os
from pathlib import Path
from dotenv import load_dotenv

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# Load environment variables
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

class Settings:
    # API Keys: checks GOOGLE_API_KEY, falls back to GEMINI_API_KEY
    GOOGLE_API_KEY: str = (
        os.getenv("GOOGLE_API_KEY") 
        or os.getenv("GEMINI_API_KEY") 
        or ""
    )
    
    # Models
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
    
    # Vector Database
    CHROMA_PERSIST_DIR: str = str(BASE_DIR / os.getenv("CHROMA_PERSIST_DIR", "chroma_db"))
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "ayurveda_ip_regulations")
    
    # Data Paths
    DATA_DIR_INDIA: str = str(BASE_DIR / os.getenv("DATA_DIR_INDIA", "data/india"))
    DATA_DIR_INTERNATIONAL: str = str(BASE_DIR / os.getenv("DATA_DIR_INTERNATIONAL", "data/international"))
    
    # Server Host & Port
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
