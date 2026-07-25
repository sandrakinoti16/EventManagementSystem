# Event Management System - Dashboard & Reports Feature Module

This module contains the frontend dashboard landing page, the detailed reports page, and supporting styles and scripting mock functionality.

## Module Folder Structure

*   `index.html` — The main landing page for the dashboard.
*   `reports.html` — The reports viewer featuring participants, events, and attendance reports.
*   `dashboard.css` — Modular design system stylesheet. Handles colors, custom typography, KPI stats, tables, grids, and responsiveness.
*   `dashboard.js` — Client-side interactive engine. Pre-configured with mock database states, dropdown toggling, charts rendering using Chart.js, search filters, and page selector routing.
*   `assets/` — Folder for static SVG icons and empty state illustrations.

## Design System Tokens (Extracted from original login screen mockup)

If you need to adjust styles or write new panels, please use defined CSS variables inside `dashboard.css`:
*   Primary Deep Blue theme color: `--primary-blue` (`#0D2E57`)
*   Main Button very dark blue color: `--btn-primary` (`#101828`)
*   Accent Gold highlight color: `--accent-gold` (`#FDB022`)
*   Body main text color: `--text-main` (`#1F1F1F`)
*   Cards border-radius: `--radius-card` (`24px`)
*   Button and inputs border-radius: `--radius-el` (`12px`)

## Backend Integration Details

Currently, the UI is connected to dynamic rendering operations that fetch mock records asynchronously. All mock data retrieval routes are structured as standard `async/await` functions:

```javascript
async function fetchStatsCardsData();
async function fetchUpcomingEvents();
async function fetchRecentActivity();
async function fetchNotifications();
async function fetchReportsData(type);
```

### Steps to connect a Real REST API:
1. Replace the inner mock arrays in `dashboard.js` with standard HTTP API endpoints.
2. Edit the data-fetch functions to perform `fetch()` queries. E.g.:
```javascript
async function fetchUpcomingEvents() {
  const response = await fetch('/api/events/upcoming');
  if (!response.ok) throw new Error('API fetch failed');
  return await response.json();
}
```
3. Ensure the JSON returned matches the expected properties (`id`, `name`, `date`, `location`, `participants`, `status`, `statusClass`).
