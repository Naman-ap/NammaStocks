"""Dashboard Pydantic schemas for validation."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DashboardMetricCreate(BaseModel):
    """Schema for creating a dashboard metric."""
    
    metric_name: str = Field(..., min_length=1, max_length=255)
    metric_value: float
    metric_type: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class DashboardMetricUpdate(BaseModel):
    """Schema for updating a dashboard metric."""
    
    metric_name: Optional[str] = Field(None, min_length=1, max_length=255)
    metric_value: Optional[float] = None
    metric_type: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None


class DashboardMetricRead(BaseModel):
    """Schema for reading a dashboard metric."""
    
    id: int
    metric_name: str
    metric_value: float
    metric_type: str
    category: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DashboardOverview(BaseModel):
    """Schema for dashboard overview with aggregated metrics."""
    
    total_metrics: int
    categories: list[str]
    latest_metrics: list[DashboardMetricRead]


class NewsSentimentResponse(BaseModel):
    """Schema for news sentiment API response."""
    
    ticker: str
    feed: list[dict]
    sentiment_score_definition: Optional[str] = None
