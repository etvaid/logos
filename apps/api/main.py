from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncpg
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional
import os
from datetime import datetime

# Import all routers
from routers import (
    reader,
    semantia,
    chronos,
    connectome,
    translate,
    authorship,
    learn,
    search,
    corpus,
    prosody,
    ghost,
    atlas,
    discovery
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
MIN_POOL_SIZE = 5
MAX_POOL_SIZE = 20

# Global database pool variable
db_pool: Optional[asyncpg.Pool] = None

async def create_db_pool():
    """Create database connection pool"""
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=MIN_POOL_SIZE,
            max_size=MAX_POOL_SIZE,
            command_timeout=60,
            server_settings={
                'application_name': 'logos_api',
            }
        )
        logger.info(f"Database pool created successfully with {MIN_POOL_SIZE}-{MAX_POOL_SIZE} connections")
        return db_pool
    except Exception as e:
        logger.error(f"Failed to create database pool: {e}")
        raise

async def close_db_pool():
    """Close database connection pool"""
    global db_pool
    if db_pool:
        await db_pool.close()
        logger.info("Database pool closed")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events"""
    # Startup
    logger.info("Starting LOGOS API...")
    try:
        pool = await create_db_pool()
        app.state.db_pool = pool
        logger.info("LOGOS API startup complete")
    except Exception as e:
        logger.error(f"Failed to start LOGOS API: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down LOGOS API...")
    await close_db_pool()
    logger.info("LOGOS API shutdown complete")

# Create FastAPI application
app = FastAPI(
    title="LOGOS Classical Texts API",
    description="""A comprehensive API for accessing and analyzing classical texts.
    
    Features:
    - Text reading and analysis
    - Semantic analysis
    - Chronological studies
    - Text connections and networks
    - Translation services
    - Authorship attribution
    - Learning resources
    - Advanced search capabilities
    - Corpus management
    - Prosodic analysis
    - Ghost text detection
    - Geographic atlas
    - Discovery tools
    """,
    version="1.0.0",
    contact={
        "name": "LOGOS Development Team",
        "email": "contact@logos-api.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    lifespan=lifespan
)

# Add CORS middleware - allow all origins as requested
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP {exc.status_code} error on {request.url}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    """Handle internal server errors"""
    logger.error(f"Internal server error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

@app.exception_handler(asyncpg.PostgresError)
async def postgres_exception_handler(request: Request, exc: asyncpg.PostgresError):
    """Handle PostgreSQL errors"""
    logger.error(f"Database error on {request.url}: {exc}")
    return JSONResponse(
        status_code=503,
        content={
            "error": True,
            "message": "Database service unavailable",
            "status_code": 503,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions"""
    logger.error(f"Unexpected error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An unexpected error occurred",
            "status_code": 500,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to LOGOS Classical Texts API",
        "version": "1.0.0",
        "description": "A comprehensive API for accessing and analyzing classical texts",
        "documentation": "/docs",
        "openapi": "/openapi.json",
        "health": "/health",
        "endpoints": {
            "reader": "/reader - Text reading and display",
            "semantia": "/semantia - Semantic analysis",
            "chronos": "/chronos - Chronological studies",
            "connectome": "/connectome - Text connections and networks",
            "translate": "/translate - Translation services",
            "authorship": "/authorship - Authorship attribution",
            "learn": "/learn - Learning resources",
            "search": "/search - Advanced search capabilities",
            "corpus": "/corpus - Corpus management",
            "prosody": "/prosody - Prosodic analysis",
            "ghost": "/ghost - Ghost text detection",
            "atlas": "/atlas - Geographic atlas",
            "discovery": "/discovery - Discovery tools"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint with database connectivity test"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "database": "unknown"
    }
    
    # Check database connectivity
    try:
        if hasattr(app.state, 'db_pool') and app.state.db_pool:
            async with app.state.db_pool.acquire() as connection:
                result = await connection.fetchval("SELECT 1")
                if result == 1:
                    health_status["database"] = "healthy"
                else:
                    health_status["database"] = "unhealthy"
                    health_status["status"] = "degraded"
        else:
            health_status["database"] = "no_pool"
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status["database"] = "unhealthy"
        health_status["status"] = "unhealthy"
        health_status["error"] = str(e)
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return JSONResponse(status_code=status_code, content=health_status)

# Include all routers
app.include_router(reader.router, prefix="/reader", tags=["Reader"])
app.include_router(semantia.router, prefix="/semantia", tags=["Semantia"])
app.include_router(chronos.router, prefix="/chronos", tags=["Chronos"])
app.include_router(connectome.router, prefix="/connectome", tags=["Connectome"])
app.include_router(translate.router, prefix="/translate", tags=["Translate"])
app.include_router(authorship.router, prefix="/authorship", tags=["Authorship"])
app.include_router(learn.router, prefix="/learn", tags=["Learn"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(corpus.router, prefix="/corpus", tags=["Corpus"])
app.include_router(prosody.router, prefix="/prosody", tags=["Prosody"])
app.include_router(ghost.router, prefix="/ghost", tags=["Ghost"])
app.include_router(atlas.router, prefix="/atlas", tags=["Atlas"])
app.include_router(discovery.router, prefix="/discovery", tags=["Discovery"])

# Middleware for database pool access
@app.middleware("http")
async def add_db_pool_to_request(request: Request, call_next):
    """Add database pool to request state for easy access in routes"""
    if hasattr(app.state, 'db_pool'):
        request.state.db_pool = app.state.db_pool
    response = await call_next(request)
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )