# Monorepo Structure

The project is now organized into a monorepo with separate frontend and backend folders:

## 📁 Folder Structure

```
.
├── frontend/
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── eslint.config.js        # ESLint configuration
│
├── backend/
│   ├── server.js               # Express server
│   └── package.json            # Backend dependencies
│
├── package.json                # Root package.json with workspaces
├── package-lock.json           # Root lock file
└── README.md                   # Project documentation
```

## 🚀 Available Commands

### Root Commands (run from project root)

```bash
# Install all dependencies
npm run install:all

# Development mode (runs both frontend and backend)
npm run dev:all

# Build frontend only
npm run build

# Preview frontend build
npm run preview

# Start backend server only
npm run server

# Development mode for frontend only
npm run dev
```

### Frontend Commands (run from `/frontend` directory)

```bash
npm run dev       # Start Vite dev server on port 5173
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend Commands (run from `/backend` directory)

```bash
npm start         # Start Express server on port 3001
npm run dev       # Same as npm start
```

## 📦 Dependencies

### Frontend
- React 18.3.1
- Vite 5.4.19
- TailwindCSS 3.4.17
- Radix UI components
- React Router
- Framer Motion
- Lightweight Charts

### Backend
- Express 4.19.2
- CORS middleware

## 🔧 Setup Instructions

1. **First time setup:**
   ```bash
   npm run install:all
   ```

2. **Development:**
   ```bash
   npm run dev:all
   ```
   This will start both the backend server (port 3001) and frontend dev server (port 5173) concurrently.

3. **Production build:**
   ```bash
   npm run build
   ```

## 📝 Notes

- The frontend is a React + Vite application
- The backend is an Express.js server serving as a proxy for financial data
- The `concurrently` package is used to run frontend and backend simultaneously during development
- Both applications run on separate ports (3001 for backend, 5173 for frontend)
