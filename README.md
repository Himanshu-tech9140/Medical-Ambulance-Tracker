# JeevanSetu — Smart Medical & Ambulance Tracking System

JeevanSetu is a responsive frontend demonstration for coordinating emergency requests, ambulance assignments, and status updates. It uses mock data and browser storage only; it does not connect to a backend or dispatch real emergency services.

## Live Demo

Deployment is pending. The live Render URL will be added here after the first deployment is verified.

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

This repository includes a Render Blueprint (`render.yaml`) configured to build the Vite app and publish `dist/`, with an SPA rewrite for client-side routes. Connect the repository to Render as a Static Site to deploy.

## Technology

- React and Vite
- Tailwind CSS
- React Router
- Lucide React
- React Leaflet and OpenStreetMap
- Recharts
