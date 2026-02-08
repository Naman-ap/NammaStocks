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

