# URL Shortener

A modern, full-featured URL shortener web application built with Node.js, Express, MongoDB, and Vue 3 (SPA). Easily create, manage, and analyze short links with user authentication and professional analytics dashboards.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Passport.js, express-session, bcryptjs
- **Frontend:** Vue 3 (Vite), Pinia, Vue Router, Tailwind CSS, Chart.js (vue-chartjs)
- **Other Libraries:** shortid, validator, dotenv

## Monorepo Structure

- `backend/` - Express API server, authentication, MongoDB models, API routes
  - `server.js` - Main Express server
  - `models/` - Mongoose models for User and URL
  - `routes/` - Express route files for API endpoints
- `frontend/` - Vue 3 SPA (Vite, Tailwind, Pinia, etc.)
  - `src/` - Vue components, stores, styles
  - `public/` - Static assets (favicon, etc.)
  - `dist/` - Production build output (after `npm run build`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (local or remote)

### Clone the Repository

```powershell
git clone https://github.com/jdamacena/url-shortner.git
cd url-shortner
```

---

## Backend Setup

```powershell
cd backend
npm install
```

1. Copy `.env.example` to `.env` and set your environment variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   SESSION_SECRET=your_session_secret_here
   PORT=3000
   ```
2. Start the server:
   ```powershell
   npm start
   # or for auto-reload:
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000)

---

## Frontend Setup

```powershell
cd frontend
npm install
```

### Development

```powershell
npm run dev
# App runs at http://localhost:5173 (or as shown in terminal)
```

### Production Build

```powershell
npm run build
```

The output will be in the `dist/` folder.

### Preview Production Build Locally

```powershell
npm run preview
```