"""Dashboard dependencies for FastAPI dependency injection."""

from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.database import get_session
from src.dashboard.repository import DashboardRepository
from src.dashboard.service import DashboardService


async def get_dashboard_service(
    session: AsyncSession = Depends(get_session)
) -> DashboardService:
    """Get dashboard service instance."""
    repository = DashboardRepository(session)
    return DashboardService(repository)
