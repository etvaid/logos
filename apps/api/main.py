from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, search, translate, discovery, semantia, verify, research, social

app = FastAPI(title="LOGOS API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(translate.router, prefix="/api/translate", tags=["translate"])
app.include_router(discovery.router, prefix="/api/discovery", tags=["discovery"])
app.include_router(semantia.router, prefix="/api/semantia", tags=["semantia"])
app.include_router(verify.router, prefix="/api/verify", tags=["verify"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(social.router, prefix="/api/social", tags=["social"])

@app.get("/")
async def root():
    return {"name": "LOGOS API", "version": "2.0.0", "features": ["5 Analysis Layers", "SEMANTIA", "Truth Verification"]}

@app.get("/health")
async def health():
    return {"status": "healthy"}
