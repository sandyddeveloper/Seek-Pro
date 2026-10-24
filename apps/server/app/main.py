from fastapi import FastAPI

app = FastAPI(
    title="Seek-Pro API",
    version="0.1.0",
    description="Backend API for Seek-Pro.",
)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
