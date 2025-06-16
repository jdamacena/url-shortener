# URL Shortener

A modern, full-featured URL shortener web application built with Node.js, Express, MongoDB, and Vue 3 (SPA). Easily create, manage, and analyze short links with user authentication and professional analytics dashboards.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** Passport.js (Local Strategy), express-session, bcryptjs
- **Frontend:** Vue 3 (SPA), Pinia, Vue Router, Tailwind CSS, Chart.js (via vue-chartjs)
- **Other Libraries:** shortid, validator, dotenv

## Features

- User registration and login (with session support)
- Authenticated users can create short URLs
- Set or remove expiration dates for short URLs ("never expires" supported)
- Dashboard to manage your links (activate/deactivate with toggle, copy, analytics)
- Analytics for each short URL: click count, referrers, access logs, last accessed, user agents, and more
- Edit the original URL and expiration for your short links
- Professional analytics page with interactive charts (clicks over time, referrers, user agents)
- Responsive, modern UI styled with Tailwind CSS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (local or remote)

### Installation

1. Clone this repository:
   ```powershell
   git clone <repo-url>
   cd new-url-shortner
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure environment variables:
   - Copy `.env` and set your `MONGODB_URI`, `SESSION_SECRET`, and `PORT` as needed.
4. Build Tailwind CSS (in a separate terminal):
   ```powershell
   npm run build:css
   ```
5. Start the server:
   ```powershell
   npm start
   ```
6. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Register a new account or log in.
- Shorten URLs from the dashboard.
- Manage your links: activate/deactivate, copy, view analytics, edit original URL or expiration.
- View analytics for each link (clicks, referrers, access logs, user agents, interactive charts).

## Project Structure

- `server.js` - Main Express server
- `models/` - Mongoose models for User and URL
- `routes/` - Express route files for API endpoints
- `src/` - Vue 3 SPA source code (components, stores, styles)
- `public/` - Static assets (favicon, etc.)

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run build:css` - Build Tailwind CSS

## Environment Variables

See `.env` for example configuration:

```
MONGODB_URI=mongodb://localhost:27017/url_shortener
SESSION_SECRET=your_session_secret_here
PORT=3000
```

---

**Author:** Junior Damacena
