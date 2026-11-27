# JeevanSetu — Smart Medical & Ambulance Tracking System

JeevanSetu is a responsive frontend demonstration for coordinating emergency requests, ambulance assignments, and status updates. It uses mock data and browser storage only; it does not connect to a backend or dispatch real emergency services.

## Live Demo

[Open the JeevanSetu live demo](https://jeevansetu-m02o.onrender.com).

## Demo Login Credentials

Choose the matching role on the login screen:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `Admin@123` |
| Student | `student` | `Student@123` |

These are frontend-only demo credentials and are not suitable for production authentication.

## Run Locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Deployment

The live app is hosted on Render at [jeevansetu-m02o.onrender.com](https://jeevansetu-m02o.onrender.com). The Static Site uses an SPA rewrite from `/*` to `/index.html` so React Router routes load directly. The same rewrite is included in `render.yaml` for Blueprint-based deployments.

## Technology

- React and Vite
- Tailwind CSS
- React Router
- Lucide React
- React Leaflet and OpenStreetMap
- Recharts
