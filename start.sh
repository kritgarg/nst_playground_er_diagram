#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down..."
  kill 0 2>/dev/null
  wait 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "Starting backend..."
cd "$ROOT/validator"

if [ ! -d .venv ]; then
  echo "  Creating Python venv..."
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q -r requirements.txt

uvicorn er_validator.api:app --reload --port 8000 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID (http://localhost:8000)"

echo "Starting frontend..."
cd "$ROOT/frontend"

if [ ! -d node_modules ]; then
  echo "  Installing npm dependencies..."
  npm install --silent
fi

npx vite --port 5173 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID (http://localhost:5173)"

echo ""
echo "Both servers running. Press Ctrl+C to stop."
wait
