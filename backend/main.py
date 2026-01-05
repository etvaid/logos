import os
import importlib.util
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="LOGOS Spectacular API",
    description="AI-powered classical research platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "LOGOS API is running"}

# Dynamic router loading
def load_routers():
    routes_dir = Path(__file__).parent / "routes"
    if not routes_dir.exists():
        return
    
    # Load innovation routers
    innovations_dir = routes_dir / "innovations"
    if innovations_dir.exists():
        for file in innovations_dir.glob("*.py"):
            if file.name.startswith("_"):
                continue
            try:
                spec = importlib.util.spec_from_file_location(file.stem, file)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                if hasattr(module, "router"):
                    app.include_router(
                        module.router, 
                        prefix=f"/api/innovations/{file.stem}",
                        tags=[f"innovation:{file.stem}"]
                    )
                    print(f"✅ Loaded innovation router: {file.stem}")
            except Exception as e:
                print(f"⚠️ Failed to load {file.stem}: {e}")
    
    # Load section routers
    for section_dir in routes_dir.iterdir():
        if section_dir.is_dir() and section_dir.name != "innovations":
            for file in section_dir.glob("*.py"):
                if file.name.startswith("_"):
                    continue
                try:
                    spec = importlib.util.spec_from_file_location(file.stem, file)
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                    if hasattr(module, "router"):
                        app.include_router(
                            module.router,
                            prefix=f"/api/{section_dir.name}/{file.stem}",
                            tags=[section_dir.name]
                        )
                        print(f"✅ Loaded router: {section_dir.name}/{file.stem}")
                except Exception as e:
                    print(f"⚠️ Failed to load {section_dir.name}/{file.stem}: {e}")

# Load all routers on startup
load_routers()

# Serve generated data
DATA_PATH = Path(__file__).parent.parent / "generated-data"
if DATA_PATH.exists():
    @app.get("/api/data/{filename}")
    async def get_data(filename: str):
        import json
        file_path = DATA_PATH / filename
        if file_path.exists() and file_path.suffix == ".json":
            with open(file_path) as f:
                return json.load(f)
        return {"error": "File not found"}

if __name__ == "__main__":
    import uvicorn
    print("🏛️ Starting LOGOS API server on http://localhost:8003")
    uvicorn.run(app, host="0.0.0.0", port=8003)
