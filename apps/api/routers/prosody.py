from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ScanRequest(BaseModel):
    text: str
    meter: str = "hexameter"

@router.post("/scan")
async def scan(req: ScanRequest):
    return {"text": req.text, "scansion": "", "meter": req.meter}

@router.get("/meters")
async def list_meters():
    return {"meters": ["hexameter", "pentameter", "iambic", "sapphic"]}
