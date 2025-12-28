from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncpg
import logging
from typing import Dict, Any

# Import routers
from routers import reader, semantia, translate, corpus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"

# Global database pool
db_pool = None


async def init_db():
    """Initialize database connection pool"""
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=5,
            max_size=20,
            command_timeout=60,
            server_settings={
                'jit': 'off',
                'application_name': 'logos_api'
            }
        )
        logger.info("Database connection pool created successfully")
    except Exception as e:
        logger.error(f"Failed to create database pool: {e}")
        raise


async def close_db():
    """Close database connection pool"""
    global db_pool
    if db_pool:
        await db_pool.close()
        logger.info("Database connection pool closed")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


# Create FastAPI app with lifespan management
app = FastAPI(
    title="LOGOS Classical Texts API",
    description="API for accessing and analyzing classical Greek and Latin texts",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500
        }
    )


# Dependency to get database connection
async def get_db():
    """Get database connection from pool"""
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
    async with db_pool.acquire() as connection:
        yield connection


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    try:
        # Test database connection
        if db_pool:
            async with db_pool.acquire() as connection:
                await connection.fetchval("SELECT 1")
            db_status = "healthy"
        else:
            db_status = "unavailable"
            
        return {
            "status": "healthy" if db_status == "healthy" else "degraded",
            "database": db_status,
            "version": "1.0.0",
            "service": "LOGOS Classical Texts API"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e),
            "version": "1.0.0",
            "service": "LOGOS Classical Texts API"
        }


# Root endpoint
@app.get("/", tags=["Root"])
async def root() -> Dict[str, Any]:
    """Root endpoint with API information"""
    return {
        "message": "Welcome to LOGOS Classical Texts API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "reader": "/reader",
            "semantia": "/semantia", 
            "translate": "/translate",
            "corpus": "/corpus"
        }
    }


# Include routers
app.include_router(reader.router, prefix="/reader", tags=["Reader"])
app.include_router(semantia.router, prefix="/semantia", tags=["Semantia"])
app.include_router(translate.router, prefix="/translate", tags=["Translate"])
app.include_router(corpus.router, prefix="/corpus", tags=["Corpus"])


# Make database pool available to routers
app.state.db_pool = db_pool


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
