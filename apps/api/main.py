from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, search, translate, discovery, semantia, verify, research, social, parse, intertexts, commentary, learn, predict, ghost, bias, graph

app = FastAPI(title="LOGOS API", version="2.0.0", description="AI-Powered Classical Research - 5 Analysis Layers")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(translate.router, prefix="/api/translate", tags=["translate"])
app.include_router(discovery.router, prefix="/api/discovery", tags=["discovery"])

# Layer 2: SEMANTIA
app.include_router(semantia.router, prefix="/api/semantia", tags=["semantia"])

# Layer 3: Relationships
app.include_router(intertexts.router, prefix="/api/intertexts", tags=["intertexts"])
app.include_router(graph.router, prefix="/api/graph", tags=["graph"])
app.include_router(ghost.router, prefix="/api/ghost", tags=["ghost"])

# Layer 4: Truth/History
app.include_router(verify.router, prefix="/api/verify", tags=["verify"])
app.include_router(bias.router, prefix="/api/bias", tags=["bias"])

# Layer 5: Discovery
app.include_router(predict.router, prefix="/api/predict", tags=["predict"])

# Tools
app.include_router(parse.router, prefix="/api/parse", tags=["parse"])
app.include_router(commentary.router, prefix="/api/commentary", tags=["commentary"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(learn.router, prefix="/api/learn", tags=["learn"])
app.include_router(social.router, prefix="/api/social", tags=["social"])

@app.get("/")
async def root():
    return {
        "name": "LOGOS API",
        "version": "2.0.0",
        "layers": {
            "1_text": ["parse", "translate"],
            "2_semantic": ["semantia"],
            "3_relationship": ["intertexts", "graph", "ghost"],
            "4_truth": ["verify", "bias"],
            "5_discovery": ["discovery", "predict"]
        },
        "total_passages": "1.7M",
        "total_embeddings": "892K"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "routers": 16}
