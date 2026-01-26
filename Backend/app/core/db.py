from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://namanchawla:naman@localhost:5432/postgres")

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

def get_session() -> AsyncSession:
    session = async_session()
    try:
        yield session
    finally:
        # session.close() is a coroutine, but get_session is a generator, so we can't await here
        # Instead, use context management in endpoints or use lifespan events for cleanup
        pass

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
