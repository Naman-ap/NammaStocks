const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Get SSO login URL
   */
  async getSSOLoginUrl(provider: 'google' | 'github' | 'apple'): Promise<string> {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const response = await fetch(
      `${API_BASE_URL}/auth/sso/login-url?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get SSO login URL');
    }

    const data = await response.json();
    return data.url;
  }

  /**
   * Handle SSO callback
   */
  async handleSSOCallback(code: string): Promise<AuthResponse> {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const response = await fetch(`${API_BASE_URL}/auth/sso/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'SSO callback failed');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (!this.refreshToken) {
      this.clearTokens();
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Get current user info
   */
  async getUserInfo(): Promise<UserInfo> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        try {
          await this.refreshAccessToken();
          return this.getUserInfo(); // Retry
        } catch {
          this.clearTokens();
          throw new Error('Session expired');
        }
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  /**
   * Validate current token
   */
  async validateToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Set tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear tokens
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Export singleton instance
export const authService = new AuthService();
