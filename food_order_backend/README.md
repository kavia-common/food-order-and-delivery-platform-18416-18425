# Food Order Backend

Express.js backend for a food ordering and delivery platform. Provides REST API for:
- Authentication (register, login)
- Users (profile, list users - admin)
- Menu items (CRUD)
- Orders (create, list, get, update status)

Environment variables are documented in .env.example.

Getting started:
1) Install dependencies:
   npm install
2) Create a .env file based on .env.example and set JWT_SECRET.
3) Run in dev:
   npm run dev
4) API docs:
   http://localhost:${PORT}/docs

Notes:
- This implementation uses an in-memory datastore for simplicity. Replace datastore.js with a real database integration for persistence.
- Swagger is available at /docs and includes bearerAuth security for JWT.
