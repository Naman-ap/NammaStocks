#!/bin/bash

# Keycloak Quick Setup Script
# This script helps automate the initial Keycloak setup

set -e

echo "==================================="
echo "Keycloak Setup for StockVision Auth"
echo "==================================="
echo ""

# Check if docker-compose is running
echo "Checking if Keycloak is running..."
if ! docker ps | grep -q keycloak; then
    echo "Starting Keycloak with docker-compose..."
    docker-compose up -d
    echo "Waiting 60 seconds for Keycloak to fully start..."
    sleep 60
else
    echo "Keycloak is already running"
fi

# Check Keycloak health
echo ""
echo "Checking Keycloak health..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
        echo "✓ Keycloak is healthy!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for Keycloak to be ready... (attempt $attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "✗ Keycloak failed to start properly"
    exit 1
fi

echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo ""
echo "1. Open Keycloak Admin Console:"
echo "   → http://localhost:8080"
echo "   → Login: admin / admin"
echo ""
echo "2. Create Realm:"
echo "   → Click 'Create Realm'"
echo "   → Name: stockvision"
echo "   → Click 'Create'"
echo ""
echo "3. Quick Import (Alternative):"
echo "   → In Keycloak Admin Console"
echo "   → Click on 'Realm settings'"
echo "   → Go to 'Action' dropdown → 'Partial import'"
echo "   → Upload: keycloak-realm-config.json"
echo "   → Select resources to import"
echo "   → Click 'Import'"
echo ""
echo "4. Get Client Secret:"
echo "   → Go to Clients → 'auth-service'"
echo "   → Click 'Credentials' tab"
echo "   → Copy the Client Secret"
echo ""
echo "5. Update .env file:"
echo "   → Copy .env.example to .env"
echo "   → Update KEYCLOAK_CLIENT_SECRET with the secret from step 4"
echo ""
echo "6. Create test user:"
echo "   → Go to Users → Add user"
echo "   → Username: testuser"
echo "   → Email: test@example.com"
echo "   → Email verified: ON"
echo "   → Create → Set password in Credentials tab"
echo "   → Assign 'user' role in Role mappings tab"
echo ""
echo "7. Test the auth service:"
echo "   → go run main.go"
echo ""
echo "For detailed instructions, see KEYCLOAK_SETUP.md"
echo ""
