"""LOGOS API - Minimal Working Version"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="LOGOS API", version="1.0", description="Classical Research Platform - 662K passages")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
BACKEND = Path(__file__).parent
EMBEDDINGS_INDEX = {}
CONNECTOME = {}

@app.on_event("startup")
async def load_data():
    global EMBEDDINGS_INDEX, CONNECTOME
    idx_file = BACKEND / "embeddings_index.json"
    if idx_file.exists():
        with open(idx_file) as f:
            EMBEDDINGS_INDEX = json.load(f)
        print(f"✓ Loaded {len(EMBEDDINGS_INDEX)} passages")
    
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
        "passages": len(EMBEDDINGS_INDEX),
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "passages": len(EMBEDDINGS_INDEX)}

@app.get("/api/passages")
async def list_passages(limit: int = Query(20, le=100), offset: int = 0):
    keys = list(EMBEDDINGS_INDEX.keys())[offset:offset+limit]
    return {"passages": [{**EMBEDDINGS_INDEX[k], "id": k} for k in keys], "total": len(EMBEDDINGS_INDEX)}

@app.get("/api/passages/{passage_id}")
async def get_passage(passage_id: str):
    if passage_id in EMBEDDINGS_INDEX:
        return {**EMBEDDINGS_INDEX[passage_id], "id": passage_id}
    return {"error": "Not found"}

@app.get("/api/search")
async def search(q: str, limit: int = 20):
    results = []
    q_lower = q.lower()
    for pid, data in EMBEDDINGS_INDEX.items():
        text = data.get("text", "").lower()
        if q_lower in text:
            results.append({**data, "id": pid})
            if len(results) >= limit:
                break
    return {"results": results, "count": len(results)}

@app.get("/api/connectome")
async def get_connectome():
    return CONNECTOME

@app.get("/api/stats")
async def stats():
    return {
        "passages": len(EMBEDDINGS_INDEX),
        "connectome_nodes": len(CONNECTOME.get("nodes", [])),
        "connectome_edges": len(CONNECTOME.get("edges", []))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
