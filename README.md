# KCO Billing Dashboard
<<<<<<< HEAD
=======
## Introduction

KCO Billing Dashboard is a simple internal web app that demonstrates multi-cloud cost visibility.
It reads sample billing exports (AWS / GCP / Azure), consolidates and processes them on a small Node.js/Express backend, and displays the results in a React frontend dashboard. The app is intended as a take-home assignment to show full-stack ability, clean UI, and reasonable code structure.


## Features

Load sample cloud billing data (JSON/CSV) from the backend.

Data table view showing: date, cloud provider, service, team, environment, cost.

Sorting by date and cost.

Filters for: cloud provider, team, and environment (prod/staging/dev).

Summary cards showing:

Total spend (filtered)

Spend by cloud provider (AWS / GCP / Azure)

Graceful loading and empty states (e.g., “Loading data…”, “No data found for this filter”).

Basic responsive layout suitable for desktop and tablet.


## Technologies Used

Frontend: React (Create React App or Vite)

HTTP client: Axios

Backend: Node.js + Express

Data: Local JSON/CSV sample files (located in backend/data/)

Dev tools: nodemon (optional dev server), npm or yarn

Optional: Chart library (if implemented for bonus — e.g., Chart.js or Recharts)


## Getting Started

These instructions will get a copy of the project running on your local machine for development and evaluation.

### Prerequisites

Make sure you have the following installed:

Node.js (v16+ recommended) — https://nodejs.org

npm (comes with Node) or yarn
Optional (recommended for development):

gh CLI for GitHub operations

nodemon installed globally for automatic backend restarts: npm install -g nodemon


### Installation

1. Clone the repo

git clone https://github.com/<your-username>/kco-billing-dashboard.git
cd kco-billing-dashboard

2. Install backend dependencies

cd backend
npm install

3. Install frontend dependencies

Open a new terminal (or go back to project root):

cd frontend
npm install


4. Confirm sample data

Ensure the sample billing files exist:

backend/data/
  ├─ aws-sample.json
  ├─ gcp-sample.json
  └─ azure-sample.json

If not present, add JSON files matching the sample model:

[
  {
    "date": "2025-01-01",
    "cloud_provider": "AWS",
    "service": "EC2",
    "team": "Core",
    "env": "prod",
    "cost_usd": 1234.56
  }
]

## Usage

### Start backend

From the backend folder:

npm run dev

### Start frontend

From the frontend folder (in a separate terminal):

npm start