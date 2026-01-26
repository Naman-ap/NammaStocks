package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stockvision/auth-service/models"
	"github.com/stockvision/auth-service/services"
)

type AuthHandler struct {
	keycloakService *services.KeycloakService
}

func NewAuthHandler(keycloakService *services.KeycloakService) *AuthHandler {
	return &AuthHandler{
		keycloakService: keycloakService,
	}
}

// Login handles user login
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
		return
	}

	authResp, err := h.keycloakService.Login(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "authentication_failed",
			Message: "Invalid email or password",
		})
		return
	}

	c.JSON(http.StatusOK, authResp)
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
		return
	}

	authResp, err := h.keycloakService.Register(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "registration_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, authResp)
}

// RefreshToken handles token refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req models.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
		return
	}

	authResp, err := h.keycloakService.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "token_refresh_failed",
			Message: "Invalid or expired refresh token",
		})
		return
	}

	c.JSON(http.StatusOK, authResp)
}

// Logout handles user logout
func (h *AuthHandler) Logout(c *gin.Context) {
	var req models.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
		return
	}

	err := h.keycloakService.Logout(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "logout_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// GetUserInfo returns information about the authenticated user
func (h *AuthHandler) GetUserInfo(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" || len(token) < 8 {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "Missing or invalid authorization token",
		})
		return
	}

	// Remove "Bearer " prefix
	accessToken := token[7:]

	userInfo, err := h.keycloakService.GetUserInfo(c.Request.Context(), accessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "invalid_token",
			Message: "Failed to retrieve user information",
		})
		return
	}

	c.JSON(http.StatusOK, userInfo)
}

// GetSSOLoginURL returns the SSO login URL for a provider
func (h *AuthHandler) GetSSOLoginURL(c *gin.Context) {
	provider := c.Query("provider")
	redirectURI := c.Query("redirect_uri")

	if provider == "" || redirectURI == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: "provider and redirect_uri are required",
		})
		return
	}

	url, err := h.keycloakService.GetSSOLoginURL(provider, redirectURI)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_provider",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}

// SSOCallback handles the SSO callback
func (h *AuthHandler) SSOCallback(c *gin.Context) {
	code := c.Query("code")
	redirectURI := c.Query("redirect_uri")

	if code == "" || redirectURI == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: "code and redirect_uri are required",
		})
		return
	}

	authResp, err := h.keycloakService.ExchangeCodeForToken(c.Request.Context(), code, redirectURI)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "sso_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, authResp)
}

// ValidateToken validates an access token
func (h *AuthHandler) ValidateToken(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" || len(token) < 8 {
		c.JSON(http.StatusUnauthorized, gin.H{"valid": false})
		return
	}

	// Remove "Bearer " prefix
	accessToken := token[7:]

	valid, err := h.keycloakService.ValidateToken(c.Request.Context(), accessToken)
	if err != nil || !valid {
		c.JSON(http.StatusUnauthorized, gin.H{"valid": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"valid": true})
}
