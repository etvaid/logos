"""
LOGOS API - AI-Powered Classical Research Platform
Main FastAPI Application
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

# Import routers
from routers import (
    texts,
    translate,
    search,
    intertexts,
    discovery,
    research,
    parse,
    prosody,
    etymology,
    learn,
    audio,
    auth,
    admin,
    social,
    seo
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print("🏛️ LOGOS API starting...")
    print(f"📚 Domain: {os.getenv('DOMAIN', 'localhost')}")
    yield
    # Shutdown
    print("🏛️ LOGOS API shutting down...")

app = FastAPI(
    title="LOGOS API",
    description="AI-Powered Classical Research Platform - Search 69M+ words of Greek & Latin by meaning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(texts.router, prefix="/api/texts", tags=["Texts"])
app.include_router(translate.router, prefix="/api/translate", tags=["Translation"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(intertexts.router, prefix="/api/intertexts", tags=["Intertextuality"])
app.include_router(discovery.router, prefix="/api/discovery", tags=["Discovery"])
app.include_router(research.router, prefix="/api/research", tags=["Research"])
app.include_router(parse.router, prefix="/api/parse", tags=["Morphology"])
app.include_router(prosody.router, prefix="/api/prosody", tags=["Prosody"])
app.include_router(etymology.router, prefix="/api/etymology", tags=["Etymology"])
app.include_router(learn.router, prefix="/api/learn", tags=["Learning"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(social.router, prefix="/api/social", tags=["Social Media"])
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "LOGOS API",
        "version": "1.0.0",
        "description": "AI-Powered Classical Research Platform",
        "docs": "/docs",
        "corpus_size": "69M+ words",
        "languages": ["Greek (grc)", "Latin (lat)"],
        "features": [
            "Cross-lingual Semantic Search",
            "AI Translation (3 styles)",
            "Intertextuality Detection",
            "Higher-Order Discovery",
            "Research Assistant",
            "Morphological Parsing",
            "And 18 more..."
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "logos-api"}

@app.get("/api")
async def api_info():
    """API information."""
    return {
        "endpoints": {
            "texts": "/api/texts - Text retrieval by URN",
            "translate": "/api/translate - AI translation (literal, literary, student)",
            "search": "/api/search - Semantic search across corpus",
            "intertexts": "/api/intertexts - Find allusions and connections",
            "discovery": "/api/discovery - Higher-order pattern detection",
            "research": "/api/research - AI research assistant",
            "parse": "/api/parse - Morphological analysis",
            "prosody": "/api/prosody - Metrical scansion",
            "etymology": "/api/etymology - Word history tracking",
            "learn": "/api/learn - Flashcards and exercises",
            "audio": "/api/audio - Pronunciation (3 systems)",
            "auth": "/api/auth - Authentication",
            "admin": "/api/admin - Admin dashboard",
            "social": "/api/social - Twitter integration",
            "seo": "/api/seo - Sitemap and meta tags"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
