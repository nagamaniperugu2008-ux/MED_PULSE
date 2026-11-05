# Med Pulse

Med Pulse is a prototype predictive emergency blood network dashboard for Visakhapatnam (Vizag). It displays sample hospital blood-stock and risk data, simulates donor outreach and emergency dispatch, and includes a Telugu/English interface.

> **Prototype notice:** Hospital data is held in memory by the backend and resets when it restarts. Donor registration and blood-report analysis are UI demonstrations; they do not save donor details, process uploaded files, or provide medical advice.

## Features

- Hospital inventory, capacity, and shortage-risk dashboard
- Individual preemptive and network-wide emergency dispatch simulations
- Live emergency hub and donor portal screens
- English and Telugu language toggle
- Simulated blood-report analysis
- Local frontend fallback sample data when the API is unavailable

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express 4, CORS

## Prerequisites

- Node.js 18 or later
- npm

## Run locally

Run the backend and frontend in separate terminals from the project directory.

### Start the backend

```powershell
cd backend
npm install
npm run dev
```

The API starts at `http://localhost:5000`. To run without watch mode, use `npm start`.

### Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The frontend connects to `http://localhost:5000/api`.

### Build the frontend

```powershell
cd frontend
npm run build
npm run preview
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/hospitals` | Returns the sample hospital network nodes. |
| `POST` | `/api/dispatch/:id` | Simulates preemptive outreach for a hospital node. |
| `POST` | `/api/emergency-dispatch` | Simulates a broadcast to high- and medium-risk nodes. |

The backend listens on port `5000` by default. Set the `PORT` environment variable to use a different port. If you change the backend port, update the API base URL in `frontend/src/app.jsx`.

## Project structure

```text
MED-PULSE/
├── backend/
│   ├── server.js       # Express API and in-memory sample data
│   └── package.json
└── frontend/
    ├── index.html
    ├── src/
    │   ├── app.jsx     # Dashboard and prototype interactions
    │   ├── main.jsx    # React entry point
    │   └── index.css
    └── package.json
```

## Development notes

- Install dependencies separately in `backend` and `frontend`; each has its own `package.json`.




























































































































- No database, authentication, report OCR/AI service, or persistent donor-registration API is configured in this prototype.
- The project currently has no test scripts configured.