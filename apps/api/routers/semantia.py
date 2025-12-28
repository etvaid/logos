from fastapi import APIRouter

router = APIRouter()

@router.get("/{word}")
async def get_word_semantia(word: str):
    return {"word": word, "status": "coming_soon", "message": "SEMANTIA endpoint in development"}

@router.get("/{word}/neighbors")
async def get_neighbors(word: str):
    return {"word": word, "neighbors": [], "status": "coming_soon"}
