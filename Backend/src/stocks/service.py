"""Stocks service layer for dedicated stock data fetching."""

import yfinance as yf
from src.shared.market_data import fetch_batch_summary


class StocksService:
    """Service layer for fetching core stock data using yfinance."""

    def get_ticker_info(self, symbol: str) -> dict:
        """Get ticker info."""
        ticker = yf.Ticker(symbol)
        return ticker.info

    def get_ticker_history(self, symbol: str, period: str = "1mo") -> dict:
        """Get historical data."""
        ticker = yf.Ticker(symbol)

        # Automatically adjust data interval based on the chosen period
        interval = "1d"
        if period == "1d":
            interval = "5m"
        elif period == "5d":
            interval = "15m"
        elif period in ["1mo", "3mo", "6mo", "1y", "ytd"]:
            interval = "1d"
        elif period in ["2y", "5y", "10y", "max"]:
            interval = "1wk"

        history_df = ticker.history(period=period, interval=interval)

        # Convert index (datetime) to string so it can be easily serialized
        if not history_df.empty:
            history_df.index = history_df.index.astype(str)

        return history_df.to_dict(orient="index")

    def get_market_summary(self, symbols: list[str]) -> dict:
        """
        Get market summary (current price, % change, sparkline) for multiple symbols.
        Uses a single batched yf.download() call instead of per-symbol requests.
        """
        return fetch_batch_summary(symbols)
