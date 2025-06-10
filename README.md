# URL Shortener

A modern, full-featured URL shortener web application built with Node.js, Express, MongoDB, and EJS. Easily create, manage, and analyze short links with user authentication and analytics.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** Passport.js (Local Strategy), express-session, bcryptjs
- **Templating:** EJS
- **Frontend:** Tailwind CSS, Vanilla JavaScript
- **Other Libraries:** shortid, validator, dotenv

## Features

- User registration and login (with session support)
- Authenticated users can create short URLs
- Set expiration dates for short URLs (optional)
- Dashboard to manage your links (activate/deactivate, copy, analytics)
- Analytics for each short URL: click count, referers, access logs, last accessed, etc.
- Edit the original URL for your short links
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
- Manage your links: activate/deactivate, copy, view analytics, or edit the original URL.
- View analytics for each link (clicks, referers, access logs).

## Project Structure
- `server.js` - Main Express server
- `models/` - Mongoose models for User and URL
- `views/` - EJS templates for all pages
- `public/` - Static assets (CSS, JS, favicon)
- `public/css/` - Tailwind CSS source and output
- `public/js/` - Client-side scripts

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
