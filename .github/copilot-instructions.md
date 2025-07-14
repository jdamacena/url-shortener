# URL Shortener Project - Copilot Instructions

## Project Overview

This is a Vue 3 URL shortener with Netlify Functions backend, MongoDB database, and JWT authentication.

## Architecture

- Frontend: Vue 3 + Vite + Tailwind CSS + Pinia stores
- Backend: Netlify Functions (serverless)
- Database: MongoDB with Mongoose
- Auth: JWT tokens with bcryptjs

## Development Best Practices

- Always reuse logic when applicable - don't reinvent the wheel
- Only change what's necessary for the requested feature
- Preserve existing formatting and structure unless explicitly asked to change
- Fail fast with clear error messages instead of silent fallbacks
- Frontend should be deployment-agnostic (no knowledge of hosting infrastructure)
- Use environment variables for all configuration, never hardcode values
- Maintain clean separation between frontend and backend concerns

## Code Quality

- Remove obvious or redundant comments that state what the code already shows
- When adding comments, write as the developer explaining the code, not as documentation
- Keep comments focused on "why" not "what"
- Prefer self-documenting code over extensive comments
- Only create additional files when explicitly requested or essential for the project

## Coding Standards

- Use Composition API (not Options API)
- Prefer `const` over `let`
- Use meaningful variable names
- Keep components focused and single-purpose
- Validate environment variables with fail-fast pattern
- Never commit .env files
- Document all required variables in .env.example

## Key Patterns

- API calls go through stores (urlStore, authStore)
- Use VITE_API_BASE_URL for API endpoints
- Use VITE_SITE_URL for user-facing URLs
- Handle errors gracefully in UI components

## API Design & Production Standards

- Follow RESTful principles: use proper HTTP methods (GET, POST, PATCH, DELETE)
- Each function should handle one resource or logical operation
- Use semantic function names that clearly indicate their purpose
- Structure endpoints logically: `/api/resource` and `/api/resource/:id`
- Implement consistent error handling with proper HTTP status codes (401, 403, 404, 405, 500)
- Validate all inputs and sanitize data before processing
- Use proper CORS headers for all API responses
- Return consistent JSON response formats
- Implement proper authentication and authorization checks

## Authentication & Security

- JWT tokens should include user ID and role
- Always verify JWT in protected routes
- Hash passwords with bcryptjs (salt rounds: 10)
- First registered user becomes admin automatically
- Validate input on both frontend and backend

## Netlify Functions Best Practices

- Keep each function focused on a single responsibility
- Use semantic naming: auth-login.js, url-shorten.js, url-update.js
- Handle CORS preflight requests properly
- Extract common logic into utils/ directory
- Use path parameters (not query parameters) for dynamic routes to preserve URL encoding
- Implement proper error boundaries and logging
- Follow the flat file structure in netlify/functions/ root

## Database Patterns

- Use Mongoose schemas with proper validation
- Always handle MongoDB connection errors

## Component Structure

- Use `<script setup>` syntax for new components
- Extract reusable logic into composables

## State Management

- Keep API logic in Pinia stores
- Use computed properties for derived state
- Handle loading and error states consistently

## UI/UX Patterns

- Use Tailwind utility classes consistently
- Implement loading states for async operations
- Show user feedback for all actions

## Error Handling

- Display user-friendly error messages
- Log detailed errors server-side only
- Use try/catch blocks for all async operations
- Provide fallback UI for error states

## Avoid

- Hardcoded fallback URLs
- Coupling frontend to backend infrastructure
- Unnecessary comments that state the obvious
- Multiple HTTP methods in single functions (unless RESTful resource operations)
- Generic catch-all API routes - prefer explicit routing
- Exposing internal function structure to frontend
