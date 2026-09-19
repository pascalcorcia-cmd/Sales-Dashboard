# Mon Sales Dashboard

**Fusion complète:** Smart Sales Agent Commercial + Reunions Manager — tout-en-un Sales & Meetings.

## 🎯 Features

### Sales Agent (💼)
- Recherche web prospect
- Qualification BANT/MEDDPICC
- Analysis fichiers (Excel, CSV, PDF)
- Account planning
- Génération emails de prospection

### Meetings Manager (📅)
- Wizard 7-step (Contexte → Suivi)
- Génération d'agenda IA
- Compte-rendu automatique
- Email suivi post-réunion
- Tracking des actions

## 🏗️ Architecture Unifiée

```
mon-sales-dashboard/
├── backend/ (Python FastAPI)
│   ├── app/
│   │   ├── agent.py           → Sales agent logic
│   │   ├── tools/              → Web search, file handler, API caller
│   │   └── features/meetings/  → NEW: Meetings feature module
│   │       ├── service.py
│   │       ├── routes.py
│   │       └── prompts.py
│   ├── requirements.txt         (+python-docx)
│   └── start.py                 (PORT env var support)
│
├── frontend/ (React 18 + Redux)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SalesAgent.jsx
│   │   │   └── MeetingsWizard.jsx
│   │   ├── store/
│   │   │   ├── slices/meetingsSlice.js
│   │   │   └── store.js
│   │   └── App.jsx              (Unified nav: Sales + Meetings)
│   └── package.json             (+@reduxjs/toolkit, react-redux, axios)
│
├── Dockerfile  (FastAPI + React unified)
├── docker-compose.yml
└── .railwayignore
```

## 🚀 Installation

```bash
# Install dependencies
npm run install:all    # Installs both backend & frontend

# Development
npm run dev:backend    # FastAPI on port 8000
npm run dev:frontend   # Vite on port 5173

# Production
npm run build          # Build React + copy to backend/static
npm start              # Production server
```

## 🔧 Configuration

```env
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
PORT=8000
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com
MEETINGS_ENABLED=true
```

## 📦 All 25 Changes Applied

### Backend (Python/FastAPI)
✅ #1 Conversations → SQLite persistence
✅ #2 PORT env var support
✅ #3 Health check endpoints
✅ #4 CORS configurable
✅ #5 Double load_dotenv fixed
✅ #6 Logging added
✅ #7 MAX_ITERATIONS constant
✅ #8 MAX_TOKENS constant
✅ #4 python-docx added

### Frontend (React + Redux)
✅ #6 MeetingsWizard page
✅ #7 meetingsSlice Redux
✅ #8 Meetings components
✅ #9 Unified App.jsx nav
✅ #10 HistoryPanel removed (REUNION only)

### Code Quality
✅ #11-15 Ponytail optimizations
✅ #20 .env.example updated
✅ #12 Meetings CORS added

### Docker/Production
✅ #14 node:20-slim (optimized)
✅ #17 Dockerfile labels
✅ #18 RUN mkdir optimized
✅ #15 .railwayignore created

### Configuration
✅ #18 Unified .env config
✅ #16 MEETINGS_ENABLED flag

## 🚢 Railway Deployment

```bash
# Automatic:
# - Dockerfile detected → builds multi-stage
# - PORT env var → Railway assigns dynamically
# - Health check → integrated
# - Persistence → SQLite local (upgrade to cloud DB for prod)
```

## 📝 Todo
- [ ] TypeScript migration
- [ ] Tests (Jest + RTL)
- [ ] Cloud DB (PostgreSQL for production)
- [ ] DOCX export for meetings
- [ ] Advanced scheduling
- [ ] Multi-user support

## 📄 License
MIT
