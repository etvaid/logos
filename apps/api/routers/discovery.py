from fastapi import APIRouter

router = APIRouter()

@router.get("/patterns")
async def get_patterns():
    return {"patterns": []}

@router.get("/hypotheses")
async def get_hypotheses():
    return {"hypotheses": []}

@router.post("/generate-paper")
async def generate_paper():
    return {"title": "", "content": "", "status": "pending"}
