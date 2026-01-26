# Keycloak Setup Guide for Auth Service

This guide will help you set up and configure Keycloak for the StockVision Auth Service.

## Prerequisites

- Docker and Docker Compose installed
- Port 8080 available (or configure a different port)

## Step 1: Start Keycloak

Keycloak is already configured in your `docker-compose.yml`. Start it with:

```bash
docker-compose up -d
```

This will start Keycloak on `http://localhost:8080`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin`

## Step 2: Access Keycloak Admin Console

1. Open your browser and navigate to: `http://localhost:8080`
2. Click on "Administration Console"
3. Login with username `admin` and password `admin`

## Step 3: Create a Realm

1. Click on the dropdown in the top-left corner (currently showing "master")
2. Click "Create Realm"
3. Fill in the details:
   - **Realm name**: `stockvision` (or match your `KEYCLOAK_REALM` env variable)
   - **Enabled**: ON
4. Click "Create"

## Step 4: Create a Client for Your Auth Service

1. In the left sidebar, click on "Clients"
2. Click "Create client"
3. **General Settings:**
   - **Client type**: OpenID Connect
   - **Client ID**: `auth-service` (or match your `KEYCLOAK_CLIENT_ID`)
   - Click "Next"

4. **Capability config:**
   - **Client authentication**: ON
   - **Authorization**: OFF
   - **Authentication flow**: Check all that apply:
     - ✓ Standard flow
     - ✓ Direct access grants
     - ✓ Service accounts roles
   - Click "Next"

5. **Login settings:**
   - **Root URL**: `http://localhost:3000` (your frontend URL)
   - **Home URL**: `http://localhost:3000`
   - **Valid redirect URIs**: 
     - `http://localhost:3000/*`
     - `http://localhost:5173/*` (if using Vite dev server)
   - **Valid post logout redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
   - Click "Save"

6. **Get Client Secret:**
   - Go to the "Credentials" tab
   - Copy the **Client Secret**
   - Update your `.env` file with: `KEYCLOAK_CLIENT_SECRET=<copied-secret>`

## Step 5: Configure Realm Settings

### Token Settings
1. Go to "Realm settings" in the left sidebar
2. Click on the "Tokens" tab
3. Configure token lifespans:
   - **Access Token Lifespan**: 5 minutes (default) or as needed
   - **Refresh Token Max Reuse**: 0 (recommended for security)
   - **SSO Session Idle**: 30 minutes
   - **SSO Session Max**: 10 hours
   - **Access Token Lifespan For Implicit Flow**: 15 minutes
4. Click "Save"

### Login Settings
1. In "Realm settings", click on the "Login" tab
2. Configure:
   - ✓ User registration
   - ✓ Forgot password
   - ✓ Remember me
   - ✓ Email as username (optional)
3. Click "Save"

## Step 6: Create Roles

1. Click on "Realm roles" in the left sidebar
2. Click "Create role"
3. Create the following roles:
   - **Role name**: `user`
     - Description: Standard user role
   - **Role name**: `admin`
     - Description: Administrator role
   - **Role name**: `premium`
     - Description: Premium subscriber role

## Step 7: Configure User Registration

1. Go to "Realm settings" → "Login" tab
2. Enable "User registration"
3. Go to "Authentication" in the left sidebar
4. Select "Registration" flow
5. Configure as needed (email verification, reCAPTCHA, etc.)

## Step 8: Create Test Users

### Manual User Creation
1. Click on "Users" in the left sidebar
2. Click "Add user"
3. Fill in:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **First name**: `Test`
   - **Last name**: `User`
   - **Email verified**: ON
   - **Enabled**: ON
4. Click "Create"
5. Go to "Credentials" tab
6. Click "Set password"
   - **Password**: Choose a password
   - **Temporary**: OFF
7. Click "Save"
8. Go to "Role mappings" tab
9. Click "Assign role"
10. Select "user" role
11. Click "Assign"

### Create Admin User
Repeat the above steps with:
- Username: `admin`
- Assign both `user` and `admin` roles

## Step 9: Configure Environment Variables

Update your `.env` file in the AuthService directory:

```env
# Server Configuration
PORT=8000
FRONTEND_URL=http://localhost:3000

# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=stockvision
KEYCLOAK_CLIENT_ID=auth-service
KEYCLOAK_CLIENT_SECRET=<your-client-secret-from-step-4>
```

## Step 10: Test the Setup

1. Start your auth service:
```bash
go run main.go
```

2. Test the health endpoint:
```bash
curl http://localhost:8000/health
```

3. Test SSO login URL generation:
```bash
curl http://localhost:8000/api/v1/auth/sso/login-url
```

4. Test user login:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "your-password"
  }'
```

## Step 11: Configure Client Scopes (Optional but Recommended)

1. Go to "Client scopes" in the left sidebar
2. Create custom scopes for your application:
   - Click "Create client scope"
   - **Name**: `profile-extended`
   - **Type**: Default
   - Add custom attributes/mappers as needed

3. Assign to your client:
   - Go to "Clients" → "auth-service"
   - Click "Client scopes" tab
   - Add your custom scopes to "Assigned default client scopes"

## Step 12: Enable Social Login (Optional)

### Google Login
1. Go to "Identity providers" in the left sidebar
2. Click "Add provider" → Select "Google"
3. Fill in:
   - **Redirect URI**: Copy this URL
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Click "Add"

### GitHub Login
1. Click "Add provider" → Select "GitHub"
2. Fill in:
   - **Redirect URI**: Copy this URL
   - **Client ID**: From GitHub OAuth Apps
   - **Client Secret**: From GitHub OAuth Apps
3. Click "Add"

## Troubleshooting

### Connection Refused Error
If you get "Connection refused" when starting your Go service:
- Ensure Keycloak is running: `docker ps`
- Check if port 8080 is accessible: `curl http://localhost:8080`
- Wait 30-60 seconds after starting Docker Compose for Keycloak to fully initialize

### Invalid Client Credentials
- Verify client secret in `.env` matches Keycloak admin console
- Ensure realm name and client ID are correct
- Check that client authentication is enabled

### Token Validation Fails
- Verify the realm is active
- Check token expiration settings
- Ensure correct realm and client configuration

## Security Best Practices

1. **Change Default Admin Password**: 
   - Go to "Admin" user → "Credentials" → Set a strong password

2. **Use HTTPS in Production**:
   - Configure SSL/TLS certificates
   - Update all URLs to use `https://`

3. **Restrict CORS**:
   - Only allow specific frontend origins
   - Don't use wildcards in production

4. **Enable Brute Force Detection**:
   - Go to "Realm settings" → "Security defenses"
   - Enable brute force detection
   - Configure lockout settings

5. **Regular Backups**:
   - Export realm configuration regularly
   - Backup Keycloak database

## Useful Keycloak Admin Commands

### Export Realm Configuration
```bash
docker exec -it keycloak /opt/keycloak/bin/kc.sh export \
  --dir /tmp/export \
  --realm stockvision
```

### Import Realm Configuration
```bash
docker exec -it keycloak /opt/keycloak/bin/kc.sh import \
  --dir /tmp/import \
  --realm stockvision
```

### View Logs
```bash
docker logs keycloak -f
```

## Integration with Frontend

Your frontend should implement the following flow:

1. **Login**: 
   - Call `GET /api/v1/auth/sso/login-url`
   - Redirect user to the returned URL
   - Handle callback at `/api/v1/auth/sso/callback`

2. **Store Tokens**: 
   - Store access token securely (httpOnly cookie or secure storage)
   - Store refresh token for token renewal

3. **Token Refresh**:
   - Call `POST /api/v1/auth/refresh` before token expires

4. **Logout**:
   - Call `POST /api/v1/auth/logout`
   - Clear local token storage

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/)
- [Go Keycloak Client Library](https://github.com/Nerzal/gocloak)
