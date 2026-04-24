# Quantyx v4 — NSE Stock Market App

A React + Vite + Tailwind + Node.js stock market app focused on Indian (NSE) markets.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start both server + frontend together
npm run dev:all
```

Or run them separately:
```bash
# Terminal 1 — backend proxy (port 3001)
npm run server

# Terminal 2 — frontend dev server (port 5173)
npm run dev
```

Then open: **http://localhost:5173**

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start both backend + frontend (recommended) |
| `npm run server` | Backend proxy only (port 3001) |
| `npm run dev` | Frontend only (port 5173) |
| `npm run build` | Production build |

## ✅ v4 Fixes & Improvements

### Backend (`server.js`)
- **Removed all Yahoo Finance library/SDK** — uses raw `fetch` only
- **NSE-only**: All symbols normalized to `SYMBOL.NS` via `normalizeSymbol()`
- **Structured JSON errors** on every endpoint — no unhandled crashes
- **No console spam** — errors caught and returned as `{ error: "..." }`
- **Indian volume formatting**: Cr, L, K instead of B/M

### Frontend

#### Watchlist (`src/pages/Watchlist.jsx`)
- Switched from manual `setInterval` polling → **React Query** `useQuotes` hook
- Single bulk API call for all watchlist symbols (no per-symbol loops)
- **Debounced search** (300ms) — no API calls on every keystroke
- **Skeleton loaders** while data is loading
- **Error fallback UI** when server is unreachable
- Symbols normalized on load from localStorage (strips stale `.NS` suffixes)
- Click-outside closes dropdown cleanly

#### Search Dropdown (`src/components/nav/MarketStatusBar.jsx`)
- **Solid background** (`bg-[#0b0f14]`) — no more transparency/readability issues
- **`z-50`** — floats above all page content
- `onMouseDown` prevents input blur before click registers
- Debounced (250ms) so it doesn't filter on every keypress
- No parent `overflow:hidden` clipping the dropdown

#### AppShell (`src/components/nav/AppShell.jsx`)
- Removed `overflow:hidden` from header's ancestor — dropdown no longer gets clipped

#### React Query Config (`src/hooks/useMarketData.js`)
- `staleTime: 2min` — avoids redundant refetches
- `gcTime: 5min` — keeps cache warm
- `refetchOnWindowFocus: false` — no surprise refetch on tab switch
- `retry: 1` — fast failure, no infinite retry loops

#### Symbol Consistency (`src/services/apiClient.js`, `src/lib/api.js`)
- `normalizeSymbol()` exported from `apiClient.js` and used everywhere
- All stored watchlist symbols are bare (e.g., `RELIANCE` not `RELIANCE.NS`)
- Server normalizes to `.NS` internally before calling upstream

## 🏗 Architecture

```
quantyx-v4/
├── server.js               ← Express proxy (NSE-only, port 3001)
├── src/
│   ├── services/
│   │   └── apiClient.js    ← fetch wrappers + normalizeSymbol()
│   ├── lib/
│   │   ├── api.js          ← cache-aware wrappers around apiClient
│   │   ├── cache.js        ← localStorage TTL cache
│   │   └── nseStocks.js    ← NSE stock universe for search
│   ├── hooks/
│   │   └── useMarketData.js ← React Query hooks (quotes, candles, technicals)
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Watchlist.jsx   ← Fixed: React Query + dropdown UI
│   │   └── Simulator.jsx
│   └── components/
│       └── nav/
│           ├── AppShell.jsx       ← Fixed: no overflow:hidden
│           └── MarketStatusBar.jsx ← Fixed: solid dropdown, debounce
```

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Server health check |
| `GET /api/quotes?symbols=RELIANCE,TCS` | Live quotes for 1+ symbols |
| `GET /api/candles?symbol=RELIANCE&range=1mo&interval=1d` | OHLCV candle data |
| `GET /api/technicals?symbol=RELIANCE` | RSI, MACD, SMA, Pivot Points |
| `GET /api/heatmap` | Nifty 50 performance heatmap |

All symbols automatically normalized to NSE format internally.
