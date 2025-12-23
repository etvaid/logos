from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ClaimRequest(BaseModel):
    claim: str

CLAIMS = {
    "caesar": {"claim": "Caesar crossed the Rubicon", "corroboration_score": 85, "confidence": "HIGH", "verdict": "LIKELY TRUE", "fact_vs_embellishment": 85},
    "constantine": {"claim": "Constantine saw a cross", "corroboration_score": 45, "confidence": "LOW", "verdict": "UNCERTAIN", "fact_vs_embellishment": 35},
    "nero": {"claim": "Nero played while Rome burned", "corroboration_score": 25, "confidence": "LOW", "verdict": "LIKELY EMBELLISHED", "fact_vs_embellishment": 15},
}

@router.post("/claim")
async def verify_claim(req: ClaimRequest):
    for k, v in CLAIMS.items():
        if k in req.claim.lower():
            return v
    return {"claim": req.claim, "corroboration_score": 50, "verdict": "UNCERTAIN", "fact_vs_embellishment": 50}
