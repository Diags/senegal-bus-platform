#!/bin/bash

# Script to generate a secure NEXTAUTH_SECRET for production
# Usage: ./scripts/generate-nextauth-secret.sh

echo "🔐 Generating secure NEXTAUTH_SECRET..."
echo ""

# Generate a secure random string using openssl
SECRET=$(openssl rand -base64 32)

echo "✅ Your NEXTAUTH_SECRET:"
echo ""
echo "$SECRET"
echo ""
echo "📋 Copy this value and use it in Vercel environment variables"
echo ""
echo "To add to Vercel:"
echo "  1. Go to your Vercel project settings"
echo "  2. Environment Variables → Add"
echo "  3. Key: NEXTAUTH_SECRET"
echo "  4. Value: <paste the secret above>"
echo "  5. Environment: Production"
echo "  6. Save"
echo ""

