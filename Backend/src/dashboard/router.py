"""Dashboard API router."""

import finnhub
import requests
from fastapi import APIRouter, Depends, status, Query
from src.dashboard.schemas import (
    DashboardMetricCreate,
    DashboardMetricUpdate,
    DashboardMetricRead,
    DashboardOverview,
    NewsSentimentResponse
)
from src.dashboard.service import DashboardService
from src.dashboard.dependencies import get_dashboard_service
from src.config import settings
from src.dashboard.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL
from typing import Optional

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/news-sentiment-finnhub")
async def get_news_finnhub(
    ticker: str = Query(..., description="Stock ticker symbol (e.g., AAPL)")
):
    """Get news sentiment from Finnhub API."""
    finnhub_client = finnhub.Client(api_key=settings.FINNHUB_API_KEY)
    return finnhub_client.news_sentiment(ticker)

@router.get("/top-gainers-losers-direct")
async def get_top_gainers_losers_direct():
    """Get top gainers, losers, and most actively traded stocks directly from AlphaVantage."""
    params = {
        "function": "TOP_GAINERS_LOSERS",
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()

@router.get("/company-overview-direct")
async def get_company_overview_direct(
    symbol: str = Query(..., description="Stock ticker symbol (e.g., IBM)")
):
    """Get company overview directly from AlphaVantage API."""
    params = {
        "function": "OVERVIEW",
        "symbol": symbol.upper(),
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()

@router.get("/news-sentiment", response_model=dict)
async def get_news_sentiment(
    topics: str = Query(..., description="Stock ticker symbol (e.g., AAPL)"),
    service: DashboardService = Depends(get_dashboard_service)
) -> dict:
    """Get news sentiment for a specific stock ticker."""
    return await service.get_news_sentiment(topics)

@router.get("/top-gainers-losers", response_model=dict)
async def get_top_gainers_losers(
    service: DashboardService = Depends(get_dashboard_service)
) -> dict:
    """Get top gainers, losers, and most actively traded stocks."""
    return await service.get_top_gainers_losers()

@router.get("/company-overview", response_model=dict)
async def get_company_overview(
    symbol: str = Query(..., description="Stock ticker symbol (e.g., IBM)"),
    service: DashboardService = Depends(get_dashboard_service)
) -> dict:
    """Get company overview and fundamental data for a specific stock ticker."""
    return await service.get_company_overview(symbol)

@router.post(
    "/metrics",
    response_model=DashboardMetricRead,
    status_code=status.HTTP_201_CREATED
)
async def create_metric(
    metric: DashboardMetricCreate,
    service: DashboardService = Depends(get_dashboard_service)
) -> DashboardMetricRead:
    """Create a new dashboard metric."""
    result = await service.create_metric(metric)
    return DashboardMetricRead.model_validate(result)


@router.get("/metrics/{metric_id}", response_model=DashboardMetricRead)
async def get_metric(
    metric_id: int,
    service: DashboardService = Depends(get_dashboard_service)
) -> DashboardMetricRead:
    """Get a dashboard metric by ID."""
    result = await service.get_metric(metric_id)
    return DashboardMetricRead.model_validate(result)


@router.get("/metrics", response_model=list[DashboardMetricRead])
async def list_metrics(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    service: DashboardService = Depends(get_dashboard_service)
) -> list[DashboardMetricRead]:
    """List all dashboard metrics with optional filtering."""
    results = await service.get_metrics(skip=skip, limit=limit, category=category)
    return [DashboardMetricRead.model_validate(r) for r in results]


@router.patch("/metrics/{metric_id}", response_model=DashboardMetricRead)
async def update_metric(
    metric_id: int,
    metric_update: DashboardMetricUpdate,
    service: DashboardService = Depends(get_dashboard_service)
) -> DashboardMetricRead:
    """Update a dashboard metric."""
    result = await service.update_metric(metric_id, metric_update)
    return DashboardMetricRead.model_validate(result)


@router.delete("/metrics/{metric_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_metric(
    metric_id: int,
    service: DashboardService = Depends(get_dashboard_service)
) -> None:
    """Delete a dashboard metric."""
    await service.delete_metric(metric_id)


@router.get("/overview", response_model=DashboardOverview)
async def get_overview(
    service: DashboardService = Depends(get_dashboard_service)
) -> DashboardOverview:
    """Get dashboard overview with aggregated metrics."""
    return await service.get_overview()
