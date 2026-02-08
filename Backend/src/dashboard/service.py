"""Dashboard service layer for business logic."""

import requests
from src.dashboard.repository import DashboardRepository
from src.dashboard.models import DashboardMetric
from src.dashboard.schemas import (
    DashboardMetricCreate,
    DashboardMetricUpdate,
    DashboardMetricRead,
    DashboardOverview,
    NewsSentimentResponse
)
from src.dashboard.exceptions import (
    DashboardMetricNotFoundException,
    DashboardMetricAlreadyExistsException
)
from src.dashboard.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL


class DashboardService:
    """Service layer for dashboard business logic."""
    
    def __init__(self, repo: DashboardRepository):
        self.repo = repo
    
    async def create_metric(self, metric_create: DashboardMetricCreate) -> DashboardMetric:
        """Create a new dashboard metric."""
        # Check if metric with same name already exists
        existing = await self.repo.get_by_name(metric_create.metric_name)
        if existing:
            raise DashboardMetricAlreadyExistsException(
                f"Metric '{metric_create.metric_name}' already exists"
            )
        
        metric = DashboardMetric.model_validate(metric_create)
        return await self.repo.create(metric)
    
    async def get_metric(self, metric_id: int) -> DashboardMetric:
        """Get a dashboard metric by ID."""
        metric = await self.repo.get(metric_id)
        if not metric:
            raise DashboardMetricNotFoundException(
                f"Dashboard metric {metric_id} not found"
            )
        return metric
    
    async def get_news_sentiment(self, ticker: str) -> dict:
        """Get news sentiment for a specific ticker from Alpha Vantage."""
        params = {
            "function": "NEWS_SENTIMENT",
            "tickers": ticker.upper(),
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    
    async def get_metrics(
        self,
        skip: int = 0,
        limit: int = 100,
        category: str | None = None
    ) -> list[DashboardMetric]:
        """Get all dashboard metrics with optional filtering."""
        return await self.repo.get_all(skip=skip, limit=limit, category=category)
    
    async def update_metric(
        self,
        metric_id: int,
        metric_update: DashboardMetricUpdate
    ) -> DashboardMetric:
        """Update a dashboard metric."""
        metric = await self.get_metric(metric_id)
        
        # Update only provided fields
        update_data = metric_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(metric, field, value)
        
        return await self.repo.update(metric)
    
    async def delete_metric(self, metric_id: int) -> bool:
        """Delete a dashboard metric."""
        metric = await self.get_metric(metric_id)
        return await self.repo.delete(metric_id)
    
    async def get_overview(self) -> DashboardOverview:
        """Get dashboard overview with aggregated data."""
        total = await self.repo.count()
        categories = await self.repo.get_categories()
        latest = await self.repo.get_latest(limit=10)
        
        return DashboardOverview(
            total_metrics=total,
            categories=categories,
            latest_metrics=[DashboardMetricRead.model_validate(m) for m in latest]
        )
