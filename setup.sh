#!/bin/bash

# Setup script for Mobile Basketball Stats

echo "🚀 Setting up Mobile Basketball Stats..."

# Setup backend
echo "📦 Setting up backend..."
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
npm install

echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:4000"