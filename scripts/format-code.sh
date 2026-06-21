#!/bin/bash

# Format all TypeScript and JavaScript files in the project
echo "Formatting code with Prettier..."

# Format main source files
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"

# Format server files
npx prettier --write "server/**/*.{ts,js}"

# Format e2e test files
npx prettier --write "e2e/src/**/*.{ts,js}"

echo "Code formatting complete!"

# Verify formatting
echo "Verifying formatting..."
if npx prettier --check "src/**/*.{ts,tsx,js,jsx}" "server/**/*.{ts,js}" "e2e/src/**/*.{ts,js}"; then
    echo "All files are properly formatted"
else
    echo "Some files still have formatting issues"
    exit 1
fi
