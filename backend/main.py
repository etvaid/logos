"""LOGOS API - Production Version"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="LOGOS API", version="1.0", description="Classical Research Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND = Path(__file__).parent
PASSAGES = []
CONNECTOME = {}

@app.on_event("startup")
async def load_data():
    global PASSAGES, CONNECTOME
    idx_file = BACKEND / "embeddings_index.json"
    if idx_file.exists():
        with open(idx_file) as f:
            PASSAGES = json.load(f)
        print(f"✓ Loaded {len(PASSAGES)} passages")
    
    graph_file = BACKEND / "connectome_graph.json"
    if graph_file.exists():
        with open(graph_file) as f:
            CONNECTOME = json.load(f)
        print(f"✓ Loaded connectome graph")

@app.get("/")
async def root():
    return {
        "name": "LOGOS API",
        "version": "1.0",
        "passages": len(PASSAGES),
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "passages": len(PASSAGES)}

@app.get("/api/passages")
async def list_passages(limit: int = Query(20, le=100), offset: int = 0):
    return {"passages": PASSAGES[offset:offset+limit], "total": len(PASSAGES)}

@app.get("/api/passages/{passage_id}")
async def get_passage(passage_id: str):
    for p in PASSAGES:
        if p.get("id") == passage_id:
            return p
    return {"error": "Not found"}

@app.get("/api/search")
async def search(q: str = Query(...), limit: int = 20):
    q_lower = q.lower()
    results = [p for p in PASSAGES if q_lower in p.get("id", "").lower()][:limit]
    return {"results": results, "count": len(results), "query": q}

@app.get("/api/connectome")
async def get_connectome():
    return CONNECTOME

@app.get("/api/stats")
async def stats():
    return {
        "passages": len(PASSAGES),
        "connectome_nodes": len(CONNECTOME.get("nodes", [])),
        "connectome_edges": len(CONNECTOME.get("edges", []))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
