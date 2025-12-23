from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, base64, json, time

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    email: str

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@logosclassics.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "raizada2")

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    if req.email == ADMIN_EMAIL and req.password == ADMIN_PASSWORD:
        payload = {"email": req.email, "exp": int(time.time()) + 86400}
        token = base64.b64encode(json.dumps(payload).encode()).decode()
        return {"token": token, "email": req.email}
    raise HTTPException(401, "Invalid credentials")

@router.get("/me")
async def me(authorization: str = ""):
    try:
        token = authorization.replace("Bearer ", "")
        payload = json.loads(base64.b64decode(token))
        if payload.get("exp", 0) > time.time():
            return {"email": payload.get("email"), "role": "admin"}
    except: pass
    raise HTTPException(401, "Invalid token")

@router.post("/logout")
async def logout():
    return {"success": True}
