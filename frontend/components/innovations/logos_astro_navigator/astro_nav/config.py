from __future__ import annotations
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class LogosTextConfig:
    table: str = os.getenv("LOGOS_TEXT_TABLE", "source_texts")
    urn_col: str = os.getenv("LOGOS_TEXT_URN_COL", "urn")
    content_col: str = os.getenv("LOGOS_TEXT_CONTENT_COL", "content")
    lang_col: str = os.getenv("LOGOS_TEXT_LANG_COL", "language")
    work_col: str = os.getenv("LOGOS_TEXT_WORK_COL", "work")
    author_col: str = os.getenv("LOGOS_TEXT_AUTHOR_COL", "author")
    date_col: str = os.getenv("LOGOS_TEXT_DATE_COL", "date")
    work_allowlist: str = os.getenv("MENTION_WORK_ALLOWLIST", "")

    def allowlist(self) -> list[str]:
        if not self.work_allowlist.strip():
            return []
        return [x.strip() for x in self.work_allowlist.split(",") if x.strip()]

@dataclass(frozen=True)
class Settings:
    database_url: str = os.environ["DATABASE_URL"]
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    logos_text: LogosTextConfig = LogosTextConfig()

settings = Settings()
