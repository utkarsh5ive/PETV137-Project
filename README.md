# ET-26 — Dockerized Calculator

A Braun ET-series–inspired calculator built with React and Framer Motion,
unit-tested with Vitest, and packaged as a tiny multi-stage Docker image.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 14 unit tests on the calculator engine
```

## Docker
```bash
docker build -t et26-calculator .
docker run -p 8080:80 et26-calculator
# open http://localhost:8080
```
Tests run *inside* the Docker build — a broken calculator can never ship.

## Architecture
- `src/calculator.js` — pure reducer state machine (all logic, zero UI)
- `src/calculator.test.js` — Vitest suite: chaining, decimals, divide-by-zero, digit caps
- `src/App.jsx` — UI with framer-motion spring key-presses and LCD transitions
- `Dockerfile` — node build stage → nginx:alpine serve stage (~50 MB final image)

## Features
- Chained operations, percent, sign toggle, 12-digit cap
- Divide-by-zero error state, recoverable only via AC
- Full keyboard support (digits, + - * / % . Enter Esc)
- Reduced-motion respected, visible focus rings
