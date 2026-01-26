package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/stockvision/auth-service/config"
	"github.com/stockvision/auth-service/handlers"
	"github.com/stockvision/auth-service/middleware"
	"github.com/stockvision/auth-service/services"
	
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "github.com/stockvision/auth-service/docs"
)

// @title StockVision Auth Service API
// @version 1.0
// @description Authentication and authorization service for StockVision platform
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@stockvision.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8001
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize Keycloak service
	keycloakService := services.NewKeycloakService(cfg)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(keycloakService)

	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	
	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "auth-service",
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", authHandler.Logout)
			
			// SSO routes
			auth.GET("/sso/login-url", authHandler.GetSSOLoginURL)
			auth.POST("/sso/callback", authHandler.SSOCallback)
			
			// Token validation
			auth.GET("/validate", authHandler.ValidateToken)
		}

		// Protected routes
		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware(keycloakService))
		{
			protected.GET("/user/me", authHandler.GetUserInfo)
		}
	}

	// Start server
	port := ":" + cfg.Port
	log.Printf("Auth service starting on port %s", port)
	log.Printf("Keycloak URL: %s", cfg.KeycloakURL)
	log.Printf("Keycloak Realm: %s", cfg.KeycloakRealm)
	
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
