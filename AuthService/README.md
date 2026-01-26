# Auth Service - Keycloak Integration

A Go-based authentication service that integrates with Keycloak for user authentication, registration, and SSO (Single Sign-On) capabilities.

## Features

- ✅ Email/Password Authentication
- ✅ User Registration
- ✅ Token Refresh
- ✅ SSO Integration (Google, GitHub, Apple)
- ✅ JWT Token Validation
- ✅ User Information Retrieval
- ✅ CORS Support
- ✅ Middleware for Protected Routes

## Prerequisites

- Go 1.21 or higher
- Keycloak server (8.0+)
- PostgreSQL (for Keycloak)

## Keycloak Setup

### 1. Install Keycloak

```bash
# Using Docker
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

### 2. Configure Keycloak

1. Access Keycloak Admin Console: http://localhost:8080
2. Login with `admin` / `admin`
3. Create a new Realm: `stockvision`
4. Create a Client:
   - Client ID: `stockvision-frontend`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:5173/*`
   - Web Origins: `http://localhost:5173`
5. Get Client Secret from Credentials tab

### 3. Configure Identity Providers (SSO)

For each provider (Google, GitHub, Apple):

1. Go to Identity Providers in Keycloak
2. Add provider
3. Configure with your OAuth credentials
4. Set alias matching the provider name (google, github, apple)

#### Google OAuth Setup
- Go to https://console.cloud.google.com/
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:8080/realms/stockvision/broker/google/endpoint`

#### GitHub OAuth Setup
- Go to https://github.com/settings/developers
- Create OAuth App
- Authorization callback URL: `http://localhost:8080/realms/stockvision/broker/github/endpoint`

## Installation

```bash
cd AuthService

# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Update .env with your Keycloak configuration
```

## Configuration

Update `.env` file:

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=stockvision
KEYCLOAK_CLIENT_ID=stockvision-frontend
KEYCLOAK_CLIENT_SECRET=your-client-secret-from-keycloak

PORT=8081
FRONTEND_URL=http://localhost:5173
```

## Running the Service

```bash
# Development
go run main.go

# Build and run
go build -o auth-service
./auth-service
```

The service will start on `http://localhost:8081`

## API Endpoints

### Public Endpoints

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get SSO Login URL
```bash
GET /api/v1/auth/sso/login-url?provider=google&redirect_uri=http://localhost:5173/auth/callback
```

#### SSO Callback
```bash
POST /api/v1/auth/sso/callback
Content-Type: application/json

{
  "code": "authorization-code",
  "redirect_uri": "http://localhost:5173/auth/callback"
}
```

#### Validate Token
```bash
GET /api/v1/auth/validate
Authorization: Bearer <access-token>
```

#### Logout
```bash
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Protected Endpoints

#### Get User Info
```bash
GET /api/v1/user/me
Authorization: Bearer <access-token>
```

## Frontend Integration

Update your Auth.tsx to call these endpoints:

```typescript
// Login
const response = await fetch('http://localhost:8081/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// SSO Login
const ssoResponse = await fetch(
  `http://localhost:8081/api/v1/auth/sso/login-url?provider=google&redirect_uri=${redirectUri}`
);
const { url } = await ssoResponse.json();
window.location.href = url;
```

## Project Structure

```
AuthService/
├── config/          # Configuration management
├── handlers/        # HTTP request handlers
├── middleware/      # Auth middleware
├── models/          # Data models
├── services/        # Business logic (Keycloak service)
├── main.go          # Application entry point
├── go.mod           # Go module definition
└── README.md        # This file
```

## Security Considerations

1. **Production Setup:**
   - Use HTTPS in production
   - Store secrets in secure vault (e.g., HashiCorp Vault)
   - Use strong JWT secrets
   - Enable rate limiting
   - Set up proper CORS policies

2. **Keycloak:**
   - Use PostgreSQL instead of H2 in production
   - Configure SSL/TLS
   - Set up user federation if needed
   - Configure session timeouts
   - Enable brute force detection

## Testing

```bash
# Run tests
go test ./...

# Test health endpoint
curl http://localhost:8081/health
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o auth-service

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/auth-service .
EXPOSE 8081
CMD ["./auth-service"]
```

Build and run:

```bash
docker build -t auth-service .
docker run -p 8081:8081 --env-file .env auth-service
```

## Troubleshooting

1. **Connection refused to Keycloak:**
   - Ensure Keycloak is running
   - Check KEYCLOAK_URL in .env

2. **Invalid client credentials:**
   - Verify CLIENT_ID and CLIENT_SECRET
   - Check client configuration in Keycloak

3. **CORS errors:**
   - Verify FRONTEND_URL in .env
   - Check Web Origins in Keycloak client settings

## License

MIT
