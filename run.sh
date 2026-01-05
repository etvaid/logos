#!/bin/bash

echo "🏛️ LOGOS SPECTACULAR"
echo "===================="
echo ""

# Check if we need to install
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/venv" ]; then
    echo "🐍 Setting up Python environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend
cd backend
source venv/bin/activate 2>/dev/null || true
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 2

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ LOGOS is running!"
echo ""
echo "   Frontend: http://localhost:3003"
echo "   Backend:  http://localhost:8003"
echo ""
echo "Press Ctrl+C to stop"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
