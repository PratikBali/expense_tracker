#!/bin/bash

# Expense Tracker Setup Script
# This script helps set up the development environment

echo "🚀 Expense Tracker Setup"
echo "========================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

echo "📦 Installing client dependencies..."
cd client && npm install
cd ..
echo ""

echo "📦 Installing server dependencies..."
cd server && npm install
cd ..
echo ""

# Create .env files if they don't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env from example..."
    cp server/.env.example server/.env
    echo "⚠️  Please edit server/.env with your actual credentials"
else
    echo "✓ server/.env already exists"
fi
echo ""

if [ ! -f "client/.env" ]; then
    echo "📝 Creating client/.env from example..."
    cp client/.env.example client/.env
    echo "⚠️  Please edit client/.env with your actual credentials"
else
    echo "✓ client/.env already exists"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit server/.env with your MongoDB URI and Google OAuth credentials"
echo "2. Edit client/.env with your API URL and Google Client ID"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - QUICKSTART.md (5-minute guide)"
echo "   - SETUP.md (detailed setup)"
echo ""
echo "Happy coding! 🎉"

