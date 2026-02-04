"""Dashboard domain configuration."""

# Dashboard refresh intervals (in seconds)
DASHBOARD_CACHE_TTL = 300  # 5 minutes
DASHBOARD_REFRESH_INTERVAL = 60  # 1 minute

# Dashboard settings
DASHBOARD_MAX_METRICS_DISPLAY = 50
DASHBOARD_OVERVIEW_LATEST_COUNT = 10

# Alpha Vantage API settings
ALPHA_VANTAGE_API_KEY = "9CKJY6ZKNARGWZTM.9CKJY6ZKNARGWZTM."  # Replace with your API key
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"
