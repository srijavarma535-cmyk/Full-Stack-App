#!/bin/bash

echo "=================================="
echo "Library Management System Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo -e "${GREEN}✓${NC} npm found: $(npm -v)"
echo ""

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo ""
echo "=================================="
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo "=================================="
echo ""
echo "To start the application:"
echo ""
echo "  Option 1 - Start both frontend and backend:"
echo "    npm run dev"
echo ""
echo "  Option 2 - Start separately:"
echo "    Terminal 1: cd backend && npm run dev"
echo "    Terminal 2: cd frontend && npm run dev"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:3000"
echo ""
