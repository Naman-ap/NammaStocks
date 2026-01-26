package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/Nerzal/gocloak/v13"
	"github.com/stockvision/auth-service/config"
	"github.com/stockvision/auth-service/models"
)

type KeycloakService struct {
	client *gocloak.GoCloak
	config *config.Config
}

func NewKeycloakService(cfg *config.Config) *KeycloakService {
	client := gocloak.NewClient(cfg.KeycloakURL)
	return &KeycloakService{
		client: client,
		config: cfg,
	}
}

// Login authenticates a user with email and password
func (s *KeycloakService) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	token, err := s.client.Login(
		ctx,
		s.config.KeycloakClientID,
		s.config.KeycloakClientSecret,
		s.config.KeycloakRealm,
		req.Email,
		req.Password,
	)
	if err != nil {
		return nil, fmt.Errorf("login failed: %w", err)
	}

	// Get user info
	userInfo, err := s.GetUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	return &models.AuthResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.ExpiresIn,
		User:         userInfo,
	}, nil
}

// Register creates a new user in Keycloak
func (s *KeycloakService) Register(ctx context.Context, req *models.RegisterRequest) (*models.AuthResponse, error) {
	if req.Password != req.ConfirmPassword {
		return nil, errors.New("passwords do not match")
	}

	// Get admin token
	adminToken, err := s.getAdminToken(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get admin token: %w", err)
	}

	// Create user
	enabled := true
	emailVerified := false
	user := gocloak.User{
		Username:      gocloak.StringP(req.Email),
		Email:         gocloak.StringP(req.Email),
		FirstName:     gocloak.StringP(req.Name),
		Enabled:       &enabled,
		EmailVerified: &emailVerified,
		Credentials: &[]gocloak.CredentialRepresentation{
			{
				Type:      gocloak.StringP("password"),
				Value:     gocloak.StringP(req.Password),
				Temporary: gocloak.BoolP(false),
			},
		},
	}

	userID, err := s.client.CreateUser(ctx, adminToken, s.config.KeycloakRealm, user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Login the newly created user
	loginReq := &models.LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	}

	authResponse, err := s.Login(ctx, loginReq)
	if err != nil {
		// If login fails, try to delete the created user
		_ = s.client.DeleteUser(ctx, adminToken, s.config.KeycloakRealm, userID)
		return nil, fmt.Errorf("failed to login after registration: %w", err)
	}

	return authResponse, nil
}

// RefreshToken refreshes the access token using a refresh token
func (s *KeycloakService) RefreshToken(ctx context.Context, refreshToken string) (*models.AuthResponse, error) {
	token, err := s.client.RefreshToken(
		ctx,
		refreshToken,
		s.config.KeycloakClientID,
		s.config.KeycloakClientSecret,
		s.config.KeycloakRealm,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token: %w", err)
	}

	userInfo, err := s.GetUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	return &models.AuthResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.ExpiresIn,
		User:         userInfo,
	}, nil
}

// Logout logs out a user
func (s *KeycloakService) Logout(ctx context.Context, refreshToken string) error {
	err := s.client.Logout(
		ctx,
		s.config.KeycloakClientID,
		s.config.KeycloakClientSecret,
		s.config.KeycloakRealm,
		refreshToken,
	)
	if err != nil {
		return fmt.Errorf("logout failed: %w", err)
	}
	return nil
}

// GetUserInfo retrieves user information from an access token
func (s *KeycloakService) GetUserInfo(ctx context.Context, accessToken string) (*models.UserInfo, error) {
	userInfo, err := s.client.GetUserInfo(ctx, accessToken, s.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	email := ""
	if userInfo.Email != nil {
		email = *userInfo.Email
	}

	name := ""
	if userInfo.Name != nil {
		name = *userInfo.Name
	}

	verified := false
	if userInfo.EmailVerified != nil {
		verified = *userInfo.EmailVerified
	}

	return &models.UserInfo{
		ID:       *userInfo.Sub,
		Email:    email,
		Name:     name,
		Verified: verified,
	}, nil
}

// ValidateToken validates an access token
func (s *KeycloakService) ValidateToken(ctx context.Context, accessToken string) (bool, error) {
	_, err := s.client.RetrospectToken(
		ctx,
		accessToken,
		s.config.KeycloakClientID,
		s.config.KeycloakClientSecret,
		s.config.KeycloakRealm,
	)
	if err != nil {
		return false, err
	}
	return true, nil
}

// GetSSOLoginURL returns the SSO login URL for a provider
func (s *KeycloakService) GetSSOLoginURL(provider, redirectURI string) (string, error) {
	// Map provider names to Keycloak identity provider aliases
	providerMap := map[string]string{
		"google": "google",
		"github": "github",
		"apple":  "apple",
	}

	idpAlias, exists := providerMap[provider]
	if !exists {
		return "", fmt.Errorf("unsupported provider: %s", provider)
	}

	// Construct Keycloak SSO URL
	url := fmt.Sprintf(
		"%s/realms/%s/protocol/openid-connect/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=openid&kc_idp_hint=%s",
		s.config.KeycloakURL,
		s.config.KeycloakRealm,
		s.config.KeycloakClientID,
		redirectURI,
		idpAlias,
	)

	return url, nil
}

// ExchangeCodeForToken exchanges an authorization code for tokens
func (s *KeycloakService) ExchangeCodeForToken(ctx context.Context, code, redirectURI string) (*models.AuthResponse, error) {
	token, err := s.client.GetToken(
		ctx,
		s.config.KeycloakRealm,
		gocloak.TokenOptions{
			ClientID:     &s.config.KeycloakClientID,
			ClientSecret: &s.config.KeycloakClientSecret,
			Code:         &code,
			RedirectURI:  &redirectURI,
			GrantType:    gocloak.StringP("authorization_code"),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code for token: %w", err)
	}

	userInfo, err := s.GetUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	return &models.AuthResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.ExpiresIn,
		User:         userInfo,
	}, nil
}

// getAdminToken gets an admin token for administrative operations
func (s *KeycloakService) getAdminToken(ctx context.Context) (string, error) {
	// This assumes you have an admin user configured
	// In production, you should use a service account
	token, err := s.client.LoginAdmin(
		ctx,
		"admin",
		"admin",
		"master",
	)
	if err != nil {
		return "", err
	}
	return token.AccessToken, nil
}
