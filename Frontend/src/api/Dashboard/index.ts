import { get } from '../http';

// Types
export interface NewsSentimentResponse {
  [key: string]: unknown;
}

export interface CompanyOverview {
  [key: string]: unknown;
}

export interface TopGainersLosers {
  metadata?: {
    last_updated: string;
  };
  top_gainers?: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
  }>;
  top_losers?: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
  }>;
  most_actively_traded?: Array<{
    ticker: string;
    price: string;
    volume: string;
  }>;
  [key: string]: unknown;
}

// API Calls
export const dashboardApi = {
  /**
   * Get news sentiment from Finnhub for a specific ticker
   * Endpoint: GET /dashboard/news-sentiment-finnhub?ticker={ticker}
   */
  async getNewsSentimentFinnhub(ticker: string): Promise<NewsSentimentResponse> {
    return get<NewsSentimentResponse>(`/dashboard/news-sentiment-finnhub?ticker=${encodeURIComponent(ticker)}`);
  },

  /**
   * Get top gainers, losers, and most actively traded stocks
   * Endpoint: GET /dashboard/top-gainers-losers-direct
   */
  async getTopGainersLosers(): Promise<TopGainersLosers> {
    return get<TopGainersLosers>('/dashboard/top-gainers-losers-direct');
  },

  /**
   * Get company overview for a specific symbol
   * Endpoint: GET /dashboard/company-overview-direct?symbol={symbol}
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    return get<CompanyOverview>(`/dashboard/company-overview-direct?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
  },

  /**
   * Get news sentiment for a specific topic
   * Endpoint: GET /dashboard/news-sentiment?topics={topics}
   */
  async getNewsSentiment(topics: string): Promise<NewsSentimentResponse> {
    return get<NewsSentimentResponse>(`/dashboard/news-sentiment?topics=${encodeURIComponent(topics)}`);
  },
};
