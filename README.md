# URL Shortener

A modern, production-ready URL shortener web application with robust analytics, JWT authentication, role-based admin panel, QR code and sharing features, and a beautiful responsive dashboard. Built with Node.js, MongoDB, and Vue 3 (SPA) using Vite and Tailwind CSS. Deployable on Vercel or any compatible serverless platform.

## Features

- **JWT Authentication**: Secure login, registration, and persistent sessions.
- **Role-based Access**: System admin and user roles, with a powerful admin panel for user and URL management.
- **Short Link Management**: Create, edit, activate/deactivate, and delete short links. Expiration support.
- **Analytics**: Per-link analytics with click tracking, referrer, IP, user agent, and access logs. Visual charts and history.
- **Dashboard**: Responsive dashboard with search, filter, sort, and mobile-friendly card/table hybrid.
- **QR Code & Sharing**: Generate QR codes for each link, download as PNG, and share links via Web Share API or clipboard.
- **Admin Panel**: Manage users and URLs, search with tag-based queries, view user details, and perform admin actions.
- **SPA Routing**: All non-API routes handled by the Vue SPA. Public short links use `/r/:shortId`.
- **Production Ready**: Secure password hashing, CORS, error handling, and Vercel configuration for best-practice deployment.

## Tech Stack

- **Backend**: Node.js (Vercel serverless API routes), MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: Vue 3 (Vite), Pinia, Vue Router, Tailwind CSS, Chart.js (vue-chartjs), qrcode.vue
- **Other Libraries**: shortid, validator, dotenv, axios
- **Deployment**: Vercel (with `vercel.json` for SPA/API routing)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (local or remote)

### Setup

```powershell
npm install
```

1. Copy `.env.example` to `.env` and set your environment variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
2. Start the development server:
   ```powershell
   npm run dev
   # App runs at http://localhost:5173 (frontend) and http://localhost:3000/api (backend)
   ```

### Production Build

```powershell
npm run build
```

The output will be in the `dist/` folder.

### Deploying to Vercel

- The included `vercel.json` ensures all `/api/*` routes go to the backend, and all other routes are handled by the SPA.
- Set your environment variables in the Vercel dashboard.
- Push to your Git repository and connect to Vercel for automatic deployment.

## Usage

- Register and log in to manage your short links.
- Use the dashboard to create, search, filter, and analyze links.
- Click the QR code button to view and download a QR code for any link.
- Use the share button to share links via your device’s share options or copy to clipboard.
- Admins can access the admin panel for advanced user and URL management.

---

For questions or contributions, open an issue or pull request!
