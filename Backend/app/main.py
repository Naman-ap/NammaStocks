from fastapi import FastAPI
from app.api import items
from app.core.db import init_db
import asyncio

app = FastAPI()

app.include_router(items.router)

@app.on_event("startup")
async def on_startup():
    await init_db()
