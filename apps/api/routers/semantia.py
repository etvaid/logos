from fastapi import APIRouter

router = APIRouter()

@router.get("/{word}")
async def get_word(word: str): return {"word": word, "status": "ready"}

@router.get("/{word}/neighbors")
async def get_neighbors(word: str): return {"word": word, "neighbors": []}
