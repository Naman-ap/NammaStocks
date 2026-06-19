"""Dashboard service layer for business logic."""

import requests
import yfinance as yf
from nselib import capital_market
from mftool import Mftool
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


class YFinanceService:
    """Service layer for yfinance temporary API experimentation."""
    
    def get_ticker_info(self, symbol: str) -> dict:
        """Get ticker info using yfinance."""
        ticker = yf.Ticker(symbol)
        return ticker.info

    def get_ticker_history(self, symbol: str, period: str = "1mo") -> dict:
        """Get historical data using yfinance."""
        ticker = yf.Ticker(symbol)
        history_df = ticker.history(period=period)
        
        # Convert index (datetime) to string so it can be easily serialized by Pydantic/FastAPI
        if not history_df.empty:
            history_df.index = history_df.index.astype(str)
            
        return history_df.to_dict(orient="index")


class NseService:
    """Service layer for nselib temporary API experimentation."""
    
    def get_price_volume_data(self, symbol: str, period: str = "1M") -> list[dict]:
        """Get price volume data using nselib."""
        df = capital_market.price_volume_data(symbol=symbol.upper(), period=period)
        if df is not None and not df.empty:
            return df.fillna("").to_dict(orient="records")
        return []


class MfService:
    """Service layer for mftool temporary API experimentation."""
    
    def __init__(self):
        self.mf = Mftool()
        
    def get_scheme_info(self, code: str) -> dict:
        """Get mutual fund scheme quote."""
        try:
            return self.mf.get_scheme_quote(code) or {}
        except Exception as e:
            return {"error": str(e)}
        
    def get_scheme_history(self, code: str) -> dict:
        """Get mutual fund scheme historical nav."""
        import json
        try:
            data = self.mf.get_scheme_historical_nav(code, as_json=True)
            if isinstance(data, str):
                try:
                    return json.loads(data)
                except:
                    return {"error": "Invalid data returned", "data": data}
            return data or {}
        except Exception as e:
            return {"error": str(e)}
