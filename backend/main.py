# ton API FastAPI
from fastapi import FastAPI
from auth_routes import router as auth_router
from db import engine
from models import Base
import asyncio

app = FastAPI()
app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    return {"message": "Welcome to the Auth API"}

# create tables (dev only)
async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.on_event("startup")
async def on_startup():
    await init_models()

@app.get("/health")
async def health():
    return {"ok": True}
