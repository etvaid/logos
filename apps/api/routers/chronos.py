from fastapi import APIRouter

router = APIRouter()

@router.get("/{word}")
async def get_temporal(word: str):
    return {"word": word, "periods": [], "drift_score": 0.0}

@router.get("/periods")
async def list_periods():
    return {"periods": [
        {"name": "Archaic", "start": -800, "end": -500},
        {"name": "Classical", "start": -500, "end": -323},
        {"name": "Hellenistic", "start": -323, "end": -31},
        {"name": "Roman", "start": -31, "end": 300}
    ]}
