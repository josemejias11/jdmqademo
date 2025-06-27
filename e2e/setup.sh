#!/bin/bash

# Script to set up the E2E testing structure

echo "Setting up E2E testing framework..."

# Create directory structure if not exists
mkdir -p src/{api,config,fixtures,models,pages,utils}
mkdir -p src/specs/{api,auth,dashboard,smoke,tasks,visual}

# Create basic directory structure
echo "✓ Directory structure created"

# Install dependencies
npm install
echo "✓ Dependencies installed"

# Install browsers
echo "Installing browsers for Playwright..."
npx playwright install
echo "✓ Browsers installed"

# Set up environment file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ .env file created from template"
else
  echo "✓ .env file already exists"
fi

# Create initial test run
echo "Setup complete! Run your first test with:"
echo ""
echo "npm run test:smoke"
echo ""
echo "Happy testing!"
