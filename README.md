# JeevanSetu — Smart Medical & Ambulance Tracking System

## About the Project

JeevanSetu is a responsive web application concept for coordinating student emergency requests, ambulance assignments, and status updates in one place. It provides separate Student and Admin experiences: students can submit and review requests, while admins can manage dispatches, ambulances, drivers, and student records.

This repository contains a frontend-only demonstration. It uses mock data and browser `localStorage`; it does not connect to a backend, provide live GPS tracking, or dispatch real emergency services.

## Institutional Branding & Credits

| Placement | Content |
| --- | --- |
| Header | ABESEC Ghaziabad |
| Footer attribution | Developed & Maintained By: Himanshu Chaubey and Harsh Nagayach |
| Department | CSE, Section-11 |
| Team | Full Stack Development Team |
| Footer copyright | © 2026 ABESEC Ghaziabad. All Rights Reserved. |

## Key Features

- Role-based demo login for Admin and Student users.
- Student dashboard for creating requests and viewing request history and status.
- Admin tools for managing emergency requests, ambulances, drivers, and student records.
- Ambulance tracking preview with simulated locations and status updates.
- Responsive landing page and dashboards, with charts and map-based visualizations.

## Live Demo

**Render URL:** [https://jeevansetu-m02o.onrender.com](https://jeevansetu-m02o.onrender.com)

## Demo Login Credentials

Select the matching role on the login screen:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `Admin@123` |
| Student | `student` | `Student@123` |

These credentials are for this frontend demo only. They are not production authentication.

## Technology Stack

- React and Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- React Leaflet and OpenStreetMap
- Recharts

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

The live app is hosted on Render. Its Static Site uses an SPA rewrite from `/*` to `/index.html` so React Router routes load directly. The same rewrite is included in `render.yaml` for Blueprint-based deployments.
