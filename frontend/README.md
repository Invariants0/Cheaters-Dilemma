# Frontend - The Cheater's Dilemma

A Next.js web interface for the multi-agent game-theoretic simulation.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Connection

The frontend expects the backend API to be running on `http://localhost:8000/api/v1`.

Make sure to start the backend first:

```bash
cd backend
uv run uvicorn app.main:app --reload
```

## Features

- **Landing Page**: Overview of the simulation and agent strategies
- **Simulation Control**: Start and step through simulations in real-time
- **Agent Monitoring**: View agent status, resources, and reputation
- **Event Log**: Real-time event streaming
- **Replay System**: Browse and replay completed simulations

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Landing page
│   ├── simulation/        # Simulation control page
│   ├── agents/            # Agent management (placeholder)
│   ├── rules/             # Rules management (placeholder)
│   └── replays/           # Replay browser
├── components/            # Reusable React components
│   └── Navigation.tsx     # Main navigation bar
└── lib/                   # Utilities and API client
    ├── api.ts            # API client for backend communication
    └── types.ts          # TypeScript type definitions
```

## API Integration

The frontend communicates with the FastAPI backend through REST endpoints:

- `GET /api/v1/simulation/state` - Current simulation state
- `POST /api/v1/simulation/start` - Start new simulation
- `POST /api/v1/simulation/{id}/step` - Advance simulation
- `GET /api/v1/replays/` - List completed simulations

## Development Notes

- Uses TypeScript for type safety
- Tailwind CSS for styling
- API client handles all backend communication
- Real-time updates through polling (WebSocket support planned for Phase 2)
