from fastapi import APIRouter

router = APIRouter()

@router.get("/availability")
async def get_availability():
    return {
        "greek": {"status": "available", "count": 6600000},
        "latin": {"status": "available", "count": 3200000},
        "hebrew": {"status": "coming_soon", "count": 0},
        "aramaic": {"status": "coming_soon", "count": 0}
    }

@router.get("/stats")
async def get_stats():
    return {
        "total_passages": 9800000,
        "total_authors": 380,
        "total_words": 125000000,
        "languages": 4
    }
