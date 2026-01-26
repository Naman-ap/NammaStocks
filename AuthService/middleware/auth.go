package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/stockvision/auth-service/models"
	"github.com/stockvision/auth-service/services"
)

func AuthMiddleware(keycloakService *services.KeycloakService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Missing authorization token",
			})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid authorization header format",
			})
			c.Abort()
			return
		}

		accessToken := parts[1]

		// Validate token with Keycloak
		valid, err := keycloakService.ValidateToken(c.Request.Context(), accessToken)
		if err != nil || !valid {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid or expired token",
			})
			c.Abort()
			return
		}

		// Get user info and set in context
		userInfo, err := keycloakService.GetUserInfo(c.Request.Context(), accessToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Failed to retrieve user information",
			})
			c.Abort()
			return
		}

		c.Set("user", userInfo)
		c.Set("accessToken", accessToken)
		c.Next()
	}
}
