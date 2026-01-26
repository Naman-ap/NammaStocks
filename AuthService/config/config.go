package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	KeycloakURL          string
	KeycloakRealm        string
	KeycloakClientID     string
	KeycloakClientSecret string
	Port                 string
	FrontendURL          string
	JWTSecret            string
	GoogleClientID       string
	GoogleClientSecret   string
	GithubClientID       string
	GithubClientSecret   string
}

func LoadConfig() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		KeycloakURL:          getEnv("KEYCLOAK_URL", "http://localhost:8080"),
		KeycloakRealm:        getEnv("KEYCLOAK_REALM", "stockvision"),
		KeycloakClientID:     getEnv("KEYCLOAK_CLIENT_ID", "stockvision-frontend"),
		KeycloakClientSecret: getEnv("KEYCLOAK_CLIENT_SECRET", ""),
		Port:                 getEnv("PORT", "8081"),
		FrontendURL:          getEnv("FRONTEND_URL", "http://localhost:5173"),
		JWTSecret:            getEnv("JWT_SECRET", "default-secret-change-in-production"),
		GoogleClientID:       getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret:   getEnv("GOOGLE_CLIENT_SECRET", ""),
		GithubClientID:       getEnv("GITHUB_CLIENT_ID", ""),
		GithubClientSecret:   getEnv("GITHUB_CLIENT_SECRET", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
